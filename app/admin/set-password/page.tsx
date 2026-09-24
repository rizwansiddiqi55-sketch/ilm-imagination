'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';

export default function SetPassword() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const s = getSupabase();
    if (!s) { setChecking(false); return; }
    s.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setChecking(false);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    if (password.length < 8) { setMsg('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setMsg('Passwords do not match.'); return; }
    const s = getSupabase();
    if (!s) { setMsg('Supabase is not configured.'); return; }
    setBusy(true);
    const { error } = await s.auth.updateUser({ password });
    setBusy(false);
    if (error) setMsg(error.message);
    else setDone(true);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black">Set a password</h1>
          <p className="mt-2 text-sm text-slate-500">
            This sets a password on whichever account you are currently signed into with the magic link — so you can also sign in with a password at /admin/login.
          </p>

          {checking ? (
            <div className="mt-6 h-24 animate-pulse rounded-xl bg-slate-100" />
          ) : !email ? (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-amber-900">
              You need to sign in first (with the magic link) before you can set a password.
              <Link href="/login?next=/admin/set-password" className="mt-3 block rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white">
                Sign in
              </Link>
            </div>
          ) : done ? (
            <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-900">
              Password set for {email}. Next, run <code>migrations/010_admin_role.sql</code> in Supabase with this same email to make this account an admin, then sign in at{' '}
              <Link href="/admin/login" className="font-bold underline">/admin/login</Link>.
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="mt-4 text-sm text-slate-500">Signed in as <b>{email}</b>.</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                autoComplete="new-password"
                placeholder="new password (min. 8 characters)"
                className="mt-6 w-full rounded-xl border border-slate-200 p-3"
              />
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                required
                autoComplete="new-password"
                placeholder="confirm password"
                className="mt-3 w-full rounded-xl border border-slate-200 p-3"
              />
              <button
                type="submit"
                disabled={busy}
                className="mt-3 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white disabled:opacity-60"
              >
                {busy ? 'Saving…' : 'Set password'}
              </button>
              {msg && <p className="mt-4 text-sm text-rose-600">{msg}</p>}
            </form>
          )}
        </div>
      </main>
    </>
  );
}
