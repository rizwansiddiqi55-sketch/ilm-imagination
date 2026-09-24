-- Run once in Supabase → SQL Editor. Safe to run again.
-- 1) Create the Sports subject
insert into public.subjects(slug, name, icon, sort_order, is_active)
values ('sports', 'Sports', '⚽', 6, true)
on conflict (slug) do update set name = excluded.name, icon = excluded.icon, is_active = true;

-- 2) Move the sports lessons out of "no subject / other subject" into Sports
do $$
declare n int;
begin
  update public.content c
  set subject_id = (select id from public.subjects where slug = 'sports')
  where c.id in (
    select t.content_id
    from public.content_translations t
    where t.language = 'en'
      and (t.title ilike '%padel%' or t.title ilike '%cricket%' or t.title ilike '%football%')
  );
  get diagnostics n = row_count;
  raise notice 'Moved % item(s) into Sports', n;
end $$;
