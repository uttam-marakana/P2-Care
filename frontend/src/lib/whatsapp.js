const DEFAULT_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9118001234567";

export function buildWhatsAppUrl(message, number = DEFAULT_NUMBER) {
  const normalizedNumber = String(number).replace(/\D/g, "");
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message, number = DEFAULT_NUMBER) {
  const url = buildWhatsAppUrl(message, number);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function appointmentWhatsAppMessage(values) {
  return [
    "Hello P2Care Hospital,",
    "",
    "I would like to follow up about my appointment request.",
    "",
    `Name: ${values.name || "Not provided"}`,
    `Phone: ${values.phone || "Not provided"}`,
    `Email: ${values.email || "Not provided"}`,
    `Department: ${values.reason || "General care"}`,
    `Preferred date: ${values.date || "Not specified"}`,
    `Preferred time: ${values.time || "Not specified"}`,
    `Notes: ${values.notes || "None"}`,
    "",
    "Please help me confirm the appointment details.",
  ].join("\n");
}

export function generalWhatsAppMessage() {
  return [
    "Hello P2Care Hospital,",
    "",
    "I would like to speak with a care coordinator.",
    "Please help me with my enquiry.",
  ].join("\n");
}
