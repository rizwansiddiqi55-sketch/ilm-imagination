'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const s = getSupabase();
    if (!s) { setMsg('Supabase is not configured.'); return; }
    setBusy(true);
    setMsg('');

    const { data, error } = await s.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setMsg('Incorrect email or password.');
      return;
    }

    const { data: profile } = await s.from('profiles').select('is_admin').eq('id', data.user.id).single();
    if (!profile?.is_admin) {
      await s.auth.signOut();
      setBusy(false);
      setMsg('This account is not an admin.');
      return;
    }

    router.replace('/admin');
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500">This is a separate, password-based login — only for the admin account.</p>

          <form onSubmit={submit}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="username"
              placeholder="admin email"
              className="mt-6 w-full rounded-xl border border-slate-200 p-3"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              autoComplete="current-password"
              placeholder="password"
              className="mt-3 w-full rounded-xl border border-slate-200 p-3"
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-3 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white disabled:opacity-60"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {msg && <p className="mt-4 text-sm text-rose-600">{msg}</p>}
        </div>
      </main>
    </>
  );
}
