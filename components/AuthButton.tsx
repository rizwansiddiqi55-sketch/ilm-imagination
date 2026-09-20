'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function AuthButton() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSupabase();
    if (!s) {
      setReady(true);
      return;
    }
    s.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = s.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <span className="w-20" />;

  if (email) {
    return (
      <button
        type="button"
        onClick={async () => {
          await getSupabase()?.auth.signOut();
          setEmail(null);
        }}
        title={email}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm"
      >
        Sign out
      </button>
    );
  }

  return (
    <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm">
      Sign in
    </Link>
  );
}
