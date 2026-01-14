import Stripe from "stripe";

const COOKIE_NAME = "sn_export_access";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const secretKey = config.STRIPE_SECRET_KEY;
  const stripe = secretKey
    ? new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" })
    : null;

  const existingCookie = getCookie(event, COOKIE_NAME);
  if (existingCookie === "1") {
    return { access: true };
  }

  const sessionId = getQuery(event).session_id as string | undefined;
  if (!sessionId || !stripe) {
    return { access: false };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaid = session.payment_status === "paid";
    if (isPaid) {
      setCookie(event, COOKIE_NAME, "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: getRequestURL(event).protocol === "https:",
        maxAge: 60 * 60 * 24 * 30, // 30 jours
      });
    }
    return { access: isPaid };
  } catch (error) {
    console.error("[Stripe] verify session failed", error);
    return { access: false };
  }
});
