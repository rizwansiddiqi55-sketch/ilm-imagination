-- Run once in Supabase → SQL Editor.
-- 1) Optional richer challenge content (the page falls back to built-in content if these are empty)
alter table public.daily_challenges
  add column if not exists steps_en text[],
  add column if not exists steps_ur text[],
  add column if not exists hint_en text,
  add column if not exists hint_ur text,
  add column if not exists example_en text,
  add column if not exists example_ur text;

-- 2) Safe "complete challenge" function: records the completion and awards XP exactly once.
--    (Clients cannot insert into xp_transactions directly, so XP can't be faked.)
create or replace function public.complete_daily_challenge(p_challenge_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_xp integer;
  v_rows integer;
begin
  if v_user is null then
    raise exception 'not signed in';
  end if;

  select xp_reward into v_xp from public.daily_challenges where id = p_challenge_id;
  if v_xp is null then
    raise exception 'challenge not found';
  end if;

  insert into public.daily_challenge_completions(user_id, challenge_id)
  values (v_user, p_challenge_id)
  on conflict do nothing;
  get diagnostics v_rows = row_count;

  if v_rows = 1 then
    insert into public.xp_transactions(user_id, amount, reason, reference_type, reference_id)
    values (v_user, v_xp, 'Daily challenge completed', 'daily_challenge', p_challenge_id);
    return v_xp;
  end if;

  return 0; -- already completed earlier, no duplicate XP
end;
$$;

revoke all on function public.complete_daily_challenge(uuid) from public, anon;
grant execute on function public.complete_daily_challenge(uuid) to authenticated;
