import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Any OpenAI-compatible provider works. Defaults to Groq.
//   AI_API_KEY   (or GROQ_API_KEY)  required
//   AI_BASE_URL  default https://api.groq.com/openai/v1
//   AI_MODEL     default llama-3.3-70b-versatile
const BASE_URL = (process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
const MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are Ilm, a warm, encouraging learning assistant inside "Ilm & Imagination", a bilingual (English/Urdu) learning magazine for students aged 10-16.

Subjects: Mathematics, Biology, Physics, Chemistry and Computer Science, plus general curiosity questions.

How you teach:
- Explain concepts simply, with everyday examples that a 10-16 year old can relate to.
- For homework-style problems, do NOT just give the final answer. Give a hint or the first step, explain the idea, and invite the student to try the next step. If they are stuck after trying, walk through it fully.
- Keep answers short: usually under 150 words. Use short paragraphs or a few numbered steps.
- End with one small question or mini-challenge to keep them thinking, when it fits.
- Be accurate. If you are not sure, say so instead of guessing.

Language: reply in the same language the student used. If they write in Urdu, answer in clear, simple Urdu (اردو). If they write in English, answer in English.

Safety: keep everything age-appropriate. Politely decline anything harmful, violent, sexual or unrelated to learning, and gently steer back to learning. Never ask for personal information such as full names, addresses, phone numbers or school names.`;

type Msg = { role: 'user' | 'assistant'; content: string };

// Best-effort per-instance rate limit (per IP). Not a substitute for provider-side limits.
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 8;
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

export async function POST(req: Request) {
  const key = process.env.AI_API_KEY || process.env.GROQ_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'Ask Ilm is not set up yet. The site owner needs to add AI_API_KEY in the hosting settings.' },
      { status: 503 },
    );
  }

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many questions too quickly. Please wait a minute and try again.' }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const raw: unknown[] = Array.isArray(body?.messages) ? body.messages : [];
  const messages: Msg[] = raw
    .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
    .slice(-10);

  if (!messages.length || messages[messages.length - 1].role !== 'user' || !messages[messages.length - 1].content.trim()) {
    return NextResponse.json({ error: 'Please type a question first.' }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const r = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 600,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    });

    if (!r.ok) {
      // Log details server-side only; never leak provider errors or keys to the browser.
      console.error('Ask Ilm provider error', r.status, (await r.text()).slice(0, 500));
      const msg =
        r.status === 429
          ? 'Ilm is very busy right now. Please try again in a moment.'
          : 'Ilm could not answer just now. Please try again.';
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const data = await r.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) return NextResponse.json({ error: 'Ilm did not send an answer. Please try again.' }, { status: 502 });
    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error('Ask Ilm request failed', e?.name || e);
    const msg = e?.name === 'AbortError' ? 'That took too long. Please try again.' : 'Ilm could not be reached. Please try again.';
    return NextResponse.json({ error: msg }, { status: 504 });
  } finally {
    clearTimeout(timer);
  }
}
