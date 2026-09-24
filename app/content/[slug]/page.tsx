'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';
import QuizPlayer from '@/components/QuizPlayer';
import { translated, lessonExtras, quizOf, activityOf, experimentOf, type ContentRow, type Language } from '@/lib/content';

export default function ContentPage() {
  const { slug } = useParams<{ slug: string }>();
  const [row, setRow] = useState<ContentRow | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [error, setError] = useState('');

  useEffect(() => {
    const s = localStorage.getItem('ilm-lang') as Language | null;
    if (s) setLang(s);
    const h = (e: Event) => setLang((e as CustomEvent<Language>).detail);
    window.addEventListener('ilm-language', h);
    return () => window.removeEventListener('ilm-language', h);
  }, []);

  useEffect(() => {
    async function load() {
      const s = getSupabase();
      if (!s) { setError('Supabase is not configured in this deployment.'); return; }
      const { data, error } = await s
        .from('content')
        .select(
          'id,slug,content_type,difficulty,age_min,age_max,estimated_minutes,featured,subject_id,' +
          'subjects(slug,name,icon),' +
          'content_translations(language,title,summary,body),' +
          'icon,' +
          'lessons(learning_objectives,key_points),' +
          'quizzes(id,passing_score,quiz_questions(id,question_order,question_en,question_ur,explanation_en,explanation_ur,' +
          'quiz_answers(id,answer_order,answer_en,answer_ur,is_correct))),' +
          'activities(instructions,materials,safety_notes),' +
          'experiments(materials,steps,safety_notes,observation_questions)'
        )
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (error) setError(error.message);
      else setRow(data as unknown as ContentRow);
    }
    load();
  }, [slug]);

  const t = row ? translated(row, lang) : null;
  const extras = row ? lessonExtras(row) : null;
  const quiz = row ? quizOf(row) : null;
  const activity = row ? activityOf(row) : null;
  const experiment = row ? experimentOf(row) : null;
  const ur = lang === 'ur';
  const L = ur
    ? { materials: 'ضروری سامان', steps: 'مراحل', instructions: 'ہدایات', safety: 'حفاظتی نوٹس', observe: 'مشاہدے کے سوالات' }
    : { materials: 'WHAT YOU NEED', steps: 'STEPS', instructions: 'INSTRUCTIONS', safety: 'SAFETY FIRST', observe: 'THINK ABOUT' };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16">
        {error && <div className="rounded-3xl bg-amber-50 p-6 text-amber-900">{error}</div>}
        {!row && !error && <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />}

        {row && t && (
          <article>
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
              <span className="text-5xl">{row.icon ?? row.subjects?.icon ?? '✨'}</span>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-white/10 px-3 py-1 capitalize">{row.content_type}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{row.difficulty ?? 'beginner'}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">{row.estimated_minutes ?? 10} min</span>
              </div>
              <h1 className="mt-5 text-4xl font-black md:text-5xl">{t.title}</h1>
              <p className="mt-4 text-lg text-slate-300">{t.summary}</p>
            </div>

            <div className="prose prose-slate mt-10 max-w-none whitespace-pre-wrap text-lg leading-8">
              {t.body}
            </div>

            {/* Real per-lesson data from the `lessons` table — only renders if that
                lesson actually has objectives/key points filled in. No fake filler. */}
            {extras && (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {extras.objectives.length > 0 && (
                  <div className="rounded-3xl bg-indigo-50 p-6">
                    <b className="text-sm tracking-wide text-indigo-900">WHAT YOU&apos;LL LEARN</b>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {extras.objectives.map((o, i) => <li key={i}>• {o}</li>)}
                    </ul>
                  </div>
                )}
                {extras.points.length > 0 && (
                  <div className="rounded-3xl bg-cyan-50 p-6">
                    <b className="text-sm tracking-wide text-cyan-900">KEY TAKEAWAYS</b>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {extras.points.map((p, i) => <li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Activities and experiments keep their steps in their own tables. */}
            {(activity || experiment) && (
              <div dir={ur ? 'rtl' : 'ltr'} className="mt-10 space-y-4">
                {((activity?.materials.length ?? 0) > 0 || (experiment?.materials.length ?? 0) > 0) && (
                  <div className="rounded-3xl bg-indigo-50 p-6">
                    <b className="text-sm tracking-wide text-indigo-900">{L.materials}</b>
                    <ul className="mt-3 space-y-2 text-slate-700">
                      {(activity?.materials ?? experiment?.materials ?? []).map((m, i) => <li key={i}>• {m}</li>)}
                    </ul>
                  </div>
                )}
                {((activity?.instructions.length ?? 0) > 0 || (experiment?.steps.length ?? 0) > 0) && (
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <b className="text-sm tracking-wide text-slate-900">{activity ? L.instructions : L.steps}</b>
                    <ol className={`mt-3 list-decimal space-y-2 text-slate-700 ${ur ? 'pr-6' : 'pl-6'}`}>
                      {(activity?.instructions ?? experiment?.steps ?? []).map((st, i) => <li key={i} className="leading-7">{st}</li>)}
                    </ol>
                  </div>
                )}
                {((activity?.safety.length ?? 0) > 0 || (experiment?.safety.length ?? 0) > 0) && (
                  <div className="rounded-3xl bg-amber-50 p-6">
                    <b className="text-sm tracking-wide text-amber-900">⚠️ {L.safety}</b>
                    <ul className="mt-3 space-y-2 text-amber-900">
                      {(activity?.safety ?? experiment?.safety ?? []).map((n, i) => <li key={i}>• {n}</li>)}
                    </ul>
                  </div>
                )}
                {(experiment?.questions.length ?? 0) > 0 && (
                  <div className="rounded-3xl bg-cyan-50 p-6">
                    <b className="text-sm tracking-wide text-cyan-900">{L.observe}</b>
                    <ul className="mt-3 space-y-2 text-slate-700">
                      {experiment!.questions.map((q, i) => <li key={i}>• {q}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {row.content_type === 'quiz' && (quiz ? <QuizPlayer quiz={quiz} lang={lang} /> : (
              <div className="mt-10 rounded-3xl bg-amber-50 p-6 text-amber-900">
                {ur ? 'اس کوئز کے سوالات جلد شامل کیے جائیں گے۔ براہِ کرم بعد میں دیکھیں۔' : 'The questions for this quiz are coming soon. Please check back later.'}
              </div>
            ))}
          </article>
        )}
      </main>
    </>
  );
}
