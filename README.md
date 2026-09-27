# Ilm & Imagination — Supabase Integrated Phase 2

Bilingual English/Urdu learning magazine for ages 10–16.

## Supabase connection
Set these Vercel Production environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The app intentionally uses only the public browser-safe Supabase key. Never expose `service_role` in a `NEXT_PUBLIC_` variable.

## What is connected
- Published subjects/content from Supabase
- English/Urdu translations
- Stories, activities, experiments and quizzes content feeds
- Content detail route `/content/[slug]`
- Daily challenge feed
- Supabase magic-link login architecture
- Search starter
- Bookmarks/profile/badges architecture
- Responsive magazine-style UI

## Deploy
Upload/replace the project in GitHub and let Vercel deploy the `main` branch. The existing Supabase schema and seed data can remain in the `supabase/` directory.

## Important
Ask Ilm calls a server-side route (`app/api/ask-ilm`) so the AI key is never exposed to the browser. Set `AI_API_KEY` (a Groq key by default) in Vercel → Settings → Environment Variables, then redeploy.

## Yoga Coach (`/yoga`)
YogaAI, a female yoga instructor persona:
- Intake: experience level, goal, time (5–60 min), English/Urdu, injuries/limitations. Poses that load a flagged area are left out, and a medical flag keeps the session gentle and recommends seeing a healthcare professional.
- Session planner (`lib/yoga.ts`): Warm-up → Mobility → Main → Strength/Balance → Cool-down → Relaxation, with pose timings that add up exactly to the chosen time.
- Every pose shows an illustrated instructor demonstration (`components/YogaFigure.tsx`), plus purpose, starting position, movement, breathing, hold, alignment, common mistakes, an easier modification and an advanced variation.
- Live practice: timer, spoken step-by-step cues and a countdown (browser speech, female voice preferred), pause/next/back, "I feel pain" safety stop, and an optional camera mirror that stays on the device.
- "Ask your coach" chat via `app/api/yoga-coach` (uses the same `AI_API_KEY` as Ask Ilm).
