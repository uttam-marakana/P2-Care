import { useEffect, useState } from "react";
import {
  FaShieldHalved,
  FaRotate,
  FaCircleCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { apiRequest } from "@/services/api";

export default function Security() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextStatus, nextLogs] = await Promise.all([
        apiRequest("/api/security/status", { auth: true }),
        apiRequest("/api/security/audit?limit=50", { auth: true }),
      ]);
      setStatus(nextStatus);
      setLogs(nextLogs.logs || []);
    } catch (err) {
      setError(err.message || "Unable to load security status.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);
  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
            Security & audit
          </p>
          <h2 className="mt-2 font-display text-5xl">Security</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Review runtime protection and recent administrative API activity.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          <FaRotate className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))]">
            <FaShieldHalved />
          </span>
          <h3 className="mt-4 font-bold">Runtime mode</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {status?.mode || "Loading…"} · {status?.nodeEnv || "—"}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <FaCircleCheck />
          </span>
          <h3 className="mt-4 font-bold">Protection enabled</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Helmet, CORS allowlist, rate limits and request IDs.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-800">
            <FaTriangleExclamation />
          </span>
          <h3 className="mt-4 font-bold">Mock production guard</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Production startup rejects mock mode by default.
          </p>
        </div>
      </div>
      <div className="mt-7 rounded-2xl border bg-card p-5">
        <h3 className="font-bold">Rate limits</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">API / 15 min</p>
            <p className="text-2xl font-bold">
              {status?.security?.apiRateLimit ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Public writes / 10 min
            </p>
            <p className="text-2xl font-bold">
              {status?.security?.publicWriteRateLimit ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Auth / 10 min</p>
            <p className="text-2xl font-bold">
              {status?.security?.authRateLimit ?? "—"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-7 rounded-2xl border bg-card">
        <div className="border-b p-5">
          <h3 className="font-bold">Recent audit events</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Request bodies and patient payloads are intentionally excluded.
          </p>
        </div>
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Loading audit events…
          </div>
        ) : !logs.length ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No mutating API events recorded yet.
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid gap-1 p-4 md:grid-cols-[1fr_1fr_auto]"
              >
                <div>
                  <strong className="text-sm">{log.action}</strong>
                  <p className="text-xs text-muted-foreground">
                    {log.actor_email || "Public request"} ·{" "}
                    {log.request_id || "No request ID"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{log.path}</p>
                <span
                  className={`w-fit rounded-full px-2 py-1 text-xs font-bold ${log.status_code < 400 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                  {log.status_code}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
