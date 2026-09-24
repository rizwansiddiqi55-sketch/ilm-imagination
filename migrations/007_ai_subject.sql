-- Run once in Supabase → SQL Editor. Safe to run again.
-- Adds an "Artificial Intelligence" subject and moves AI content that is
-- currently filed under Computer Science (e.g. the "Human or AI? Puzzle"
-- quiz) into it.

insert into public.subjects(slug,name,icon,sort_order,is_active)
values ('ai','Artificial Intelligence','🤖',7,true)
on conflict(slug) do update set
  name = excluded.name,
  icon = excluded.icon,
  is_active = true;

do $$
declare
  n int;
begin
  update public.content c
  set subject_id = (select id from public.subjects where slug = 'ai')
  where c.id in (
    select content_id from public.content_translations
    where language = 'en'
      and (
        title ilike 'Human or AI%'
        or title ilike '%artificial intelligence%'
        or title ilike '%machine learning%'
      )
  );
  get diagnostics n = row_count;
  raise notice 'Moved % item(s) into Artificial Intelligence', n;
end $$;
