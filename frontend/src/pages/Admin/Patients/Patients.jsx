import { useCallback, useEffect, useState } from "react";
import { FaArrowDown, FaFileArrowUp, FaRotate, FaUser } from "react-icons/fa6";
import {
  downloadAdminPatientReport,
  getAdminPatientReports,
  getAdminPatients,
  uploadAdminPatientReport,
} from "@/services/patient";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected report."));
    reader.readAsDataURL(file);
  });
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshPatients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = await getAdminPatients();
      setPatients(items);
      setSelectedId((current) => items.some((item) => item.id === current) ? current : items[0]?.id || "");
    } catch (loadError) {
      setError(loadError.message || "Unable to load patient profiles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshPatients(); }, [refreshPatients]);
  useEffect(() => {
    if (!selectedId) {
      setReports([]);
      return;
    }
    let active = true;
    getAdminPatientReports(selectedId)
      .then((items) => { if (active) setReports(items); })
      .catch((loadError) => { if (active) setError(loadError.message || "Unable to load patient reports."); });
    return () => { active = false; };
  }, [selectedId]);

  const upload = async (event) => {
    event.preventDefault();
    if (!file || !selectedId) return;
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (!allowedTypes.includes(file.type)) throw new Error("Choose a PDF, JPG or PNG report.");
      if (file.size > MAX_FILE_BYTES) throw new Error("The report must be 5 MB or smaller.");
      const data = await readAsDataUrl(file);
      await uploadAdminPatientReport(selectedId, { fileName: file.name, mimeType: file.type, data });
      setFile(null);
      event.target.reset();
      setNotice("Private report uploaded for this patient.");
      setReports(await getAdminPatientReports(selectedId));
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload the report.");
    } finally {
      setBusy(false);
    }
  };

  const download = async (report) => {
    setBusy(true);
    setError("");
    try {
      const blob = await downloadAdminPatientReport(selectedId, report.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = report.file_name;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(downloadError.message || "Unable to download the report.");
    } finally {
      setBusy(false);
    }
  };

  const selected = patients.find((patient) => patient.id === selectedId);

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Patient records</p>
          <h2 className="mt-2 font-display text-5xl">Patients</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Review patient account details and share reports through private authenticated downloads.</p>
        </div>
        <button onClick={refreshPatients} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"><FaRotate className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>
      <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Patient information and uploaded reports are confidential. Only upload files intended for the selected patient.</div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {loading ? <p className="rounded-2xl border p-10 text-center text-sm text-muted-foreground">Loading patient accounts…</p> : patients.length ? (
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <section className="overflow-hidden rounded-2xl border bg-card">
            <h3 className="border-b p-5 font-bold">Patient profiles ({patients.length})</h3>
            <div className="divide-y">
              {patients.map((patient) => (
                <button key={patient.id} onClick={() => setSelectedId(patient.id)} className={`flex w-full items-center gap-3 p-4 text-left ${selectedId === patient.id ? "bg-[hsl(var(--secondary)/.25)]" : "hover:bg-muted/50"}`}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><FaUser /></span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">{patient.full_name || patient.name || "Patient"}</strong>
                    <span className="block truncate text-xs text-muted-foreground">{patient.email}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border bg-card">
            {selected ? (
              <>
                <div className="border-b p-5">
                  <h3 className="font-bold">{selected.full_name || selected.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Account created {formatDate(selected.created_at)}</p>
                </div>
                <form onSubmit={upload} className="border-b p-5">
                  <label className="block text-sm font-semibold">
                    Upload a private patient report (PDF, JPG or PNG · up to 5 MB)
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-3 block w-full rounded-xl border p-3 text-sm" />
                  </label>
                  <button disabled={busy || !file} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50"><FaFileArrowUp /> {busy ? "Uploading…" : "Upload securely"}</button>
                </form>
                <div className="p-5">
                  <h4 className="mb-3 text-sm font-bold">Shared reports ({reports.length})</h4>
                  {reports.length ? <div className="divide-y rounded-xl border">
                    {reports.map((report) => (
                      <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                        <div className="min-w-0"><strong className="block truncate text-sm">{report.file_name}</strong><span className="text-xs text-muted-foreground">{formatDate(report.created_at)} · {(report.size / 1024).toFixed(0)} KB</span></div>
                        <button onClick={() => download(report)} disabled={busy} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold disabled:opacity-50"><FaArrowDown /> Download</button>
                      </div>
                    ))}
                  </div> : <p className="text-sm text-muted-foreground">No reports shared yet.</p>}
                </div>
              </>
            ) : <p className="p-10 text-center text-sm text-muted-foreground">Select a patient profile to review shared reports.</p>}
          </section>
        </div>
      ) : <div className="rounded-2xl border p-10 text-center"><p className="text-sm text-muted-foreground">No patient accounts are registered yet.</p></div>}
    </section>
  );
}
