'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import YogaFigure from '@/components/YogaFigure';
import { POSES, SECTION_LABEL, buildSession, type Goal, type Lang, type Level, type Limitation, type Pose, type Step } from '@/lib/yoga';

type Msg = { role: 'user' | 'assistant'; content: string };
type Stage = 'intake' | 'plan' | 'practice' | 'done';

const T = {
  en: {
    kicker: '🧘‍♀️ YOGA COACH',
    title: 'Your personal yoga instructor',
    intro: 'Tell me a little about yourself and I will build a session that fits your time — with a demonstration of every pose, breathing cues and a spoken countdown.',
    q1: '1. What is your yoga experience level?',
    q2: '2. What is your main goal?',
    q3: '3. How much time do you have?',
    q4: '4. Do you prefer English or Urdu?',
    q5: '5. Do you have any injuries or physical limitations?',
    q5hint: 'Tick anything that applies. I will leave out poses that load those areas.',
    medical: 'Other medical condition, pregnancy or recent surgery',
    medicalNote: 'Please check with a qualified healthcare professional before starting a new exercise programme. Today I will keep things gentle.',
    create: 'Create my session',
    min: 'min',
    planTitle: 'Your session',
    skipped: 'Left out for your safety',
    begin: "Let's begin",
    edit: 'Change answers',
    purpose: 'Purpose',
    start: 'Starting position',
    movement: 'Movement',
    breathing: 'Breathing',
    hold: 'Hold',
    alignment: 'Alignment',
    mistakes: 'Common mistakes',
    modification: 'Easier modification',
    advanced: 'Advanced variation',
    prev: '◀ Back',
    next: 'Next ▶',
    pause: 'Pause',
    resume: 'Resume',
    voiceOn: '🔊 Voice on',
    voiceOff: '🔇 Voice off',
    camOn: '📷 Mirror on',
    camOff: '📷 Mirror',
    camNote: 'Your camera stays on this device — nothing is recorded or uploaded.',
    pain: '✋ I feel pain',
    painNote: 'Stop the movement and rest. Never push through sharp pain, dizziness or numbness. If it continues, speak to a qualified healthcare professional.',
    end: 'End session',
    upNext: 'Up next',
    doneTitle: 'Well done! Namaste 🙏',
    doneText: 'Take a moment to notice how you feel. Drink some water and get up slowly.',
    again: 'Practise again',
    newPlan: 'New session',
    safety: 'Only move within a comfortable range of motion. If you feel pain, stop the movement and rest.',
    noUrduVoice: 'No Urdu voice was found on this device, so spoken cues will be in English.',
    chatTitle: 'Ask your coach',
    chatHint: 'e.g. "How do I make Downward Dog easier?"',
    send: 'Send',
    thinking: 'Coach is thinking…',
    library: 'Pose library',
    levels: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
    goals: {
      flexibility: 'Flexibility',
      mobility: 'Full-body mobility',
      relaxation: 'Relaxation',
      stress: 'Stress reduction',
      balance: 'Balance',
      fitness: 'General fitness',
      morning: 'Morning routine',
      evening: 'Evening relaxation',
      desk: 'Yoga for desk workers',
    },
    limits: { wrists: 'Wrists', knees: 'Knees', back: 'Lower back', neck: 'Neck', balance: 'Balance / dizziness' },
    begin1: "Let's begin.",
    nextPose: 'Next pose',
    relax: 'And relax.',
    countdown: { 20: '20', 15: '15', 10: '10', 5: '5' } as Record<number, string>,
    finished: 'Session complete. Well done.',
  },
  ur: {
    kicker: '🧘‍♀️ یوگا کوچ',
    title: 'آپ کی ذاتی یوگا انسٹرکٹر',
    intro: 'مجھے اپنے بارے میں تھوڑا بتائیں، میں آپ کے وقت کے مطابق سیشن بناؤں گی — ہر آسن کا مظاہرہ، سانس کی ہدایات اور بول کر گنتی کے ساتھ۔',
    q1: '1. یوگا میں آپ کا تجربہ کتنا ہے؟',
    q2: '2. آپ کا بنیادی مقصد کیا ہے؟',
    q3: '3. آپ کے پاس کتنا وقت ہے؟',
    q4: '4. انگریزی یا اردو؟',
    q5: '5. کیا آپ کو کوئی چوٹ یا جسمانی مشکل ہے؟',
    q5hint: 'جو لاگو ہو اس پر نشان لگائیں۔ میں ان حصوں پر زور ڈالنے والے آسن نکال دوں گی۔',
    medical: 'کوئی اور طبی مسئلہ، حمل یا حالیہ آپریشن',
    medicalNote: 'نئی ورزش شروع کرنے سے پہلے کسی مستند طبی ماہر سے مشورہ کریں۔ آج میں مشق نرم رکھوں گی۔',
    create: 'میرا سیشن بنائیں',
    min: 'منٹ',
    planTitle: 'آپ کا سیشن',
    skipped: 'آپ کی حفاظت کے لیے نکال دیے گئے',
    begin: 'آئیے شروع کریں',
    edit: 'جوابات بدلیں',
    purpose: 'مقصد',
    start: 'ابتدائی حالت',
    movement: 'حرکت',
    breathing: 'سانس',
    hold: 'رکیں',
    alignment: 'درست انداز',
    mistakes: 'عام غلطیاں',
    modification: 'آسان طریقہ',
    advanced: 'مشکل طریقہ',
    prev: 'پیچھے ▶',
    next: '◀ آگے',
    pause: 'روکیں',
    resume: 'جاری رکھیں',
    voiceOn: '🔊 آواز آن',
    voiceOff: '🔇 آواز بند',
    camOn: '📷 آئینہ آن',
    camOff: '📷 آئینہ',
    camNote: 'آپ کا کیمرہ صرف اسی ڈیوائس پر رہتا ہے — کچھ ریکارڈ یا اپ لوڈ نہیں ہوتا۔',
    pain: '✋ مجھے درد ہو رہا ہے',
    painNote: 'حرکت روکیں اور آرام کریں۔ تیز درد، چکر یا سُن پن میں کبھی زور نہ لگائیں۔ اگر یہ جاری رہے تو کسی مستند طبی ماہر سے بات کریں۔',
    end: 'سیشن ختم کریں',
    upNext: 'اگلا',
    doneTitle: 'شاباش! نمستے 🙏',
    doneText: 'ایک لمحہ رکیں اور محسوس کریں کہ آپ کیسا محسوس کر رہے ہیں۔ پانی پئیں اور آہستہ اٹھیں۔',
    again: 'دوبارہ مشق کریں',
    newPlan: 'نیا سیشن',
    safety: 'صرف آرام دہ حد تک حرکت کریں۔ اگر درد ہو تو حرکت روکیں اور آرام کریں۔',
    noUrduVoice: 'اس ڈیوائس پر اردو آواز نہیں ملی، اس لیے بولی جانے والی ہدایات انگریزی میں ہوں گی۔',
    chatTitle: 'اپنی کوچ سے پوچھیں',
    chatHint: 'مثلاً: "نیچے دیکھتا کتا آسان کیسے کروں؟"',
    send: 'بھیجیں',
    thinking: 'کوچ سوچ رہی ہیں…',
    library: 'آسنوں کی فہرست',
    levels: { beginner: 'ابتدائی', intermediate: 'درمیانہ', advanced: 'ماہر' },
    goals: {
      flexibility: 'لچک',
      mobility: 'پورے جسم کی حرکت',
      relaxation: 'آرام',
      stress: 'ذہنی دباؤ کم کرنا',
      balance: 'توازن',
      fitness: 'عمومی فٹنس',
      morning: 'صبح کی مشق',
      evening: 'شام کا آرام',
      desk: 'دفتر میں کام کرنے والوں کے لیے',
    },
    limits: { wrists: 'کلائیاں', knees: 'گھٹنے', back: 'نچلی کمر', neck: 'گردن', balance: 'توازن / چکر' },
    begin1: 'آئیے شروع کریں۔',
    nextPose: 'اگلا آسن',
    relax: 'اور آرام کریں۔',
    countdown: { 20: 'بیس', 15: 'پندرہ', 10: 'دس', 5: 'پانچ' } as Record<number, string>,
    finished: 'سیشن مکمل۔ بہت خوب۔',
  },
} as const;

const TIMES = [5, 10, 15, 20, 30, 45, 60];
const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];
const GOALS: Goal[] = ['flexibility', 'mobility', 'relaxation', 'stress', 'balance', 'fitness', 'morning', 'evening', 'desk'];
const LIMITS: Limitation[] = ['wrists', 'knees', 'back', 'neck', 'balance'];
const FEMALE_VOICE = /female|woman|samantha|victoria|zira|karen|moira|tessa|fiona|serena|susan|hazel|libby|sonia|natasha|aria|jenny|salma|uzma|gul/i;

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, '0')}`;

function chip(active: boolean) {
  return `rounded-full border px-4 py-2 text-sm font-bold transition ${active ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400'}`;
}

export default function YogaCoach() {
  const [lang, setLang] = useState<Lang>('en');
  const [stage, setStage] = useState<Stage>('intake');
  const [level, setLevel] = useState<Level>('beginner');
  const [goal, setGoal] = useState<Goal>('flexibility');
  const [minutes, setMinutes] = useState(20);
  const [avoid, setAvoid] = useState<Limitation[]>([]);
  const [medical, setMedical] = useState(false);
  const [plan, setPlan] = useState<{ steps: Step[]; skipped: string[] }>({ steps: [], skipped: [] });

  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(true);
  const [painOpen, setPainOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [cam, setCam] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const t = T[lang];
  const steps = plan.steps;
  const step = steps[idx] as Step | undefined;

  // Follow the site-wide language toggle.
  useEffect(() => {
    try {
      const s = localStorage.getItem('ilm-lang');
      if (s === 'en' || s === 'ur') setLang(s);
    } catch {
      /* ignore */
    }
    const h = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener('ilm-language', h);
    return () => window.removeEventListener('ilm-language', h);
  }, []);

  // ---------- voice ----------
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const urduVoice = useMemo(() => voices.find((v) => v.lang.toLowerCase().startsWith('ur')), [voices]);
  const speakLang: Lang = lang === 'ur' && urduVoice ? 'ur' : 'en';
  const pickVoice = useCallback(() => {
    if (speakLang === 'ur') return urduVoice;
    const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    return en.find((v) => FEMALE_VOICE.test(v.name)) ?? en[0];
  }, [voices, urduVoice, speakLang]);

  const voiceRef = useRef(voice);
  voiceRef.current = voice;
  const say = useCallback(
    (text: string, interrupt = false) => {
      if (!voiceRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (interrupt) window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) u.voice = v;
      u.lang = speakLang === 'ur' ? 'ur-PK' : v?.lang || 'en-US';
      u.rate = 0.88; // speak slowly and clearly
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    },
    [pickVoice, speakLang],
  );
  const S = T[speakLang]; // strings used for speech

  // ---------- session ----------
  function create() {
    const p = buildSession({ minutes, goal, level: medical ? 'beginner' : level, avoid: medical ? [...new Set<Limitation>([...avoid, 'balance'])] : avoid });
    setPlan(p);
    setStage('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const announce = useCallback(
    (s: Step, first: boolean, interrupt: boolean) => {
      const p = s.pose;
      say(`${first ? S.begin1 + ' ' : S.nextPose + ': '}${p.name[speakLang]}.`, interrupt);
      say(p.start[speakLang]);
      p.steps[speakLang].forEach((line) => say(line));
      say(p.breath[speakLang]);
    },
    [say, S, speakLang],
  );

  function goTo(i: number, first = false, interrupt = true) {
    if (i >= steps.length) return finish();
    const clamped = Math.max(0, i);
    setIdx(clamped);
    setLeft(steps[clamped].seconds);
    setPainOpen(false);
    announce(steps[clamped], first, interrupt);
  }

  function begin() {
    setStage('practice');
    setRunning(true);
    goTo(0, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finish(interrupt = true) {
    setRunning(false);
    setStage('done');
    say(S.finished, interrupt);
    stopCam();
  }

  // One-second ticker with countdown and periodic coaching cues.
  const tick = useRef<() => void>(() => {});
  tick.current = () => {
    if (!step) return;
    const next = left - 1;
    const elapsed = step.seconds - next;
    if (next <= 0) {
      // Let "And relax" finish before the next pose is announced.
      say(S.relax, true);
      if (idx + 1 >= steps.length) finish(false);
      else goTo(idx + 1, false, false);
      return;
    }
    setLeft(next);
    if (step.seconds >= 30 && S.countdown[next]) say(S.countdown[next], next <= 10);
    else if (elapsed > 20 && next > 22 && elapsed % 15 === 0 && !window.speechSynthesis?.speaking) {
      const cues = step.pose.cues[speakLang];
      say(cues[Math.floor(elapsed / 15) % cues.length]);
    }
  };
  useEffect(() => {
    if (stage !== 'practice' || !running) return;
    const id = setInterval(() => tick.current(), 1000);
    return () => clearInterval(id);
  }, [stage, running]);

  function togglePause() {
    if (running) window.speechSynthesis?.cancel();
    setRunning((r) => !r);
  }

  function pain() {
    setRunning(false);
    setPainOpen(true);
    window.speechSynthesis?.cancel();
    say(S.painNote);
  }

  // ---------- mirror camera (local preview only; no analysis, nothing uploaded) ----------
  function stopCam() {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setCam(false);
  }
  async function toggleCam() {
    if (cam) return stopCam();
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = s;
      setCam(true);
    } catch {
      setCam(false);
    }
  }
  useEffect(() => {
    if (cam && videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
  }, [cam, stage]);
  useEffect(() => () => streamRef.current?.getTracks().forEach((tr) => tr.stop()), []);

  // ---------- coach chat ----------
  const [q, setQ] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const context = [
    `level=${level}`,
    `goal=${goal}`,
    `time=${minutes}min`,
    `language=${lang === 'ur' ? 'Urdu' : 'English'}`,
    avoid.length ? `limitations=${avoid.join(',')}` : 'limitations=none reported',
    medical ? 'has a medical condition: keep gentle and advise a healthcare professional' : '',
    stage === 'practice' && step ? `currently in ${step.pose.name.en}` : '',
  ]
    .filter(Boolean)
    .join('; ');

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setQ('');
    setError('');
    setBusy(true);
    try {
      const r = await fetch('/api/yoga-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, context }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.reply) setError(data.error || 'Something went wrong. Please try again.');
      else setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch {
      setError('Could not reach the coach. Check your internet connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  const totalLeft = step ? left + steps.slice(idx + 1).reduce((a, s) => a + s.seconds, 0) : 0;
  const pct = step ? ((step.seconds - left) / step.seconds) * 100 : 0;

  return (
    <>
      <SiteHeader />
      <main dir={lang === 'ur' ? 'rtl' : 'ltr'} className="mx-auto max-w-6xl px-5 py-12">
        <div className={`rounded-[2rem] bg-gradient-to-br from-teal-700 to-slate-900 text-white ${stage === 'practice' ? 'px-6 py-4' : 'p-8 md:p-12'}`}>
          <p className="font-bold text-teal-200">{t.kicker}</p>
          {stage !== 'practice' && (
            <>
              <h1 className="mt-2 text-4xl font-black">{t.title}</h1>
              <p className="mt-4 max-w-2xl text-teal-50/90">{t.intro}</p>
            </>
          )}
          <p className={`text-sm text-teal-100/80 ${stage === 'practice' ? 'mt-1' : 'mt-4'}`}>🛡️ {t.safety}</p>
        </div>

        {stage === 'intake' && (
          <section className="mt-8 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <Q title={t.q1}>
              {LEVELS.map((l) => (
                <button key={l} type="button" onClick={() => setLevel(l)} className={chip(level === l)}>
                  {t.levels[l]}
                </button>
              ))}
            </Q>
            <Q title={t.q2}>
              {GOALS.map((g) => (
                <button key={g} type="button" onClick={() => setGoal(g)} className={chip(goal === g)}>
                  {t.goals[g]}
                </button>
              ))}
            </Q>
            <Q title={t.q3}>
              {TIMES.map((m) => (
                <button key={m} type="button" onClick={() => setMinutes(m)} className={chip(minutes === m)}>
                  {m} {t.min}
                </button>
              ))}
            </Q>
            <Q title={t.q4}>
              <button type="button" onClick={() => setLang('en')} className={chip(lang === 'en')}>
                English
              </button>
              <button type="button" onClick={() => setLang('ur')} className={chip(lang === 'ur')}>
                اردو
              </button>
            </Q>
            <Q title={t.q5} hint={t.q5hint}>
              {LIMITS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={avoid.includes(l)}
                  onClick={() => setAvoid((a) => (a.includes(l) ? a.filter((x) => x !== l) : [...a, l]))}
                  className={chip(avoid.includes(l))}
                >
                  {t.limits[l]}
                </button>
              ))}
              <button type="button" aria-pressed={medical} onClick={() => setMedical((m) => !m)} className={chip(medical)}>
                {t.medical}
              </button>
            </Q>
            {medical && <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">⚠️ {t.medicalNote}</p>}
            <button type="button" onClick={create} className="rounded-2xl bg-teal-600 px-7 py-3 font-extrabold text-white hover:bg-teal-700">
              {t.create} →
            </button>
          </section>
        )}

        {stage === 'plan' && (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-3xl font-black">
              {t.planTitle}: {minutes} {t.min} · {t.levels[medical ? 'beginner' : level]} · {t.goals[goal]}
            </h2>
            {medical && <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">⚠️ {t.medicalNote}</p>}
            {plan.skipped.length > 0 && (
              <p className="mt-4 text-sm text-slate-500">
                {t.skipped}: {plan.skipped.join(', ')}
              </p>
            )}
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <YogaFigure figure={s.pose.figure} label={s.pose.name[lang]} className="h-16 w-20 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{SECTION_LABEL[s.section][lang]}</p>
                    <p className="font-black">{s.pose.name[lang]}</p>
                    <p className="text-sm text-slate-500">{fmt(s.seconds)}</p>
                  </div>
                </li>
              ))}
            </ol>
            {lang === 'ur' && !urduVoice && <p className="mt-5 text-sm text-slate-500">ℹ️ {t.noUrduVoice}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={begin} className="rounded-2xl bg-teal-600 px-7 py-3 font-extrabold text-white hover:bg-teal-700">
                {t.begin} 🧘‍♀️
              </button>
              <button type="button" onClick={() => setStage('intake')} className="rounded-2xl border border-slate-200 px-6 py-3 font-bold">
                {t.edit}
              </button>
            </div>
          </section>
        )}

        {stage === 'practice' && step && (
          <section className="mt-8">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-teal-500 transition-all" style={{ width: `${((idx + pct / 100) / steps.length) * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-sm font-semibold text-slate-500">
              <span>
                {idx + 1} / {steps.length} · {SECTION_LABEL[step.section][lang]}
              </span>
              <span dir="ltr">⏱ {fmt(totalLeft)}</span>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className={cam ? 'grid gap-3 sm:grid-cols-2' : ''}>
                  <YogaFigure figure={step.pose.figure} label={step.pose.name[lang]} className="mx-auto w-full max-w-md" />
                  {cam && (
                    <div>
                      <video ref={videoRef} autoPlay playsInline muted className="aspect-[6/5] w-full -scale-x-100 rounded-[18px] bg-slate-900 object-cover" />
                      <p className="mt-1 text-xs text-slate-400">{t.camNote}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black">{step.pose.name[lang]}</h2>
                    {step.pose.sanskrit && <p className="text-sm italic text-slate-400">{step.pose.sanskrit}</p>}
                  </div>
                  <p dir="ltr" className="text-5xl font-black tabular-nums text-teal-600">
                    {fmt(left)}
                  </p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-teal-100">
                  <div className="h-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => goTo(idx - 1)} disabled={idx === 0} className="rounded-xl border border-slate-200 px-4 py-2 font-bold disabled:opacity-40">
                    {t.prev}
                  </button>
                  <button type="button" onClick={togglePause} className="rounded-xl bg-slate-900 px-5 py-2 font-bold text-white">
                    {running ? `⏸ ${t.pause}` : `▶ ${t.resume}`}
                  </button>
                  <button type="button" onClick={() => goTo(idx + 1)} className="rounded-xl border border-slate-200 px-4 py-2 font-bold">
                    {t.next}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (voice) window.speechSynthesis?.cancel();
                      setVoice((v) => !v);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold"
                  >
                    {voice ? t.voiceOn : t.voiceOff}
                  </button>
                  <button type="button" onClick={toggleCam} aria-pressed={cam} className="rounded-xl border border-slate-200 px-4 py-2 font-bold">
                    {cam ? t.camOn : t.camOff}
                  </button>
                  <button type="button" onClick={pain} className="rounded-xl bg-rose-50 px-4 py-2 font-bold text-rose-700">
                    {t.pain}
                  </button>
                  <button type="button" onClick={() => finish()} className="rounded-xl px-4 py-2 font-bold text-slate-500 hover:text-slate-900">
                    {t.end}
                  </button>
                </div>
                {painOpen && <p className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-800">{t.painNote}</p>}

                {steps[idx + 1] && (
                  <p className="mt-5 text-sm text-slate-500">
                    {t.upNext}: <b className="text-slate-700">{steps[idx + 1].pose.name[lang]}</b> · {fmt(steps[idx + 1].seconds)}
                  </p>
                )}
              </div>

              <PoseCard pose={step.pose} lang={lang} highlightAdvanced={level === 'advanced' && !medical} />
            </div>
          </section>
        )}

        {stage === 'done' && (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
            <YogaFigure figure={POSES.breathing.figure} label={POSES.breathing.name[lang]} className="mx-auto w-64" />
            <h2 className="mt-4 text-3xl font-black">{t.doneTitle}</h2>
            <p className="mt-2 text-slate-600">{t.doneText}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={begin} className="rounded-2xl bg-teal-600 px-6 py-3 font-extrabold text-white">
                {t.again}
              </button>
              <button type="button" onClick={() => setStage('intake')} className="rounded-2xl border border-slate-200 px-6 py-3 font-bold">
                {t.newPlan}
              </button>
            </div>
          </section>
        )}

        {/* Coach chat */}
        <section className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white md:p-8">
          <h2 className="text-2xl font-black">💬 {t.chatTitle}</h2>
          {messages.length > 0 && (
            <div className="mt-5 max-h-96 space-y-3 overflow-y-auto" aria-live="polite">
              {messages.map((m, i) => (
                <div
                  key={i}
                  dir="auto"
                  className={
                    m.role === 'user'
                      ? 'ms-auto max-w-[85%] whitespace-pre-wrap rounded-2xl bg-teal-600 p-4 leading-7'
                      : 'me-auto max-w-[92%] whitespace-pre-wrap rounded-2xl bg-white/10 p-4 leading-7 text-slate-100'
                  }
                >
                  {m.role === 'assistant' && <span className="mb-1 block text-xs font-bold text-teal-300">🧘‍♀️ YogaAI</span>}
                  {m.content}
                </div>
              ))}
              {busy && <div className="me-auto rounded-2xl bg-white/10 p-4 text-slate-300">{t.thinking}</div>}
            </div>
          )}
          {error && <div className="mt-4 rounded-2xl bg-rose-500/15 p-4 text-rose-200">{error}</div>}
          <div className="mt-5 flex gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(q)}
              maxLength={2000}
              dir="auto"
              placeholder={t.chatHint}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-slate-500"
            />
            <button type="button" onClick={() => send(q)} disabled={busy || !q.trim()} className="rounded-2xl bg-white px-5 py-3 font-extrabold text-slate-950 disabled:opacity-50">
              {t.send}
            </button>
          </div>
        </section>

        {stage !== 'practice' && (
          <section className="mt-10">
            <h2 className="text-2xl font-black">📚 {t.library}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.values(POSES).map((p) => (
                <details key={p.id} className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer list-none">
                    <YogaFigure figure={p.figure} label={p.name[lang]} className="w-full" />
                    <p className="mt-2 font-black">{p.name[lang]}</p>
                    <p className="text-sm text-slate-500">{p.purpose[lang]}</p>
                  </summary>
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <PoseCard pose={p} lang={lang} compact />
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function Q({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-black">{title}</h3>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function PoseCard({ pose, lang, highlightAdvanced, compact }: { pose: Pose; lang: Lang; highlightAdvanced?: boolean; compact?: boolean }) {
  const t = T[lang];
  const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{label}</p>
      <div className="mt-1 text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm'}>
      {!compact && <h3 className="text-xl font-black">{pose.name[lang]}</h3>}
      <Row label={t.purpose}>{pose.purpose[lang]}</Row>
      <Row label={t.start}>{pose.start[lang]}</Row>
      <Row label={t.movement}>
        <ol className="list-decimal space-y-1 ps-5">
          {pose.steps[lang].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Row>
      <Row label={t.breathing}>{pose.breath[lang]}</Row>
      <Row label={t.hold}>{pose.hold[lang]}</Row>
      <Row label={t.alignment}>
        <ul className="list-disc space-y-1 ps-5">
          {pose.alignment[lang].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Row>
      <Row label={t.mistakes}>
        <ul className="list-disc space-y-1 ps-5">
          {pose.mistakes[lang].map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Row>
      <Row label={t.modification}>{pose.modification[lang]}</Row>
      <div className={highlightAdvanced ? 'rounded-2xl bg-teal-50 p-3' : ''}>
        <Row label={t.advanced}>{pose.advanced[lang]}</Row>
      </div>
    </div>
  );
}
