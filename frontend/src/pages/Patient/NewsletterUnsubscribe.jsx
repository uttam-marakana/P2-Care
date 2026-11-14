import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import { SEO } from "@/components/seo";
import { Shell } from "@/components/layout";
import { useLanguage } from "@/context/LanguageContext";
import { unsubscribeNewsletter } from "@/services/cms";

export default function NewsletterUnsubscribe() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const unsubscribe = async () => {
    setBusy(true);
    setError("");
    try {
      await unsubscribeNewsletter(token);
      setDone(true);
    } catch (requestError) {
      setError(requestError.message || t("Unable to update your subscription."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <SEO title="Newsletter preferences" noindex />
      <main className="grid min-h-[65vh] place-items-center px-5 py-12">
        <section className="w-full max-w-lg rounded-[30px] border bg-[hsl(var(--card))] p-8 text-center shadow-[var(--shadow-card)]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]">
            {done ? <FaCheck /> : <span aria-hidden="true">@</span>}
          </span>
          <h1 className="mt-5 font-display text-4xl">{t("Newsletter email preferences")}</h1>
          {done ? (
            <p role="status" className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{t("You have unsubscribed from hospital update emails.")}</p>
          ) : (
            <>
              <p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{t("Confirm if you no longer want hospital news and newsletter emails.")}</p>
              {!token && <p role="alert" className="mt-4 text-sm text-red-700">{t("This unsubscribe link is incomplete.")}</p>}
              {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
              <button onClick={unsubscribe} disabled={!token || busy} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50">
                {busy ? <FaSpinner className="animate-spin" /> : t("Unsubscribe")}
              </button>
            </>
          )}
        </section>
      </main>
    </Shell>
  );
}
