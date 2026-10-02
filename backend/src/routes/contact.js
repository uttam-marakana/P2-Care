import { Router } from "express";
import { z } from "zod";
import { config } from "../lib/config.js";
import { asyncHandler, created, fail } from "../lib/http.js";
import { publicWriteRateLimit } from "../middleware/security.js";
import {
  addMockContactInquiry,
  addMockNewsletterSubscriber,
} from "../lib/mockStore.js";
import { Resend } from "resend";
import { addDocument } from "../lib/firestore.js";

const router = Router();
const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;
const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  reply: z.string().trim().min(3).max(160),
  message: z.string().trim().min(3).max(5000),
});
const newsletterSchema = z.object({
  email: z.string().trim().email().max(160),
});

async function sendHospitalEmail(subject, text) {
  if (
    config.useMockData ||
    !resend ||
    !config.notificationFromEmail ||
    !config.hospitalNotificationEmail
  )
    return { status: "skipped" };
  try {
    await resend.emails.send({
      from: config.notificationFromEmail,
      to: [config.hospitalNotificationEmail],
      subject,
      text,
    });
    return { status: "sent" };
  } catch (error) {
    return {
      status: "failed",
      message: error?.message || "Email delivery failed.",
    };
  }
}

router.post(
  "/inquiries",
  publicWriteRateLimit,
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success)
      return fail(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid contact details.",
        parsed.error.flatten(),
      );
    const inquiry = { ...parsed.data, created_at: new Date().toISOString() };
    if (config.useMockData) addMockContactInquiry(inquiry);
    else await addDocument("contact_inquiries", inquiry);
    await sendHospitalEmail(
      `P2Care contact inquiry — ${inquiry.name}`,
      `Name: ${inquiry.name}\nReply: ${inquiry.reply}\n\n${inquiry.message}`,
    );
    return created(res, { inquiry: { received: true } });
  }),
);

router.post(
  "/newsletter",
  publicWriteRateLimit,
  asyncHandler(async (req, res) => {
    const parsed = newsletterSchema.safeParse(req.body);
    if (!parsed.success)
      return fail(
        res,
        400,
        "VALIDATION_ERROR",
        "Please provide a valid email address.",
        parsed.error.flatten(),
      );
    if (config.useMockData) addMockNewsletterSubscriber(parsed.data.email);
    else
      await addDocument("newsletter_subscribers", { email: parsed.data.email });
    return created(res, { subscription: { received: true } });
  }),
);

export default router;
