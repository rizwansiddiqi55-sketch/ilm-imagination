-- Run once in Supabase → SQL Editor. Safe to run again.
-- Each lesson card currently falls back to its SUBJECT's icon, so every Sports
-- lesson (padel, cricket, football, tennis) shows the same soccer-ball icon.
-- This adds a per-lesson icon so each one shows its own.

alter table public.content add column if not exists icon text;

update public.content c
set icon = '🎾'
from public.content_translations t
where t.content_id = c.id and t.language = 'en' and t.title ilike '%tennis%';

update public.content c
set icon = '🏏'
from public.content_translations t
where t.content_id = c.id and t.language = 'en' and t.title ilike '%cricket%';

update public.content c
set icon = '⚽'
from public.content_translations t
where t.content_id = c.id and t.language = 'en' and t.title ilike '%football%';

update public.content c
set icon = '🏓'
from public.content_translations t
where t.content_id = c.id and t.language = 'en' and t.title ilike '%padel%';
