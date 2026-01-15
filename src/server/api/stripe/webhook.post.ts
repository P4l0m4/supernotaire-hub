import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig(event);
  const secret = runtime.STRIPE_SECRET_KEY;
  const webhookSecret =
    runtime.STRIPE_WEBHOOK_SECRET_TEST || runtime.STRIPE_WEBHOOK_SECRET;
  const sendgridKey = runtime.SENDGRID_API_KEY;

  if (!secret || !webhookSecret || !sendgridKey) {
    setResponseStatus(event, 400);
    return { error: "Clés Stripe/SendGrid manquantes." };
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-12-18.acacia" });
  const signature = getHeader(event, "stripe-signature");

  // Lecture brute du corps pour préserver l'intégrité du payload signé.
  const rawBody = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    event.node.req
      .on("data", (chunk) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });

  if (!signature || !rawBody) {
    setResponseStatus(event, 400);
    return { error: "Signature ou payload absent." };
  }

  try {
    const evt = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    if (evt.type === "checkout.session.completed") {
      const session = evt.data.object as Stripe.Checkout.Session;
      const email =
        session.customer_details?.email || session.customer_email || undefined;
      let customerId =
        typeof session.customer === "string" ? session.customer : undefined;

      if (!email) {
        console.error("[Stripe webhook] email manquant, session:", session.id);
        return { received: true };
      }

      // Cherche un client existant via l'email avant d'en créer un.
      if (!customerId) {
        const searchResult = await stripe.customers.search(
          { query: `email:'${email}'` },
          { idempotencyKey: `customer_search_${session.id}` }
        );
        const existingCustomer = searchResult.data[0];
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const newCustomer = await stripe.customers.create(
            { email },
            { idempotencyKey: `customer_${session.id}` }
          );
          customerId = newCustomer.id;
        }
      }

      const now = Math.floor(Date.now() / 1000);

      // Réutilise un code promo actif existant pour ce customer si possible.
      let promoCode:
        | Stripe.PromotionCode
        | Stripe.Response<Stripe.PromotionCode>
        | null = null;

      const existingPromos = await stripe.promotionCodes.list(
        {
          customer: customerId,
          active: true,
          limit: 10,
        },
        { idempotencyKey: `promo_search_${session.id}` }
      );

      promoCode =
        existingPromos.data.find((p) => {
          const notExpired = !p.expires_at || p.expires_at > now;
          const hasRedemptionsLeft =
            p.max_redemptions == null || p.times_redeemed < p.max_redemptions;
          return notExpired && hasRedemptionsLeft;
        }) || null;

      if (!promoCode) {
        // Code déterministe pour rester idempotent sur les retries du webhook.
        const code =
          "SN-" +
          crypto
            .createHash("sha256")
            .update(session.id)
            .digest("hex")
            .slice(0, 8)
            .toUpperCase();

        // Coupon 100%.
        const coupon = await stripe.coupons.create(
          {
            percent_off: 100,
            duration: "once",
          },
          { idempotencyKey: `coupon_${session.id}` }
        );

        const expiresAt = Math.floor(
          (Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000
        );

        // Code promo unique, lié au customer, expiration 1 an, jusqu'à 100 utilisations.
        promoCode = await stripe.promotionCodes.create(
          {
            coupon: coupon.id,
            code,
            customer: customerId,
            max_redemptions: 100,
            expires_at: expiresAt,
          },
          { idempotencyKey: `promo_${session.id}` }
        );
      }

      sgMail.setApiKey(sendgridKey);
      await sgMail.send({
        to: email,
        from: "contact@easycase.fr",
        templateId: "d-539af6f382fd4df39ba6b8aee0cf1671",
        dynamicTemplateData: {
          code: promoCode.code,
        },
      });

      console.log(
        "[Stripe webhook] Paiement confirmé, code promo envoyé",
        session.id,
        promoCode.code,
        email
      );
    }

    return { received: true };
  } catch (err) {
    console.error("[Stripe webhook] signature invalide", err);
    setResponseStatus(event, 400);
    return { error: "Signature invalide" };
  }
});
