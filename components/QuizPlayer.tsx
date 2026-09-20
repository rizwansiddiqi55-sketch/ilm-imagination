'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { Language, QuizRow } from '@/lib/content';

const T = {
  en: {
    heading: 'Test yourself',
    answered: (a: number, n: number) => `${a} of ${n} answered`,
    check: 'Check my answers',
    again: 'Try again',
    score: (c: number, n: number, pct: number) => `You got ${c} out of ${n} (${pct}%)`,
    pass: 'Great work, you passed! 🎉',
    fail: 'Not quite there yet. Read the explanations and try again.',
    correct: 'Correct',
    wrong: 'Not quite',
    empty: 'The questions for this quiz are coming soon. Please check back later.',
    signIn: 'Sign in',
    signInNote: ' to save your quiz results.',
    saved: 'Your result was saved.',
  },
  ur: {
    heading: 'اپنے آپ کو آزمائیں',
    answered: (a: number, n: number) => `${n} میں سے ${a} کے جواب دیے`,
    check: 'میرے جوابات جانچیں',
    again: 'دوبارہ کوشش کریں',
    score: (c: number, n: number, pct: number) => `آپ کے ${n} میں سے ${c} صحیح ہیں (${pct}%)`,
    pass: 'شاباش، آپ کامیاب ہو گئے! 🎉',
    fail: 'ابھی تھوڑی کسر باقی ہے۔ وضاحتیں پڑھیں اور دوبارہ کوشش کریں۔',
    correct: 'درست',
    wrong: 'درست نہیں',
    empty: 'اس کوئز کے سوالات جلد شامل کیے جائیں گے۔ براہِ کرم بعد میں دیکھیں۔',
    signIn: 'سائن ان کریں',
    signInNote: ' تاکہ آپ کا نتیجہ محفوظ ہو۔',
    saved: 'آپ کا نتیجہ محفوظ ہو گیا۔',
  },
} as const;

export default function QuizPlayer({ quiz, lang }: { quiz: QuizRow; lang: Language }) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = T[lang];
  const ur = lang === 'ur';
  const qs = quiz.quiz_questions;

  useEffect(() => {
    getSupabase()?.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  const answeredCount = qs.filter((q) => picked[q.id]).length;
  const correctCount = qs.filter((q) => q.quiz_answers.find((a) => a.id === picked[q.id])?.is_correct).length;
  const pct = qs.length ? Math.round((correctCount / qs.length) * 100) : 0;
  const passed = pct >= (quiz.passing_score ?? 70);

  async function check() {
    setSubmitted(true);
    // Best-effort: save the attempt for signed-in students.
    try {
      const s = getSupabase();
      const { data } = (await s?.auth.getUser()) ?? { data: null };
      if (s && data?.user) {
        const { error } = await s.from('quiz_attempts').insert({
          user_id: data.user.id,
          quiz_id: quiz.id,
          score: pct,
          correct_answers: correctCount,
          total_questions: qs.length,
          answers: picked,
        });
        if (!error) setSaved(true);
      }
    } catch {
      /* saving is optional */
    }
  }

  function reset() {
    setPicked({});
    setSubmitted(false);
    setSaved(false);
  }

  if (!qs.length) {
    return <div className="mt-10 rounded-3xl bg-amber-50 p-6 text-amber-900">{t.empty}</div>;
  }

  return (
    <section dir={ur ? 'rtl' : 'ltr'} className="mt-10">
      <h2 className="text-2xl font-black">{t.heading}</h2>

      <div className="mt-6 space-y-6">
        {qs.map((q, i) => {
          const chosen = picked[q.id];
          const chosenIsRight = q.quiz_answers.find((a) => a.id === chosen)?.is_correct;
          const explanation = ur ? q.explanation_ur ?? q.explanation_en : q.explanation_en;
          return (
            <div key={q.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-bold leading-7">
                <span className="text-indigo-600">{i + 1}. </span>
                {ur ? q.question_ur ?? q.question_en : q.question_en}
              </p>

              <div className="mt-4 grid gap-3" role="radiogroup">
                {q.quiz_answers.map((a) => {
                  const isChosen = chosen === a.id;
                  let cls = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50';
                  if (isChosen && !submitted) cls = 'border-indigo-500 bg-indigo-50';
                  if (submitted && a.is_correct) cls = 'border-emerald-500 bg-emerald-50';
                  if (submitted && isChosen && !a.is_correct) cls = 'border-rose-500 bg-rose-50';
                  return (
                    <button
                      key={a.id}
                      type="button"
                      role="radio"
                      aria-checked={isChosen}
                      disabled={submitted}
                      onClick={() => setPicked({ ...picked, [q.id]: a.id })}
                      className={`w-full rounded-2xl border-2 px-4 py-3 text-start font-semibold transition ${cls}`}
                    >
                      {ur ? a.answer_ur ?? a.answer_en : a.answer_en}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className={`mt-4 rounded-2xl p-4 text-sm leading-6 ${chosenIsRight ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                  <b>{chosenIsRight ? `✅ ${t.correct}` : `❌ ${t.wrong}`}</b>
                  {explanation && <p className="mt-1">{explanation}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={check}
            disabled={answeredCount < qs.length}
            className="rounded-2xl bg-slate-950 px-6 py-3 font-extrabold text-white disabled:opacity-40"
          >
            {t.check}
          </button>
          <span className="text-sm text-slate-500">{t.answered(answeredCount, qs.length)}</span>
        </div>
      ) : (
        <div className={`mt-6 rounded-3xl p-6 ${passed ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
          <p className="text-xl font-black">{t.score(correctCount, qs.length, pct)}</p>
          <p className="mt-1">{passed ? t.pass : t.fail}</p>
          <p className="mt-2 text-sm">
            {saved ? (
              t.saved
            ) : !signedIn ? (
              <>
                <Link href={`/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`} className="font-bold underline">
                  {t.signIn}
                </Link>
                {t.signInNote}
              </>
            ) : null}
          </p>
          <button type="button" onClick={reset} className="mt-4 rounded-2xl bg-slate-950 px-6 py-3 font-extrabold text-white">
            {t.again}
          </button>
        </div>
      )}
    </section>
  );
}
