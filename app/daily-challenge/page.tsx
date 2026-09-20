'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { getSupabase } from '@/lib/supabase';
import {
  Challenge,
  GENERIC_STEPS_EN,
  GENERIC_STEPS_UR,
  contentFor,
  pickFallback,
} from '@/lib/challenges';

type Lang = 'en' | 'ur';

const T = {
  en: {
    steps: 'How to do it',
    yourAnswer: 'Your answer',
    placeholder: 'Write what you found and explain your reasoning…',
    hint: 'Show a hint',
    hideHint: 'Hide hint',
    example: 'See an example',
    hideExample: 'Hide example',
    complete: 'Mark as complete',
    needMore: 'Write a little more (at least a sentence) before completing.',
    done: 'Challenge complete!',
    xp: (n: number) => `You earned +${n} XP.`,
    already: 'You already earned XP for this challenge.',
    signIn: 'Sign in',
    signInNote: ' to save your progress and earn XP.',
    saved: 'Your answer is saved on this device.',
    fallbackNote: "Today's challenge hasn't been published yet, so here is a featured one.",
    error: 'Something went wrong saving your completion. Please try again.',
  },
  ur: {
    steps: 'کیسے کریں',
    yourAnswer: 'آپ کا جواب',
    placeholder: 'جو آپ کو ملا وہ لکھیں اور اس کی وجہ بتائیں…',
    hint: 'اشارہ دکھائیں',
    hideHint: 'اشارہ چھپائیں',
    example: 'مثال دیکھیں',
    hideExample: 'مثال چھپائیں',
    complete: 'مکمل کا نشان لگائیں',
    needMore: 'مکمل کرنے سے پہلے تھوڑا اور لکھیں (کم از کم ایک جملہ)۔',
    done: 'چیلنج مکمل!',
    xp: (n: number) => `آپ نے +${n} XP حاصل کیے۔`,
    already: 'اس چیلنج کا XP آپ پہلے ہی حاصل کر چکے ہیں۔',
    signIn: 'سائن ان کریں',
    signInNote: ' تاکہ آپ کی پیش رفت محفوظ ہو اور XP ملے۔',
    saved: 'آپ کا جواب اسی ڈیوائس پر محفوظ ہے۔',
    fallbackNote: 'آج کا چیلنج ابھی شائع نہیں ہوا، اس لیے ایک نمایاں چیلنج دکھایا جا رہا ہے۔',
    error: 'مکمل ہونے کا اندراج محفوظ کرتے ہوئے مسئلہ آیا۔ دوبارہ کوشش کریں۔',
  },
} as const;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable, ignore */
  }
}

export default function DailyChallenge() {
  const [c, setC] = useState<Challenge | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [done, setDone] = useState(false);
  const [earned, setEarned] = useState<number | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // Language (same mechanism as the rest of the site)
  useEffect(() => {
    const s = safeGet('ilm-lang') as Lang | null;
    if (s === 'en' || s === 'ur') setLang(s);
    const h = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener('ilm-language', h);
    return () => window.removeEventListener('ilm-language', h);
  }, []);

  // Load today's challenge (or the latest published one, or a built-in one)
  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().slice(0, 10);
      const s = getSupabase();
      let row: Challenge | null = null;

      if (s) {
        const { data } = await s
          .from('daily_challenges')
          .select('*')
          .lte('challenge_date', today)
          .order('challenge_date', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) row = data as Challenge;

        const { data: u } = await s.auth.getUser();
        setSignedIn(!!u?.user);
      }

      let merged: Challenge;
      if (row) {
        // Fill any missing rich fields from the built-in bank (matched by title)
        const base = contentFor(row.title_en) ?? {};
        merged = { ...base, ...stripNulls(row) } as Challenge;
        // A row that is older than today is not "today's" challenge
        setIsFallback(row.challenge_date !== today);
      } else {
        merged = pickFallback(today);
        setIsFallback(true);
      }
      setC(merged);

      const key = storageKey(merged, today);
      setAnswer(safeGet(`ilm-ch-answer-${key}`) ?? '');
      if (safeGet(`ilm-ch-done-${key}`) === '1') setDone(true);

      // Check server-side completion for signed-in users
      if (s && row?.id) {
        const { data: u } = await s.auth.getUser();
        if (u?.user) {
          const { data: comp } = await s
            .from('daily_challenge_completions')
            .select('challenge_id')
            .eq('challenge_id', row.id)
            .maybeSingle();
          if (comp) setDone(true);
        }
      }
    }
    load();
  }, []);

  function stripNulls(o: Challenge): Partial<Challenge> {
    return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as Partial<Challenge>;
  }
  function storageKey(ch: Challenge, today: string) {
    return ch.id ?? `${ch.challenge_date ?? today}-${ch.title_en}`;
  }

  const t = T[lang];
  const ur = lang === 'ur';

  function onAnswer(v: string) {
    setAnswer(v);
    setMsg('');
    if (c) safeSet(`ilm-ch-answer-${storageKey(c, new Date().toISOString().slice(0, 10))}`, v);
  }

  async function complete() {
    if (!c || busy) return;
    if (answer.trim().length < 10) {
      setMsg(t.needMore);
      return;
    }
    setBusy(true);
    setMsg('');
    const key = storageKey(c, new Date().toISOString().slice(0, 10));
    let xp: number | null = null;

    try {
      const s = getSupabase();
      if (s && signedIn && c.id) {
        const { data, error } = await s.rpc('complete_daily_challenge', { p_challenge_id: c.id });
        if (error) throw error;
        xp = typeof data === 'number' ? data : 0;
      }
      safeSet(`ilm-ch-done-${key}`, '1');
      setEarned(xp);
      setDone(true);
    } catch {
      setMsg(t.error);
    } finally {
      setBusy(false);
    }
  }

  const title = c ? (ur ? c.title_ur ?? c.title_en : c.title_en) : '';
  const description = c ? (ur ? c.description_ur ?? c.description_en : c.description_en) : '';
  const steps = c
    ? ur
      ? c.steps_ur ?? (c.steps_en ? c.steps_en : GENERIC_STEPS_UR)
      : c.steps_en ?? GENERIC_STEPS_EN
    : [];
  const hint = c ? (ur ? c.hint_ur ?? c.hint_en : c.hint_en) : null;
  const example = c ? (ur ? c.example_ur ?? c.example_en : c.example_en) : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="font-bold text-indigo-600">🔥 DAILY CHALLENGE</p>
        <h1 className="mt-1 text-4xl font-black">Think. Solve. Learn.</h1>

        {!c ? (
          <div className="mt-8 h-64 animate-pulse rounded-3xl bg-slate-100" />
        ) : (
          <div
            dir={ur ? 'rtl' : 'ltr'}
            className="mt-8 rounded-[2rem] bg-slate-950 p-8 text-white md:p-12"
          >
            {isFallback && <p className="mb-4 rounded-xl bg-amber-400/10 px-4 py-2 text-sm text-amber-200">{t.fallbackNote}</p>}

            <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold">+{c.xp_reward} XP</span>
            <h2 className="mt-6 text-3xl font-black">{title}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>

            <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-indigo-300">{t.steps}</h3>
            <ol className={`mt-3 list-decimal space-y-2 text-slate-200 ${ur ? 'pr-6' : 'pl-6'}`}>
              {steps.map((st, i) => (
                <li key={i} className="leading-7">{st}</li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap gap-3">
              {hint && (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
                >
                  💡 {showHint ? t.hideHint : t.hint}
                </button>
              )}
              {example && (
                <button
                  type="button"
                  onClick={() => setShowExample(!showExample)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
                >
                  📘 {showExample ? t.hideExample : t.example}
                </button>
              )}
            </div>
            {showHint && hint && <p className="mt-4 rounded-2xl bg-white/5 p-4 leading-7 text-slate-200">💡 {hint}</p>}
            {showExample && example && <p className="mt-4 rounded-2xl bg-white/5 p-4 leading-7 text-slate-200">📘 {example}</p>}

            <label className="mt-8 block text-sm font-bold uppercase tracking-wide text-indigo-300" htmlFor="ch-answer">
              {t.yourAnswer}
            </label>
            <textarea
              id="ch-answer"
              value={answer}
              onChange={(e) => onAnswer(e.target.value)}
              disabled={done}
              rows={5}
              placeholder={t.placeholder}
              className="mt-3 w-full rounded-2xl border border-white/15 bg-white/5 p-4 text-base leading-7 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none disabled:opacity-70"
            />
            <p className="mt-2 text-xs text-slate-400">{t.saved}</p>

            {done ? (
              <div className="mt-6 rounded-2xl bg-emerald-500/15 p-5 text-emerald-200">
                <p className="text-lg font-black">🎉 {t.done}</p>
                <p className="mt-1 text-sm">
                  {earned && earned > 0 ? t.xp(earned) : signedIn ? t.already : ''}
                  {!signedIn && (
                    <>
                      <Link href="/login?next=/daily-challenge" className="font-bold underline">{t.signIn}</Link>
                      {t.signInNote}
                    </>
                  )}
                </p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={complete}
                  disabled={busy}
                  className="mt-6 rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-950 disabled:opacity-60"
                >
                  {t.complete}
                </button>
                {!signedIn && (
                  <p className="mt-4 text-xs text-slate-400">
                    <Link href="/login?next=/daily-challenge" className="font-bold underline">{t.signIn}</Link>
                    {t.signInNote}
                  </p>
                )}
              </>
            )}
            {msg && <p className="mt-3 text-sm text-amber-300">{msg}</p>}
          </div>
        )}
      </main>
    </>
  );
}
