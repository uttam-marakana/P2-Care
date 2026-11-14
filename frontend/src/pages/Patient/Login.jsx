import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { reload, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FaArrowRight, FaSpinner } from "react-icons/fa6";
import { SEO } from "@/components/seo";
import { Shell } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { savePatientProfile } from "@/services/cms";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { isMockMode } from "@/lib/adminMode";

export default function PatientLogin() {
  const { t } = useLanguage();
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      if (isMockMode || !firebaseAuth) throw new Error(t("Patient accounts require Firebase mode and Firebase Authentication."));
      const { user } = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      await reload(user);
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await signOut(firebaseAuth);
        setMessage(t("Please verify your email. We sent a new verification link."));
        return;
      }
      await user.getIdToken(true);
      await savePatientProfile({
        fullName: fullName.trim() || user.displayName || user.email.split("@")[0],
      });
      await refreshProfile();
      navigate(location.state?.from || "/account", { replace: true });
    } catch (submitError) {
      setError(submitError.message || t("Unable to sign in."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <SEO title="Patient sign in" noindex />
      <main className="grid min-h-[65vh] place-items-center px-5 py-12">
        <form onSubmit={submit} className="w-full max-w-lg rounded-[30px] border bg-[hsl(var(--card))] p-7 shadow-[var(--shadow-card)] sm:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">{t("P2Care patient portal")}</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t("Sign in to your account")}</h1>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{t("Review appointment updates and your private reports.")}</p>
          {(isMockMode || !isFirebaseConfigured) && <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{t("Configure Firebase mode and Firebase Authentication to enable patient accounts.")}</p>}
          <label className="mt-6 block text-sm font-semibold">
            {t("Email address")}
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            {t("Full name (for first-time setup)")}
            <input type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            {t("Password")}
            <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
          </label>
          {message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy || isMockMode || !isFirebaseConfigured} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50">
            {busy ? <FaSpinner className="animate-spin" /> : t("Sign in")} <FaArrowRight />
          </button>
          <p className="mt-5 text-center text-sm text-[hsl(var(--muted-foreground))]">
            {t("New to P2Care?")} <Link className="font-bold text-[hsl(var(--primary))]" to="/account/signup">{t("Create an account")}</Link>
          </p>
        </form>
      </main>
    </Shell>
  );
}
