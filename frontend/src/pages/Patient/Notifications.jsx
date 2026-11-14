import { useCallback, useEffect, useState } from "react";
import { FaBell, FaCheck, FaRotate } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";
import { getPatientNotifications, markPatientNotificationRead } from "@/services/patient";

function formatDate(value, language) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function PatientNotifications() {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setNotifications(await getPatientNotifications());
    } catch (loadError) {
      setError(loadError.message || t("Unable to load notifications."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { refresh(); }, [refresh]);

  const markRead = async (notification) => {
    try {
      await markPatientNotificationRead(notification.id);
      setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read_at: item.read_at || new Date().toISOString() } : item));
    } catch (markError) {
      setError(markError.message || t("Unable to update this notification."));
    }
  };

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl">{t("Your notifications")}</h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("Appointment status and opted-in hospital news.")}</p>
        </div>
        <button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"><FaRotate className={loading ? "animate-spin" : ""} /> {t("Refresh")}</button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="rounded-2xl border p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">{t("Loading notifications…")}</p> : notifications.length ? (
        <div className="divide-y rounded-2xl border bg-[hsl(var(--card))]">
          {notifications.map((notification) => (
            <article key={notification.id} className={`flex gap-4 p-5 ${notification.read_at ? "" : "bg-[hsl(var(--secondary)/.18)]"}`}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><FaBell /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold">{t(notification.title)}</h3>
                  <time className="text-xs text-[hsl(var(--muted-foreground))]">{formatDate(notification.created_at, language === "gu" ? "gu-IN" : language === "hi" ? "hi-IN" : "en-IN")}</time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {notification.type === "appointment_status"
                    ? t("Your appointment request is now {status}.", { status: t(notification.status || "pending") })
                    : t(notification.message)}
                </p>
                {!notification.read_at && <button onClick={() => markRead(notification)} className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]"><FaCheck /> {t("Mark as read")}</button>}
              </div>
            </article>
          ))}
        </div>
      ) : <div className="rounded-2xl border p-10 text-center"><FaBell className="mx-auto text-2xl text-[hsl(var(--muted-foreground))]" /><p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{t("You’re all caught up.")}</p></div>}
    </section>
  );
}
