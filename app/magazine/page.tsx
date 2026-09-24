'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';
import { issueTitle, issueSummary, type MagazineIssueRow, type Language } from '@/lib/content';

export default function Magazine() {
  const [issues, setIssues] = useState<MagazineIssueRow[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const s = localStorage.getItem('ilm-lang') as Language | null;
      if (s) setLang(s);
    } catch { /* ignore */ }
    const h = (e: Event) => setLang((e as CustomEvent<Language>).detail);
    window.addEventListener('ilm-language', h);
    return () => window.removeEventListener('ilm-language', h);
  }, []);

  useEffect(() => {
    async function load() {
      const s = getSupabase();
      if (!s) { setError('Supabase environment variables are not configured.'); setLoading(false); return; }
      const { data, error } = await s
        .from('magazine_issues')
        .select('id,issue_number,slug,cover_image_url,published_date,published,title_en,title_ur,summary_en,summary_ur')
        .eq('published', true)
        .order('issue_number', { ascending: false });
      if (error) setError(error.message);
      else setIssues((data ?? []) as MagazineIssueRow[]);
      setLoading(false);
    }
    load();
  }, []);

  const ur = lang === 'ur';

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-50 to-cyan-50 p-8 md:p-12">
          <p className="font-bold text-indigo-600">📰 DIGITAL MAGAZINE</p>
          <h1 className="mt-2 text-4xl font-black">Ilm &amp; Imagination</h1>
          <p className="mt-4 text-slate-600">A monthly mix of science, maths, technology, puzzles, stories and amazing facts.</p>
        </div>

        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-56 animate-pulse rounded-3xl bg-slate-100" />)}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <b>Content connection needs attention.</b>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && issues.length === 0 && (
          <div className="mt-8 rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
            No issue has been published yet. Publish one in Supabase and it will appear here.
          </div>
        )}

        {!loading && !error && issues.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/magazine/${issue.slug}`}
                dir={ur ? 'rtl' : 'ltr'}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-5xl">📚</div>
                <h2 className="mt-5 text-xl font-black">{issueTitle(issue, lang)}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{issueSummary(issue, lang)}</p>
                <span className="mt-6 block font-extrabold text-indigo-600">{ur ? 'آن لائن پڑھیں →' : 'Read online →'}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
