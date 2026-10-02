import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { isMockMode } from '@/lib/adminMode';
import { mockSignIn } from '@/services/mockAdmin';
import { SEO } from '@/components/seo';

export default function AdminLogin() {
  const [email, setEmail] = useState(isMockMode ? 'admin@p2care.local' : '');
  const [password, setPassword] = useState(isMockMode ? 'P2Care@123' : '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate(); const location = useLocation();
  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const result = isMockMode ? mockSignIn(email, password) : await signInWithEmailAndPassword(firebaseAuth, email, password);
      if (result?.error) throw result.error;
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) { setError(err?.message || 'Unable to sign in.'); }
    finally { setBusy(false); }
  };
  return <main className="grid min-h-screen place-items-center bg-[hsl(var(--muted)/.35)] p-5"><SEO title="Admin login" noindex /><form onSubmit={submit} className="w-full max-w-md rounded-[30px] border bg-[hsl(var(--card))] p-8 shadow-[var(--shadow-card)]"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">P2Care Hospital</p><h1 className="mt-3 font-display text-5xl">Staff login</h1><p className="mt-3 text-sm text-muted-foreground">Secure access for appointments and website content.</p>{isMockMode ? <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800"><strong>Development mode.</strong> Firebase is not required. Demo credentials are pre-filled.</div> : !isFirebaseConfigured && <div className="mt-5 rounded-xl bg-red-50 p-3 text-xs text-red-700">Firebase Authentication is not configured yet.</div>}<label className="mt-6 block text-sm font-semibold">Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-xl border bg-background px-4 py-3" /></label><label className="mt-4 block text-sm font-semibold">Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-2 w-full rounded-xl border bg-background px-4 py-3" /></label>{isMockMode && <p className="mt-3 text-xs text-muted-foreground">Demo: admin@p2care.local / P2Care@123</p>}{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<button disabled={busy || (!isMockMode && !isFirebaseConfigured)} className="mt-6 w-full rounded-full bg-[hsl(var(--primary))] px-5 py-3 font-bold text-[hsl(var(--primary-foreground))] disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
