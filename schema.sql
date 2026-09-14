create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age_group text check (age_group in ('10-12','13-16','adult')),
  preferred_language text not null default 'en' check (preferred_language in ('en','ur')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  content_type text not null check (content_type in ('story','lesson','activity','experiment','quiz','challenge','article')),
  subject_id uuid references public.subjects(id) on delete set null,
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  age_min integer default 10,
  age_max integer default 16,
  estimated_minutes integer,
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content(id) on delete cascade,
  language text not null check (language in ('en','ur')),
  title text not null,
  summary text,
  body text,
  seo_title text,
  seo_description text,
  unique(content_id, language)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  content_id uuid unique not null references public.content(id) on delete cascade,
  learning_objectives jsonb not null default '[]',
  key_points jsonb not null default '[]',
  order_index integer not null default 0
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  content_id uuid unique not null references public.content(id) on delete cascade,
  instructions jsonb not null default '[]',
  materials jsonb not null default '[]',
  safety_notes jsonb not null default '[]'
);

create table if not exists public.experiments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid unique not null references public.content(id) on delete cascade,
  materials jsonb not null default '[]',
  steps jsonb not null default '[]',
  safety_notes jsonb not null default '[]',
  observation_questions jsonb not null default '[]'
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  content_id uuid unique not null references public.content(id) on delete cascade,
  passing_score integer not null default 70 check (passing_score between 0 and 100)
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_order integer not null default 0,
  question_en text not null,
  question_ur text,
  explanation_en text,
  explanation_ur text,
  unique(quiz_id, question_order)
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  answer_order integer not null default 0,
  answer_en text not null,
  answer_ur text,
  is_correct boolean not null default false,
  unique(question_id, answer_order)
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id uuid not null references public.content(id) on delete cascade,
  status text not null default 'started' check (status in ('started','completed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  last_position integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, content_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  correct_answers integer not null default 0,
  total_questions integer not null default 0,
  answers jsonb not null default '{}',
  completed_at timestamptz not null default now()
);

create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ur text,
  description_en text,
  description_ur text,
  icon text,
  requirement jsonb not null default '{}'
);

create table if not exists public.user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key(user_id, badge_id)
);

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id uuid not null references public.content(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, content_id)
);

create table if not exists public.daily_challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_date date unique not null,
  content_id uuid references public.content(id) on delete set null,
  title_en text not null,
  title_ur text,
  description_en text,
  description_ur text,
  xp_reward integer not null default 20
);

create table if not exists public.daily_challenge_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.daily_challenges(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key(user_id, challenge_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ur text
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ur text
);

create table if not exists public.content_categories (
  content_id uuid references public.content(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key(content_id, category_id)
);

create table if not exists public.content_tags (
  content_id uuid references public.content(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key(content_id, tag_id)
);

create table if not exists public.magazine_issues (
  id uuid primary key default gen_random_uuid(),
  issue_number integer unique not null,
  slug text unique not null,
  cover_image_url text,
  published_date date,
  published boolean not null default false
);

create table if not exists public.magazine_articles (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.magazine_issues(id) on delete cascade,
  content_id uuid references public.content(id) on delete set null,
  article_order integer not null default 0,
  unique(issue_id, article_order)
);

create index if not exists idx_content_subject on public.content(subject_id);
create index if not exists idx_content_type on public.content(content_type);
create index if not exists idx_content_published on public.content(published);
create index if not exists idx_translation_content on public.content_translations(content_id);
create index if not exists idx_progress_user on public.learning_progress(user_id);
create index if not exists idx_attempts_user on public.quiz_attempts(user_id);
create index if not exists idx_xp_user on public.xp_transactions(user_id);

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.content enable row level security;
alter table public.content_translations enable row level security;
alter table public.lessons enable row level security;
alter table public.activities enable row level security;
alter table public.experiments enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.learning_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.learning_streaks enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.bookmarks enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.daily_challenge_completions enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.content_categories enable row level security;
alter table public.content_tags enable row level security;
alter table public.magazine_issues enable row level security;
alter table public.magazine_articles enable row level security;

create policy "public subjects" on public.subjects for select using (is_active=true);
create policy "public content" on public.content for select using (published=true);
create policy "public translations" on public.content_translations for select using (
  exists(select 1 from public.content c where c.id=content_id and c.published=true)
);
create policy "public lessons" on public.lessons for select using (
  exists(select 1 from public.content c where c.id=content_id and c.published=true)
);
create policy "public activities" on public.activities for select using (
  exists(select 1 from public.content c where c.id=content_id and c.published=true)
);
create policy "public experiments" on public.experiments for select using (
  exists(select 1 from public.content c where c.id=content_id and c.published=true)
);
create policy "public quizzes" on public.quizzes for select using (
  exists(select 1 from public.content c where c.id=content_id and c.published=true)
);
create policy "public quiz questions" on public.quiz_questions for select using (
  exists(select 1 from public.quizzes q join public.content c on c.id=q.content_id where q.id=quiz_id and c.published=true)
);
create policy "public quiz answers" on public.quiz_answers for select using (
  exists(select 1 from public.quiz_questions qq join public.quizzes q on q.id=qq.quiz_id join public.content c on c.id=q.content_id where qq.id=question_id and c.published=true)
);
create policy "public badges" on public.badges for select using (true);
create policy "public categories" on public.categories for select using (true);
create policy "public tags" on public.tags for select using (true);
create policy "public challenges" on public.daily_challenges for select using (true);
create policy "public magazine" on public.magazine_issues for select using (published=true);
create policy "public magazine articles" on public.magazine_articles for select using (
  exists(select 1 from public.magazine_issues i where i.id=issue_id and i.published=true)
);

create policy "own profile read" on public.profiles for select using (auth.uid()=id);
create policy "own profile update" on public.profiles for update using (auth.uid()=id);
create policy "own progress" on public.learning_progress for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own attempts" on public.quiz_attempts for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own xp read" on public.xp_transactions for select using (auth.uid()=user_id);
create policy "own streak" on public.learning_streaks for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own badges" on public.user_badges for select using (auth.uid()=user_id);
create policy "own bookmarks" on public.bookmarks for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own challenge completion" on public.daily_challenge_completions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,display_name)
  values(new.id,coalesce(new.raw_user_meta_data->>'display_name',new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
