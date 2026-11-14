import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, reload, sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { FaArrowRight, FaSpinner } from "react-icons/fa6";
import { SEO } from "@/components/seo";
import { Shell } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { savePatientProfile } from "@/services/cms";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { isMockMode } from "@/lib/adminMode";

export default function PatientSignup() {
  const { t } = useLanguage();
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const createAccount = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isMockMode || !firebaseAuth) throw new Error(t("Patient accounts require Firebase mode and Firebase Authentication."));
      if (password !== confirmPassword) throw new Error(t("Passwords do not match."));
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      await updateProfile(user, { displayName: fullName.trim() });
      await sendEmailVerification(user);
      setVerificationPending(true);
    } catch (submitError) {
      setError(submitError.message || t("Unable to create your account."));
    } finally {
      setBusy(false);
    }
  };

  const finishVerification = async () => {
    setError("");
    setBusy(true);
    try {
      const user = firebaseAuth?.currentUser;
      if (!user) throw new Error(t("Sign in again after verifying your email."));
      await reload(user);
      if (!user.emailVerified) throw new Error(t("Your email is not verified yet. Open the link we emailed you, then try again."));
      await user.getIdToken(true);
      await savePatientProfile({ fullName: fullName.trim(), newsletterOptIn });
      await refreshProfile();
      navigate("/account", { replace: true });
    } catch (submitError) {
      setError(submitError.message || t("Unable to finish account setup."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <SEO title="Create patient account" noindex />
      <main className="grid min-h-[65vh] place-items-center px-5 py-12">
        <section className="w-full max-w-lg rounded-[30px] border bg-[hsl(var(--card))] p-7 shadow-[var(--shadow-card)] sm:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">{t("P2Care patient portal")}</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t("Create your account")}</h1>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{t("Your email must be verified before appointment history and reports are available.")}</p>
          {!verificationPending ? (
            <form onSubmit={createAccount}>
              {(isMockMode || !isFirebaseConfigured) && <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{t("Configure Firebase mode and Firebase Authentication to enable patient accounts.")}</p>}
              <label className="mt-6 block text-sm font-semibold">
                {t("Full name")}
                <input required minLength={2} maxLength={120} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
              </label>
              <label className="mt-4 block text-sm font-semibold">
                {t("Email address")}
                <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
              </label>
              <label className="mt-4 block text-sm font-semibold">
                {t("Password (at least 8 characters)")}
                <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
              </label>
              <label className="mt-4 block text-sm font-semibold">
                {t("Confirm password")}
                <input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-4 py-3" />
              </label>
              <label className="mt-5 flex items-start gap-3 text-sm">
                <input type="checkbox" checked={newsletterOptIn} onChange={(event) => setNewsletterOptIn(event.target.checked)} className="mt-1" />
                <span>{t("Email me hospital news and newsletter updates. You can change this anytime.")}</span>
              </label>
              {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button disabled={busy || isMockMode || !isFirebaseConfigured} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50">
                {busy ? <FaSpinner className="animate-spin" /> : t("Create account")} <FaArrowRight />
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border bg-[hsl(var(--muted)/.35)] p-5">
              <p role="status" className="text-sm leading-6">{t("We sent a verification link to {email}. Verify your email, then continue here.", { email })}</p>
              {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
              <button onClick={finishVerification} disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50">
                {busy ? <FaSpinner className="animate-spin" /> : t("I verified my email")} <FaArrowRight />
              </button>
              <button onClick={async () => { if (firebaseAuth?.currentUser) await sendEmailVerification(firebaseAuth.currentUser); }} className="mt-4 w-full text-sm font-semibold text-[hsl(var(--primary))]">
                {t("Resend verification email")}
              </button>
              <button onClick={() => signOut(firebaseAuth)} className="mt-3 w-full text-sm text-[hsl(var(--muted-foreground))]">
                {t("Use a different account")}
              </button>
            </div>
          )}
          <p className="mt-5 text-center text-sm text-[hsl(var(--muted-foreground))]">
            {t("Already have an account?")} <Link className="font-bold text-[hsl(var(--primary))]" to="/account/login">{t("Sign in")}</Link>
          </p>
        </section>
      </main>
    </Shell>
  );
}
