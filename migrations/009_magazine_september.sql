-- Run once in Supabase → SQL Editor. Safe to run again.
-- The Magazine page was a hardcoded mockup — "September 2026", "October
-- 2026" and "November 2026" cards with a "Read online" button that did not
-- link anywhere, and nothing in it ever came from magazine_issues /
-- magazine_articles. This adds bilingual title/summary columns to
-- magazine_issues, publishes a real September 2026 issue, and fills it with
-- your current published content (up to 8 items, most-featured first).

alter table public.magazine_issues add column if not exists title_en text;
alter table public.magazine_issues add column if not exists title_ur text;
alter table public.magazine_issues add column if not exists summary_en text;
alter table public.magazine_issues add column if not exists summary_ur text;

insert into public.magazine_issues(issue_number,slug,published_date,published,title_en,title_ur,summary_en,summary_ur)
values (
  1,'september-2026','2026-09-01',true,
  'September 2026','ستمبر 2026',
  'A monthly mix of science, maths, technology, puzzles, stories and amazing facts.',
  'سائنس، ریاضی، ٹیکنالوجی، پہیلیاں، کہانیاں اور حیرت انگیز حقائق کا ماہانہ مجموعہ۔'
)
on conflict (slug) do update set
  published = true,
  title_en = excluded.title_en,
  title_ur = excluded.title_ur,
  summary_en = excluded.summary_en,
  summary_ur = excluded.summary_ur;

do $$
declare
  v_issue uuid;
  n int;
begin
  select id into v_issue from public.magazine_issues where slug = 'september-2026';

  with ranked as (
    select id, row_number() over (order by featured desc, created_at asc) as rn
    from public.content
    where published = true
  )
  insert into public.magazine_articles(issue_id, content_id, article_order)
  select v_issue, id, rn
  from ranked
  where rn <= 8
  on conflict (issue_id, article_order) do update set content_id = excluded.content_id;

  get diagnostics n = row_count;
  raise notice 'Linked % article(s) into the September 2026 issue', n;
end $$;
