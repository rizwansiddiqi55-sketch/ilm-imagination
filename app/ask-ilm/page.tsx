'use client';

import { useEffect, useRef, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';

type Msg = { role: 'user' | 'assistant'; content: string };
type Lang = 'en' | 'ur';

const T = {
  en: {
    intro:
      'Ask about Maths, Biology, Physics, Chemistry or Computer Science. Ask Ilm is designed to explain concepts, give hints and encourage learning rather than simply doing homework.',
    placeholder: 'What would you like to understand?',
    ask: 'Ask Ilm ✨',
    thinking: 'Ilm is thinking…',
    clear: 'Start over',
    try: 'Try asking',
    suggestions: ['Why is the sky blue?', 'How do I find the next number in 2, 4, 8, 16?', 'What is a firewall?'],
  },
  ur: {
    intro:
      'ریاضی، حیاتیات، طبیعیات، کیمیا یا کمپیوٹر سائنس کے بارے میں پوچھیں۔ علم کا مقصد تصورات سمجھانا، اشارے دینا اور سیکھنے کی حوصلہ افزائی کرنا ہے، صرف ہوم ورک کرنا نہیں۔',
    placeholder: 'آپ کیا سمجھنا چاہتے ہیں؟',
    ask: 'علم سے پوچھیں ✨',
    thinking: 'علم سوچ رہا ہے…',
    clear: 'دوبارہ شروع کریں',
    try: 'یہ پوچھ کر دیکھیں',
    suggestions: ['آسمان نیلا کیوں ہوتا ہے؟', 'عدد 2، 4، 8، 16 کے بعد اگلا عدد کیسے معلوم کریں؟', 'فائر وال کیا ہوتی ہے؟'],
  },
} as const;

export default function AskIlm() {
  const [lang, setLang] = useState<Lang>('en');
  const [q, setQ] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, busy]);

  const t = T[lang];

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setQ('');
    setError('');
    setBusy(true);
    try {
      const r = await fetch('/api/ask-ilm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, lang }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.reply) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setMessages([...next, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setError('Could not reach Ilm. Check your internet connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <div dir={lang === 'ur' ? 'rtl' : 'ltr'} className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
          <p className="font-bold text-indigo-300">🤖 ASK ILM</p>
          <h1 className="mt-2 text-4xl font-black">Your learning assistant</h1>
          <p className="mt-4 max-w-2xl text-slate-300">{t.intro}</p>

          {messages.length > 0 && (
            <div className="mt-8 space-y-4" aria-live="polite">
              {messages.map((m, i) => (
                <div
                  key={i}
                  dir="auto"
                  className={
                    m.role === 'user'
                      ? 'ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl bg-indigo-500 p-4 leading-7'
                      : 'mr-auto max-w-[92%] whitespace-pre-wrap rounded-2xl bg-white/10 p-4 leading-7 text-slate-100'
                  }
                >
                  {m.role === 'assistant' && <span className="mb-1 block text-xs font-bold text-indigo-300">💡 Ilm</span>}
                  {m.content}
                </div>
              ))}
              {busy && <div className="mr-auto rounded-2xl bg-white/10 p-4 text-slate-300">{t.thinking}</div>}
              <div ref={endRef} />
            </div>
          )}

          {error && <div className="mt-4 rounded-2xl bg-rose-500/15 p-4 text-rose-200">{error}</div>}

          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(q);
              }
            }}
            maxLength={2000}
            dir="auto"
            placeholder={t.placeholder}
            className="mt-8 min-h-36 w-full rounded-2xl border border-white/10 bg-white/10 p-5 text-white outline-none placeholder:text-slate-500"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => send(q)}
              disabled={busy || !q.trim()}
              className="rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-950 disabled:opacity-50"
            >
              {busy ? t.thinking : t.ask}
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError('');
                }}
                className="rounded-2xl border border-white/20 px-5 py-3 font-bold text-slate-200 hover:bg-white/10"
              >
                {t.clear}
              </button>
            )}
          </div>

          {messages.length === 0 && (
            <div className="mt-6">
              <p className="text-sm text-slate-400">{t.try}:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {t.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
