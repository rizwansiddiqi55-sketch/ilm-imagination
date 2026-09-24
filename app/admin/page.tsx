'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';

export default function Admin() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const s = getSupabase();
      if (!s) { router.replace('/admin/login'); return; }
      const { data: userData } = await s.auth.getUser();
      if (!userData.user) { router.replace('/admin/login'); return; }
      const { data: profile } = await s.from('profiles').select('is_admin').eq('id', userData.user.id).single();
      if (!profile?.is_admin) { router.replace('/admin/login'); return; }
      setEmail(userData.user.email ?? null);
      setChecking(false);
    }
    check();
  }, [router]);

  if (checking) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-5 py-16">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-indigo-600">ADMIN</p>
            <h1 className="mt-1 text-4xl font-black">Content management</h1>
          </div>
          <button
            type="button"
            onClick={async () => { await getSupabase()?.auth.signOut(); router.replace('/admin/login'); }}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold"
          >
            Sign out
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-500">Signed in as {email}.</p>
        <p className="mt-4 text-slate-500">The Supabase schema supports stories, lessons, activities, experiments, quizzes, translations, magazine issues, categories and tags.</p>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 text-slate-600">
          This page is now sign-in gated to admins only, but it still doesn&apos;t have editing forms — content is added through SQL in the Supabase SQL Editor. Ask for a form here (e.g. &quot;let me add a story from this page&quot;) and it can be built next.
        </div>
      </main>
    </>
  );
}
