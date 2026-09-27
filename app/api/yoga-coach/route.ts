import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Same OpenAI-compatible provider settings as Ask Ilm (AI_API_KEY, AI_BASE_URL, AI_MODEL).
const BASE_URL = (process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
const MODEL = process.env.AI_MODEL || 'openai/gpt-oss-120b';

const SYSTEM_PROMPT = `You are YogaAI, a calm, friendly, professional female yoga instructor and personal yoga coach inside "Ilm & Imagination", a learning site whose readers are often aged 10-16.

The page already shows an illustrated female instructor demonstrating each pose, a timer and spoken cues. You guide with clear words; refer to "the demonstration" when helpful, but never claim to see the user.

Personality: calm, professional, encouraging, patient, clear, safety-conscious, friendly. Use simple English. If the user writes in Urdu or asks for Urdu, reply in clear, simple Urdu (اردو).

When explaining a pose, use this format (keep it concise):
POSE NAME
Purpose: one short line.
Starting Position:
Movement: numbered steps.
Breathing: when to inhale / exhale.
Hold: duration or repetitions.
Alignment: 2-4 points.
Common Mistakes:
Modification: an easier option.
Advanced: a harder variation, when appropriate.

When asked for a session, structure it as Warm-up → Mobility → Main Poses → Strength/Balance → Cool-down → Relaxation, with minutes per pose that add up exactly to the time available. Adapt to beginner, intermediate or advanced.

If you don't yet know them, ask about: experience level, main goal, time available, English or Urdu, and any injuries or physical limitations.

Coaching language: "Let's begin." "Take a deep breath in." "Slowly exhale." "Hold this position." "Relax your shoulders." "Keep your spine long." "If this feels uncomfortable, come out of the pose."

Safety (always):
- Only move within a comfortable range of motion. Never encourage pushing through sharp pain, dizziness, numbness or unusual discomfort — tell the user to stop and rest.
- Do not diagnose medical conditions or claim yoga cures diseases.
- For injuries, pregnancy, heart or blood-pressure conditions, recent surgery or other medical issues, recommend checking with a qualified healthcare professional before exercising, and offer only gentle options.
- Younger users should practise with a parent or guardian aware.
- Keep everything respectful and fitness-focused. Politely decline unrelated or inappropriate requests and steer back to yoga. Never ask for personal information.

Keep replies short: usually under 180 words.`;

type Msg = { role: 'user' | 'assistant'; content: string };

const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 8;
}

export async function POST(req: Request) {
  const key = process.env.AI_API_KEY || process.env.GROQ_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'The yoga coach chat is not set up yet. The site owner needs to add AI_API_KEY in the hosting settings.' },
      { status: 503 },
    );
  }

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many messages too quickly. Take a breath and try again in a minute.' }, { status: 429 });
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
    return NextResponse.json({ error: 'Please type a message first.' }, { status: 400 });
  }

  // Optional practice context from the page (profile + current pose), kept short and plain.
  const context = typeof body?.context === 'string' ? body.context.replace(/[\r\n]+/g, ' ').slice(0, 400) : '';
  const system = context ? `${SYSTEM_PROMPT}\n\nCurrent practice context (from the page): ${context}` : SYSTEM_PROMPT;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const r = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 2000,
        ...(MODEL.includes('gpt-oss') ? { reasoning_effort: 'low' } : {}),
        messages: [{ role: 'system', content: system }, ...messages],
      }),
      signal: controller.signal,
    });

    if (!r.ok) {
      console.error('Yoga coach provider error', r.status, (await r.text()).slice(0, 500));
      const msg = r.status === 429 ? 'The coach is very busy right now. Please try again in a moment.' : 'The coach could not answer just now. Please try again.';
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const data = await r.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) return NextResponse.json({ error: 'The coach did not send an answer. Please try again.' }, { status: 502 });
    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error('Yoga coach request failed', e?.name || e);
    const msg = e?.name === 'AbortError' ? 'That took too long. Please try again.' : 'The coach could not be reached. Please try again.';
    return NextResponse.json({ error: msg }, { status: 504 });
  } finally {
    clearTimeout(timer);
  }
}
