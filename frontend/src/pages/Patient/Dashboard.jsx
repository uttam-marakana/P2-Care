import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarDays, FaFileLines, FaRotate } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  claimPatientAppointments,
  getPatientAppointments,
  getPatientNotifications,
  getPatientReports,
  updatePatientPreferences,
} from "@/services/patient";

const statusClass = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  rescheduled: "bg-blue-100 text-blue-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-red-100 text-red-700",
};

function formatDate(value, locale) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export default function PatientDashboard() {
  const { profile, refreshProfile } = useAuth();
  const { t, language } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [nextAppointments, nextReports, nextNotifications] = await Promise.all([
        getPatientAppointments(),
        getPatientReports(),
        getPatientNotifications(),
      ]);
      setAppointments(nextAppointments);
      setReports(nextReports);
      setNotifications(nextNotifications);
    } catch (loadError) {
      setError(loadError.message || t("Unable to load your account."));
    }
  }, [t]);

  useEffect(() => { refresh(); }, [refresh]);

  const claimAppointments = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await claimPatientAppointments();
      setNotice(t("Linked {count} appointment(s) to your account.", { count: result.claimed || 0 }));
      await refresh();
    } catch (claimError) {
      setError(claimError.message || t("Unable to link appointments."));
    } finally {
      setBusy(false);
    }
  };

  const updateNewsletter = async (event) => {
    const enabled = event.target.checked;
    setBusy(true);
    setError("");
    try {
      await updatePatientPreferences({ newsletterOptIn: enabled });
      await refreshProfile();
      setNotice(enabled ? t("Hospital update emails enabled.") : t("Hospital update emails disabled."));
    } catch (preferenceError) {
      event.target.checked = !enabled;
      setError(preferenceError.message || t("Unable to update your preferences."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))]">{t("View your appointment status, private reports and hospital updates in one place.")}</p>
        <button onClick={refresh} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"><FaRotate /> {t("Refresh")}</button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [t("Appointments"), appointments.length, FaCalendarDays, "/account"],
          [t("Reports"), reports.length, FaFileLines, "/account/reports"],
          [t("Unread notifications"), notifications.filter((item) => !item.read_at).length, FaArrowRight, "/account/notifications"],
        ].map(([label, count, Icon, href]) => (
          <Link key={label} to={href} className="rounded-2xl border bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))]">
            <Icon className="text-[hsl(var(--primary))]" />
            <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
            <strong className="mt-1 block font-display text-4xl">{count}</strong>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <section className="rounded-2xl border bg-[hsl(var(--card))]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <div>
              <h2 className="font-bold">{t("Your appointments")}</h2>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{t("Status updates appear here after the care team reviews your request.")}</p>
            </div>
            <button disabled={busy} onClick={claimAppointments} className="rounded-full border px-4 py-2 text-xs font-bold disabled:opacity-50">{t("Find past appointments")}</button>
          </div>
          {appointments.length ? (
            <div className="divide-y">
              {appointments.map((appointment) => (
                <article key={appointment.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <h3 className="text-sm font-bold">{appointment.department || appointment.reason}</h3>
                    <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{formatDate(appointment.appointment_date, language === "gu" ? "gu-IN" : language === "hi" ? "hi-IN" : "en-IN")} · {appointment.appointment_time || t("Time to be confirmed")}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[appointment.status] || "bg-slate-100 text-slate-700"}`}>{t(appointment.status || "pending")}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="p-6 text-sm text-[hsl(var(--muted-foreground))]">{t("No appointments are linked to your account yet.")} <Link className="font-bold text-[hsl(var(--primary))]" to="/appointment">{t("Request an appointment")}</Link></p>
          )}
        </section>
        <section className="rounded-2xl border bg-[hsl(var(--card))] p-5">
          <h2 className="font-bold">{t("Hospital email updates")}</h2>
          <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{t("Choose whether to receive hospital news and newsletter updates by email. In-app updates remain available in Notifications.")}</p>
          <label className="mt-5 flex items-start gap-3 text-sm">
            <input type="checkbox" checked={Boolean(profile?.newsletter_opt_in)} disabled={busy} onChange={updateNewsletter} className="mt-1" />
            <span>{t("Email me hospital news and newsletter updates.")}</span>
          </label>
          <Link to="/account/notifications" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]">{t("View notifications")} <FaArrowRight /></Link>
        </section>
      </div>
    </section>
  );
}
