const DEFAULT_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "9118001234567";

export function buildWhatsAppUrl(message, number = DEFAULT_NUMBER) {
  const normalizedNumber = String(number).replace(/\D/g, "");
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message, number = DEFAULT_NUMBER) {
  const url = buildWhatsAppUrl(message, number);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function appointmentWhatsAppMessage(values, t = (text) => text) {
  return [
    t("Hello P2Care Hospital,"),
    "",
    t("I would like to follow up about my appointment request."),
    "",
    `${t("Name")}: ${values.name || t("Not provided")}`,
    `${t("Phone")}: ${values.phone || t("Not provided")}`,
    `${t("Email")}: ${values.email || t("Not provided")}`,
    `${t("Department")}: ${t(values.reason || "General care")}`,
    `${t("Preferred date")}: ${values.date || t("Not specified")}`,
    `${t("Preferred time")}: ${values.time || t("Not specified")}`,
    `${t("Notes")}: ${values.notes || t("None")}`,
    "",
    t("Please help me confirm the appointment details."),
  ].join("\n");
}

export function generalWhatsAppMessage(t = (text) => text) {
  return [
    t("Hello P2Care Hospital,"),
    "",
    t("I would like to speak with a care coordinator."),
    t("Please help me with my enquiry."),
  ].join("\n");
}
