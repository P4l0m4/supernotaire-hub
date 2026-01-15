import { defineEventHandler, readBody, setResponseStatus } from "h3";
import sgMail from "@sendgrid/mail";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.SENDGRID_API_KEY;
  const fromEmail = "contact@easycase.fr";

  if (!apiKey) {
    setResponseStatus(event, 500);
    return { error: "ClǸ SendGrid manquante (SENDGRID_API_KEY)." };
  }

  sgMail.setApiKey(apiKey);

  const body = await readBody<{
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
    templateId?: string;
    dynamicTemplateData?: Record<string, unknown>;
  }>(event);

  const isTemplate = Boolean(body?.templateId);
  const hasBasicContent =
    Boolean(body?.subject) && (Boolean(body?.text) || Boolean(body?.html));

  if (!body?.to || (!isTemplate && !hasBasicContent)) {
    setResponseStatus(event, 400);
    return {
      error: "Champs requis: to et (templateId ou subject + text/html).",
    };
  }

  try {
    if (isTemplate) {
      await sgMail.send({
        to: body.to,
        from: fromEmail,
        templateId: body.templateId,
        dynamicTemplateData: body.dynamicTemplateData || {},
      });
    } else {
      await sgMail.send({
        to: body.to,
        from: fromEmail,
        subject: body.subject,
        text: body.text,
        html: body.html,
      });
    }
    return { sent: true };
  } catch (error) {
    console.error("[SendGrid] send failed", error);
    setResponseStatus(event, 500);
    return { error: "Envoi email ǸchouǸ." };
  }
});
