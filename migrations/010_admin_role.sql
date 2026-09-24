-- Run once in Supabase → SQL Editor. Safe to run again.
--
-- STEP 1 (do this first, in the Supabase Dashboard, not here):
--   Authentication → Users → Add user
--   Enter the email you want to use as your admin login, set a password,
--   and check "Auto Confirm User" so it doesn't need an email click.
--   (If you already have an account from signing in with the magic link
--   before, you can instead open that user and use "Send password reset"
--   or set a password on it directly — you don't need a second account.)
--
-- STEP 2: replace 'YOUR_ADMIN_EMAIL_HERE' below with that same email,
-- then run this file.

alter table public.profiles add column if not exists is_admin boolean not null default false;

update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'YOUR_ADMIN_EMAIL_HERE');
