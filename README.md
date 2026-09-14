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
The Ask Ilm UI is intentionally not connected to an AI provider yet. AI calls should go through a server-side route/action so an AI API key is never exposed to the browser.
