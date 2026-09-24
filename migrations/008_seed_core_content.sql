-- Run once in Supabase → SQL Editor. Safe to run again (every insert below
-- is "on conflict do nothing", so it can never duplicate or overwrite data).
--
-- This is the project's original seed.sql. If it was never run against your
-- live Supabase project, the site only ever had the content you added by
-- hand later (Sports, the AI quiz) — Stories, and most of Math/Biology/
-- Physics/Chemistry/Computer Science, would be empty. Running this adds the
-- one starter Story, Lesson or Activity each of those subjects was designed
-- to ship with.

insert into public.subjects(slug,name,icon,sort_order) values
('math','Mathematics','∑',1),('biology','Biology','🧬',2),('physics','Physics','⚡',3),
('chemistry','Chemistry','⚗️',4),('computer-science','Computer Science','💻',5)
on conflict(slug) do nothing;

insert into public.categories(slug,name_en,name_ur) values
('science','Science','سائنس'),('technology','Technology','ٹیکنالوجی'),
('problem-solving','Problem Solving','مسئلہ حل کرنا'),('experiments','Experiments','تجربات')
on conflict(slug) do nothing;

insert into public.tags(slug,name_en,name_ur) values
('beginner','Beginner','ابتدائی'),('stem','STEM','اسٹیم'),
('curiosity','Curiosity','تجسس'),('daily-challenge','Daily Challenge','روزانہ چیلنج')
on conflict(slug) do nothing;

with s as(select id from public.subjects where slug='math')
insert into public.content(slug,content_type,subject_id,difficulty,age_min,age_max,estimated_minutes,published,featured)
select 'math-patterns','lesson',id,'beginner',10,16,12,true,true from s on conflict(slug) do nothing;

insert into public.content_translations(content_id,language,title,summary,body)
select id,'en','The Secret of Number Patterns','Discover how numbers can hide repeating rules.',
'Look at sequences carefully. A pattern is a rule that tells us how one term changes into the next. Try finding the rule before checking the answer.'
from public.content where slug='math-patterns' on conflict(content_id,language) do nothing;
insert into public.content_translations(content_id,language,title,summary,body)
select id,'ur','اعداد کے نمونوں کا راز','دریافت کریں کہ اعداد میں دہرائے جانے والے اصول کیسے چھپے ہوتے ہیں۔',
'اعداد کی ترتیب کو غور سے دیکھیں۔ نمونہ ایک ایسا اصول ہے جو بتاتا ہے کہ ایک عدد سے اگلا عدد کیسے بنتا ہے۔ جواب دیکھنے سے پہلے خود اصول تلاش کرنے کی کوشش کریں۔'
from public.content where slug='math-patterns' on conflict(content_id,language) do nothing;

insert into public.lessons(content_id,learning_objectives,key_points)
select id,'["Identify a simple number pattern","Explain the rule","Create your own pattern"]',
'["Look for repeated changes","Test the rule","Create an example"]'
from public.content where slug='math-patterns' on conflict(content_id) do nothing;

with s as(select id from public.subjects where slug='biology')
insert into public.content(slug,content_type,subject_id,difficulty,age_min,age_max,estimated_minutes,published,featured)
select 'cell-city-adventure','story',id,'beginner',10,14,8,true,true from s on conflict(slug) do nothing;

insert into public.content_translations(content_id,language,title,summary,body)
select id,'en','The Cell City Adventure','Imagine a tiny city inside every living thing.',
'Inside a cell are structures that work together like parts of a busy city. The cell membrane controls what enters and leaves, while the nucleus stores important instructions.'
from public.content where slug='cell-city-adventure' on conflict(content_id,language) do nothing;
insert into public.content_translations(content_id,language,title,summary,body)
select id,'ur','خلیے کے شہر کی مہم','تصور کریں کہ ہر جاندار کے اندر ایک ننھا سا شہر موجود ہے۔',
'خلیے کے اندر مختلف حصے ایک مصروف شہر کی طرح مل کر کام کرتے ہیں۔ خلیے کی جھلی اس بات کو کنٹرول کرتی ہے کہ کیا اندر آئے اور کیا باہر جائے، جبکہ نیوکلیئس اہم ہدایات محفوظ رکھتا ہے۔'
from public.content where slug='cell-city-adventure' on conflict(content_id,language) do nothing;

with s as(select id from public.subjects where slug='physics')
insert into public.content(slug,content_type,subject_id,difficulty,age_min,age_max,estimated_minutes,published,featured)
select 'paper-airplane-lab','activity',id,'beginner',10,16,15,true,false from s on conflict(slug) do nothing;

insert into public.content_translations(content_id,language,title,summary,body)
select id,'en','Paper Airplane Flight Lab','Change one feature of a paper airplane and observe what happens.',
'Make two paper airplanes. Change only one feature, such as wing width. Fly both from the same starting point and compare the distance.'
from public.content where slug='paper-airplane-lab' on conflict(content_id,language) do nothing;
insert into public.content_translations(content_id,language,title,summary,body)
select id,'ur','کاغذی ہوائی جہاز کا تجربہ','کاغذی ہوائی جہاز کی ایک خصوصیت بدلیں اور نتیجہ دیکھیں۔',
'دو کاغذی ہوائی جہاز بنائیں۔ صرف ایک خصوصیت تبدیل کریں، مثلاً پروں کی چوڑائی۔ دونوں کو ایک ہی جگہ سے اڑائیں اور فاصلہ نوٹ کریں۔'
from public.content where slug='paper-airplane-lab' on conflict(content_id,language) do nothing;

insert into public.activities(content_id,instructions,materials,safety_notes)
select id,'["Build two similar paper airplanes","Change one feature","Fly from the same point","Compare distances"]',
'["Two sheets of paper","Measuring tape"]','["Use an open area","Do not throw toward people"]'
from public.content where slug='paper-airplane-lab' on conflict(content_id) do nothing;

with s as(select id from public.subjects where slug='chemistry')
insert into public.content(slug,content_type,subject_id,difficulty,age_min,age_max,estimated_minutes,published,featured)
select 'atoms-building-blocks','lesson',id,'beginner',10,16,10,true,false from s on conflict(slug) do nothing;

insert into public.content_translations(content_id,language,title,summary,body)
select id,'en','Atoms: The Building Blocks','Learn why atoms are central to chemistry.',
'Everything around us is made from matter. Atoms are tiny building blocks of matter. Different types of atoms are called elements, and atoms can join to form molecules.'
from public.content where slug='atoms-building-blocks' on conflict(content_id,language) do nothing;
insert into public.content_translations(content_id,language,title,summary,body)
select id,'ur','ایٹم: مادے کے بنیادی ذرات','جانیں کہ کیمسٹری میں ایٹم کیوں بنیادی حیثیت رکھتے ہیں۔',
'ہمارے اردگرد موجود ہر چیز مادے سے بنی ہے۔ ایٹم مادے کے نہایت چھوٹے بنیادی ذرات ہیں۔ ایٹم کی مختلف اقسام کو عناصر کہتے ہیں اور ایٹم مل کر سالمات بنا سکتے ہیں۔'
from public.content where slug='atoms-building-blocks' on conflict(content_id,language) do nothing;

with s as(select id from public.subjects where slug='computer-science')
insert into public.content(slug,content_type,subject_id,difficulty,age_min,age_max,estimated_minutes,published,featured)
select 'algorithms-everywhere','lesson',id,'beginner',10,16,12,true,true from s on conflict(slug) do nothing;

insert into public.content_translations(content_id,language,title,summary,body)
select id,'en','Algorithms Are Everywhere','An algorithm is a step-by-step method for solving a problem.',
'Recipes, game rules, and computer programs can all be understood as instructions. A good algorithm is clear, ordered, and designed to reach a goal.'
from public.content where slug='algorithms-everywhere' on conflict(content_id,language) do nothing;
insert into public.content_translations(content_id,language,title,summary,body)
select id,'ur','الگورتھم ہر جگہ موجود ہیں','الگورتھم کسی مسئلے کو حل کرنے کا مرحلہ وار طریقہ ہے۔',
'ترکیب، کھیل کے اصول اور کمپیوٹر پروگرام سب ہدایات کے طور پر سمجھے جا سکتے ہیں۔ ایک اچھا الگورتھم واضح، ترتیب وار اور کسی مقصد تک پہنچنے کے لیے بنایا جاتا ہے۔'
from public.content where slug='algorithms-everywhere' on conflict(content_id,language) do nothing;

insert into public.badges(slug,name_en,name_ur,description_en,description_ur,icon,requirement) values
('first-lesson','First Lesson','پہلا سبق','Complete your first lesson','اپنا پہلا سبق مکمل کریں','🎓','{"type":"lessons_completed","value":1}'),
('quiz-starter','Quiz Starter','کوئز اسٹارٹر','Complete your first quiz','اپنا پہلا کوئز مکمل کریں','🧠','{"type":"quizzes_completed","value":1}'),
('curious-mind','Curious Mind','جستجو کرنے والا ذہن','Earn 100 XP','100 XP حاصل کریں','💡','{"type":"xp","value":100}')
on conflict(slug) do nothing;

insert into public.daily_challenges(challenge_date,title_en,title_ur,description_en,description_ur,xp_reward)
values(current_date,'Pattern Detective','نمونہ جاسوس',
'Find one number pattern in everyday life and explain its rule.',
'روزمرہ زندگی میں اعداد کا ایک نمونہ تلاش کریں اور اس کا اصول بیان کریں۔',20)
on conflict(challenge_date) do nothing;
