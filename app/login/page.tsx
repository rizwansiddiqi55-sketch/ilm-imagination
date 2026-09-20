'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';

// Only allow same-site relative paths as a post-login destination.
function safeNext(): string {
  try {
    const n = new URLSearchParams(window.location.search).get('next') || '/';
    return n.startsWith('/') && !n.startsWith('//') ? n : '/';
  } catch {
    return '/';
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [next, setNext] = useState('/');

  useEffect(() => {
    setNext(safeNext());
    const s = getSupabase();
    if (!s) return;
    s.auth.getUser().then(({ data }) => setUser(data.user?.email ?? null));
    const { data: sub } = s.auth.onAuthStateChange((_e, session) => setUser(session?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const s = getSupabase();
    if (!s) {
      setMsg('Supabase is not configured.');
      return;
    }
    if (!email.includes('@')) {
      setMsg('Please enter a valid email address.');
      return;
    }
    setBusy(true);
    setMsg('');
    const { error } = await s.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    setBusy(false);
    if (error) setMsg(error.message);
    else setSent(true);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black">Sign in</h1>

          {user ? (
            <>
              <p className="mt-4 text-slate-700">
                You are signed in as <b>{user}</b>.
              </p>
              <Link href={next} className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white">
                Continue
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await getSupabase()?.auth.signOut();
                  setUser(null);
                }}
                className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 font-bold"
              >
                Sign out
              </button>
            </>
          ) : sent ? (
            <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-emerald-900">
              Check your email ({email}) for the sign-in link. Open it on this device and you will be brought back here.
            </p>
          ) : (
            <form onSubmit={submit}>
              <p className="mt-2 text-sm text-slate-500">No password needed. We email you a one-time sign-in link.</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-6 w-full rounded-xl border border-slate-200 p-3"
              />
              <button
                type="submit"
                disabled={busy}
                className="mt-3 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white disabled:opacity-60"
              >
                {busy ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          )}

          {msg && <p className="mt-4 text-sm text-rose-600">{msg}</p>}
        </div>
      </main>
    </>
  );
}
