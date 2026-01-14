import Stripe from "stripe";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const secretKey = config.STRIPE_SECRET_KEY;
  const priceId = config.STRIPE_PRICE_EXPORT;

  if (!secretKey) {
    setResponseStatus(event, 500);
    return { error: "Stripe secret key manquante." };
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" });

  try {
    const origin = getRequestURL(event).origin;
    const successUrl = `${origin}/outils/checklist-dossier-vente-notaire?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/outils/checklist-dossier-vente-notaire?payment=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error("[Stripe] create-session error", error);
    setResponseStatus(event, 500);
    return { error: "Impossible de créer la session de paiement." };
  }
});
