import { useCallback, useEffect, useState } from "react";
import { FaDownload, FaFileLines, FaRotate } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";
import { downloadPatientReport, getPatientReports } from "@/services/patient";

function formatDate(value, language) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(date);
}

export default function PatientReports() {
  const { t, language } = useLanguage();
  const [reports, setReports] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      setReports(await getPatientReports());
    } catch (loadError) {
      setError(loadError.message || t("Unable to load reports."));
    }
  }, [t]);

  useEffect(() => { refresh(); }, [refresh]);

  const download = async (report) => {
    setBusyId(report.id);
    setError("");
    try {
      const blob = await downloadPatientReport(report.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = report.file_name;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(downloadError.message || t("Unable to download this report."));
    } finally {
      setBusyId("");
    }
  };

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl">{t("My reports")}</h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t("Reports shared with you by the P2Care team.")}</p>
        </div>
        <button onClick={refresh} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"><FaRotate /> {t("Refresh")}</button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {reports.length ? (
        <div className="divide-y rounded-2xl border bg-[hsl(var(--card))]">
          {reports.map((report) => (
            <article key={report.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><FaFileLines /></span>
                <div className="min-w-0">
                  <h3 className="truncate font-bold">{report.file_name}</h3>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{formatDate(report.created_at, language === "gu" ? "gu-IN" : language === "hi" ? "hi-IN" : "en-IN")} · {(report.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <button onClick={() => download(report)} disabled={busyId === report.id} className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-sm font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50"><FaDownload /> {t("Download")}</button>
            </article>
          ))}
        </div>
      ) : <div className="rounded-2xl border p-10 text-center"><FaFileLines className="mx-auto text-2xl text-[hsl(var(--muted-foreground))]" /><p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{t("No reports have been shared with you yet.")}</p></div>}
    </section>
  );
}
