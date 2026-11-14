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
import { collectionRef, deleteDocument } from "../lib/firestore.js";
import { randomUUID } from "node:crypto";
import { unsubscribeMockNewsletter } from "../lib/mockStore.js";

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
    else {
      const email = parsed.data.email.toLowerCase();
      const existing = await collectionRef("newsletter_subscribers").where("email", "==", email).limit(1).get();
      if (existing.empty) {
        await addDocument("newsletter_subscribers", {
          email,
          unsubscribe_token: randomUUID(),
          created_at: new Date().toISOString(),
        });
      }
    }
    return created(res, { subscription: { received: true } });
  }),
);

router.post(
  "/newsletter/unsubscribe",
  publicWriteRateLimit,
  asyncHandler(async (req, res) => {
    const parsed = z.object({ token: z.string().uuid() }).safeParse(req.body);
    if (!parsed.success) return fail(res, 400, "INVALID_UNSUBSCRIBE_TOKEN", "A valid unsubscribe link is required.");
    if (config.useMockData) {
      if (!unsubscribeMockNewsletter(parsed.data.token)) return fail(res, 404, "SUBSCRIPTION_NOT_FOUND", "This subscription was not found or was already removed.");
      return created(res, { unsubscribed: true });
    }
    const snapshot = await collectionRef("newsletter_subscribers")
      .where("unsubscribe_token", "==", parsed.data.token)
      .limit(1)
      .get();
    if (snapshot.empty) return fail(res, 404, "SUBSCRIPTION_NOT_FOUND", "This subscription was not found or was already removed.");
    const subscriber = snapshot.docs[0];
    const email = String(subscriber.data().email || "").trim().toLowerCase();
    await deleteDocument("newsletter_subscribers", subscriber.id);
    const profiles = await collectionRef("profiles").where("email", "==", email).get();
    await Promise.all(profiles.docs
      .filter((doc) => doc.data().role === "patient" && doc.data().newsletter_opt_in)
      .map((doc) => doc.ref.update({ newsletter_opt_in: false, updated_at: new Date().toISOString() })));
    return created(res, { unsubscribed: true });
  }),
);

export default router;
