'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';
import { issueTitle, issueSummary, issueArticles, translated, type MagazineIssueRow, type Language } from '@/lib/content';

export default function MagazineIssuePage() {
  const { slug } = useParams<{ slug: string }>();
  const [issue, setIssue] = useState<MagazineIssueRow | null>(null);
  const [lang, setLang] = useState<Language>('en');
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
      if (!s) { setError('Supabase is not configured in this deployment.'); return; }
      const { data, error } = await s
        .from('magazine_issues')
        .select(
          'id,issue_number,slug,cover_image_url,published_date,published,title_en,title_ur,summary_en,summary_ur,' +
          'magazine_articles(article_order,content(id,slug,content_type,difficulty,estimated_minutes,featured,subject_id,icon,' +
          'subjects(slug,name,icon),content_translations(language,title,summary,body)))'
        )
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (error) setError(error.message);
      else setIssue(data as unknown as MagazineIssueRow);
    }
    load();
  }, [slug]);

  const ur = lang === 'ur';
  const articles = issue ? issueArticles(issue) : [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-16">
        {error && <div className="rounded-3xl bg-amber-50 p-6 text-amber-900">{error}</div>}
        {!issue && !error && <div className="h-56 animate-pulse rounded-3xl bg-slate-100" />}

        {issue && (
          <>
            <div dir={ur ? 'rtl' : 'ltr'} className="rounded-[2rem] bg-gradient-to-br from-indigo-50 to-cyan-50 p-8 md:p-12">
              <p className="font-bold text-indigo-600">📰 ISSUE {issue.issue_number}</p>
              <h1 className="mt-2 text-4xl font-black">{issueTitle(issue, lang)}</h1>
              <p className="mt-4 text-slate-600">{issueSummary(issue, lang)}</p>
            </div>

            <div className="mt-10">
              <p className="font-bold text-indigo-600">{ur ? 'اس شمارے میں' : 'IN THIS ISSUE'}</p>
              <h2 className="mt-1 text-2xl font-black">{ur ? 'مضامین' : 'Articles'}</h2>

              {articles.length === 0 ? (
                <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
                  {ur ? 'اس شمارے میں ابھی کوئی مضمون شامل نہیں کیا گیا۔' : 'No articles have been linked to this issue yet.'}
                </div>
              ) : (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((a) => {
                    const t = translated(a, lang);
                    return (
                      <Link key={a.id} href={`/content/${a.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{a.icon ?? a.subjects?.icon ?? '✨'}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize">{a.content_type}</span>
                        </div>
                        <h3 className="mt-5 text-xl font-black">{t.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{t.summary}</p>
                        <span className="mt-5 block font-extrabold text-indigo-600">{ur ? 'دیکھیں →' : 'Read →'}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-10">
              <Link href="/magazine" className="font-bold text-indigo-600">{ur ? '← تمام شمارے' : '← All issues'}</Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}
