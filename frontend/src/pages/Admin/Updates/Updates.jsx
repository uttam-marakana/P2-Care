import { useCallback, useEffect, useState } from "react";
import { FaBullhorn, FaPaperPlane, FaRotate } from "react-icons/fa6";
import { createHospitalUpdate, getHospitalUpdates, publishHospitalUpdate } from "@/services/patient";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function AdminUpdates() {
  const [updates, setUpdates] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUpdates(await getHospitalUpdates());
    } catch (loadError) {
      setError(loadError.message || "Unable to load hospital updates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const saveDraft = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const item = await createHospitalUpdate({ title, body });
      setUpdates((current) => [item, ...current]);
      setTitle("");
      setBody("");
      setNotice("Draft saved. Publish it to notify patients and opted-in newsletter subscribers.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save this update.");
    }
  };

  const publish = async (update) => {
    if (!window.confirm(`Publish "${update.title}" and email hospital updates to opted-in recipients? This cannot be undone.`)) return;
    setBusyId(update.id);
    setError("");
    setNotice("");
    try {
      const result = await publishHospitalUpdate(update.id);
      setUpdates((current) => current.map((item) => item.id === update.id ? result.update : item));
      setNotice(`Published. In-app recipients: ${result.delivery?.inAppRecipients ?? 0}; email recipients: ${result.delivery?.emailRecipients ?? 0}; emails sent: ${result.delivery?.emailsSent ?? 0}.`);
    } catch (publishError) {
      setError(publishError.message || "Unable to publish this update.");
      await refresh();
    } finally {
      setBusyId("");
    }
  };

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Patient communication</p>
          <h2 className="mt-2 font-display text-5xl">Hospital updates</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Save drafts, then publish in-app updates and email only to opted-in patient accounts and newsletter subscribers.</p>
        </div>
        <button onClick={refresh} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"><FaRotate className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      <form onSubmit={saveDraft} className="mb-7 rounded-2xl border bg-card p-5">
        <h3 className="flex items-center gap-2 font-bold"><FaBullhorn /> Create a hospital update</h3>
        <label className="mt-5 block text-sm font-semibold">
          Title
          <input required minLength={3} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Update
          <textarea required minLength={5} maxLength={3000} rows={4} value={body} onChange={(event) => setBody(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
        </label>
        <button className="mt-4 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))]">Save draft</button>
      </form>
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b p-5"><h3 className="font-bold">Updates ({updates.length})</h3><p className="mt-1 text-xs text-muted-foreground">Published updates cannot be sent again from this panel.</p></div>
        {loading ? <p className="p-10 text-center text-sm text-muted-foreground">Loading updates…</p> : updates.length ? (
          <div className="divide-y">
            {updates.map((update) => (
              <article key={update.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold">{update.title}</h4>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${update.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{update.status}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{update.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{update.published_at ? `Published ${formatDate(update.published_at)}` : `Draft created ${formatDate(update.created_at)}`}</p>
                    {update.delivery && <p className="mt-1 text-xs text-muted-foreground">Delivery: {update.delivery.delivery || "unknown"} · {update.delivery.inAppRecipients ?? 0} in-app · {update.delivery.emailsSent ?? 0}/{update.delivery.emailRecipients ?? 0} emails sent</p>}
                  </div>
                  {update.status === "draft" && <button onClick={() => publish(update)} disabled={busyId === update.id} className="inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-50"><FaPaperPlane /> {busyId === update.id ? "Publishing…" : "Publish & send"}</button>}
                </div>
              </article>
            ))}
          </div>
        ) : <p className="p-10 text-center text-sm text-muted-foreground">No updates created.</p>}
      </section>
    </section>
  );
}
