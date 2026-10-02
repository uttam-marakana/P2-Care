import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarDays,
  FaClock,
  FaCircleCheck,
  FaCircleExclamation,
  FaUsers,
  FaUserDoctor,
  FaBriefcaseMedical,
  FaNewspaper,
  FaCircleQuestion,
} from "react-icons/fa6";
import { listAppointments, listContent } from "@/services/cms";

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  rescheduled: "Rescheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [contentCounts, setContentCounts] = useState({
    doctors: 0,
    services: 0,
    articles: 0,
    faqs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [appointmentData, doctors, services, articles, faqs] =
          await Promise.all([
            listAppointments(),
            listContent("doctors", { includeDrafts: true }),
            listContent("services", { includeDrafts: true }),
            listContent("articles", { includeDrafts: true }),
            listContent("faqs", { includeDrafts: true }),
          ]);
        if (!active) return;
        setAppointments(appointmentData);
        setContentCounts({
          doctors: doctors.length,
          services: services.length,
          articles: articles.length,
          faqs: faqs.length,
        });
      } catch (_) {
        if (active) setAppointments([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      confirmed: appointments.filter((item) => item.status === "confirmed")
        .length,
      completed: appointments.filter((item) => item.status === "completed")
        .length,
      today: appointments.filter(
        (item) =>
          item.appointment_date === new Date().toISOString().slice(0, 10),
      ).length,
    }),
    [appointments],
  );

  const upcoming = useMemo(
    () =>
      appointments
        .filter(
          (item) =>
            item.appointment_date >= new Date().toISOString().slice(0, 10) &&
            !["cancelled", "completed", "no_show"].includes(item.status),
        )
        .sort((a, b) =>
          `${a.appointment_date} ${a.appointment_time || ""}`.localeCompare(
            `${b.appointment_date} ${b.appointment_time || ""}`,
          ),
        )
        .slice(0, 6),
    [appointments],
  );

  const recent = useMemo(
    () =>
      [...appointments]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
    [appointments],
  );

  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const key = date.toISOString().slice(0, 10);
        return {
          key,
          label: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(
            date,
          ),
          count: appointments.filter((item) => item.appointment_date === key)
            .length,
        };
      }),
    [appointments],
  );

  const maxTrend = Math.max(1, ...last7Days.map((item) => item.count));

  const cards = [
    ["Appointments", stats.total, FaCalendarDays],
    ["Today's requests", stats.today, FaClock],
    ["Pending", stats.pending, FaCircleExclamation],
    ["Confirmed", stats.confirmed, FaCircleCheck],
  ];

  const contentCards = [
    ["Doctors", contentCounts.doctors, FaUserDoctor],
    ["Services", contentCounts.services, FaBriefcaseMedical],
    ["Articles", contentCounts.articles, FaNewspaper],
    ["FAQs", contentCounts.faqs, FaCircleQuestion],
  ];

  return (
    <section>
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
          Overview
        </p>
        <h2 className="mt-2 font-display text-5xl">Good morning.</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Monitor patient requests and keep the hospital website current.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border bg-card p-5 shadow-sm">
            <Icon size={20} className="text-[hsl(var(--primary))]" />
            <p className="mt-8 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-4xl font-bold">{loading ? "—" : value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Appointment activity</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Requests by appointment date over the last 7 days.
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
              {stats.completed} completed
            </span>
          </div>
          <div className="mt-8 flex h-44 items-end gap-3">
            {last7Days.map((item) => (
              <div
                key={item.key}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-semibold">{item.count}</span>
                <div className="flex h-32 w-full items-end rounded-lg bg-muted/70">
                  <div
                    className="w-full rounded-lg bg-[hsl(var(--primary))] transition-all"
                    style={{
                      height: `${Math.max(8, (item.count / maxTrend) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold">Content overview</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Records currently managed from the admin console.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {contentCards.map(([label, value, Icon]) => (
              <div key={label} className="rounded-xl border bg-background p-4">
                <Icon size={18} className="text-[hsl(var(--primary))]" />
                <p className="mt-4 text-2xl font-bold">
                  {loading ? "—" : value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border bg-card">
          <div className="border-b p-5">
            <h3 className="font-semibold">Upcoming appointments</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The next patient requests requiring attention.
            </p>
          </div>
          <div className="divide-y">
            {!upcoming.length && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No upcoming appointments.
              </p>
            )}
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {item.patient_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.department || "General care"} ·{" "}
                    {formatDate(item.appointment_date)}
                    {item.appointment_time ? ` · ${item.appointment_time}` : ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase">
                  {statusLabels[item.status] || item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card">
          <div className="border-b p-5">
            <h3 className="font-semibold">Recent requests</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Latest appointment submissions.
            </p>
          </div>
          <div className="divide-y">
            {!recent.length && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No appointment requests yet.
              </p>
            )}
            {recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {item.patient_name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.department || "General care"} ·{" "}
                    {formatDate(item.appointment_date)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {statusLabels[item.status] || item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-3">
          <FaUsers className="text-[hsl(var(--primary))]" />
          <div>
            <h3 className="font-semibold">Operational snapshot</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.pending} pending requests need review, while{" "}
              {stats.confirmed} are currently confirmed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
