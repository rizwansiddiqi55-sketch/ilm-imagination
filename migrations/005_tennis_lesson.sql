-- Run once in Supabase → SQL Editor (after 004_sports_subject.sql). Safe to run again.
-- Adds "Tennis Basics: Rules and How to Play" to the Sports subject, in English and Urdu.
do $$
declare
  v_subject uuid;
  v_content uuid;
begin
  select id into v_subject from public.subjects where slug = 'sports';
  if v_subject is null then
    raise exception 'The Sports subject does not exist yet. Run 004_sports_subject.sql first.';
  end if;

  insert into public.content(slug, content_type, subject_id, difficulty, age_min, age_max, estimated_minutes, published, featured)
  values ('tennis-basics', 'lesson', v_subject, 'beginner', 10, 16, 10, true, false)
  on conflict (slug) do update set subject_id = excluded.subject_id, published = true
  returning id into v_content;

  insert into public.content_translations(content_id, language, title, summary, body) values
  (v_content, 'en',
   'Tennis Basics: Rules and How to Play',
   'Two players, one net and a fast-bouncing ball: learn the court, scoring and serve of one of the world''s most popular racket sports.',
   $en$Tennis is played by two players (singles) or two teams of two (doubles), who hit a felt-covered ball over a net with a racket. The goal is simple: hit the ball into your opponent's half of the court so that they cannot return it.

The court
A tennis court is 23.77 metres long. For singles it is 8.23 metres wide, and for doubles it is 10.97 metres wide. The net is about 91 centimetres high in the middle. Courts come in three main surfaces: grass, clay and hard court, and the ball bounces differently on each one.

How a point works
Every point starts with a serve. The server stands behind the baseline and hits the ball diagonally into the opponent's service box. If the first serve misses, the server gets a second try. Missing both is called a double fault, and the opponent wins the point. After the serve, the players take turns hitting the ball. The ball may bounce once on your side before you hit it, but no more than once. You win the point if your opponent hits the ball into the net, hits it out of the court, or lets it bounce twice. A ball that touches the line counts as in. The server changes after every game.

Scoring
Points in a game are called 15, 30 and 40, and the fourth point wins the game. If both players reach 40, the score is called deuce, and a player must then win two points in a row to take the game. Games add up to a set: the first player to win six games, with a lead of at least two games, wins the set. At six games each, most sets are decided by a tiebreak, played first to seven points and won by two. A match is usually the best of three sets, and the biggest men's tournaments use the best of five.

The four biggest tournaments are the Australian Open, the French Open, Wimbledon and the US Open. Dubai also hosts a professional tennis championship every year.$en$),
  (v_content, 'ur',
   'ٹینس کی بنیادی باتیں: قواعد اور کھیلنے کا طریقہ',
   'دو کھلاڑی، ایک جال اور تیزی سے اچھلتی گیند: دنیا کے مقبول ترین ریکٹ کھیلوں میں سے ایک کا کورٹ، اسکورنگ اور سروس سیکھیں۔',
   $ur$ٹینس دو کھلاڑی (سنگلز) یا دو دو کھلاڑیوں کی دو ٹیمیں (ڈبلز) کھیلتی ہیں، جو ریکٹ سے اونی کپڑے والی گیند کو جال کے اوپر سے مارتے ہیں۔ مقصد سادہ ہے: گیند کو مخالف کے حصے میں اس طرح مارنا کہ وہ اسے واپس نہ کر سکے۔

کورٹ
ٹینس کورٹ 23.77 میٹر لمبا ہوتا ہے۔ سنگلز کے لیے اس کی چوڑائی 8.23 میٹر اور ڈبلز کے لیے 10.97 میٹر ہوتی ہے۔ جال بیچ میں تقریباً 91 سینٹی میٹر اونچا ہوتا ہے۔ کورٹ کی تین اہم سطحیں ہیں: گھاس، مٹی اور سخت سطح، اور ہر سطح پر گیند مختلف انداز میں اچھلتی ہے۔

پوائنٹ کیسے بنتا ہے
ہر پوائنٹ سروس سے شروع ہوتا ہے۔ سروس کرنے والا کھلاڑی بیس لائن کے پیچھے کھڑا ہو کر گیند کو ترچھے رخ پر مخالف کے سروس باکس میں مارتا ہے۔ اگر پہلی سروس غلط جائے تو دوسرا موقع ملتا ہے۔ دونوں غلط ہوں تو اسے ڈبل فالٹ کہتے ہیں اور پوائنٹ مخالف کو مل جاتا ہے۔ سروس کے بعد کھلاڑی باری باری گیند مارتے ہیں۔ گیند آپ کے مارنے سے پہلے آپ کی طرف صرف ایک بار اچھل سکتی ہے، اس سے زیادہ نہیں۔ اگر مخالف گیند جال میں مارے، کورٹ سے باہر مارے یا گیند اس کی طرف دو بار اچھل جائے تو آپ پوائنٹ جیت لیتے ہیں۔ جو گیند لائن کو چھو جائے وہ اندر مانی جاتی ہے۔ ہر گیم کے بعد سروس کرنے والا بدل جاتا ہے۔

اسکورنگ
ایک گیم میں پوائنٹس کو 15، 30 اور 40 کہا جاتا ہے، اور چوتھا پوائنٹ گیم جتوا دیتا ہے۔ اگر دونوں کھلاڑی 40 پر پہنچ جائیں تو اسے ڈیوس کہتے ہیں، اور گیم جیتنے کے لیے مسلسل دو پوائنٹس جیتنا ہوتے ہیں۔ کئی گیمز مل کر ایک سیٹ بنتے ہیں: جو کھلاڑی کم از کم دو گیمز کی برتری کے ساتھ پہلے چھ گیمز جیتے وہ سیٹ جیت جاتا ہے۔ چھ چھ گیمز برابر ہونے پر عموماً ٹائی بریک کھیلا جاتا ہے، جس میں پہلے سات پوائنٹس جیتنے والا، دو پوائنٹس کی برتری کے ساتھ، جیت جاتا ہے۔ میچ عموماً تین میں سے بہترین سیٹوں کا ہوتا ہے، اور مردوں کے سب سے بڑے ٹورنامنٹس میں پانچ میں سے بہترین سیٹ کھیلے جاتے ہیں۔

چار سب سے بڑے ٹورنامنٹ آسٹریلین اوپن، فرنچ اوپن، ومبلڈن اور یو ایس اوپن ہیں۔ دبئی میں بھی ہر سال ایک پیشہ ورانہ ٹینس چیمپئن شپ ہوتی ہے۔$ur$)
  on conflict (content_id, language) do update set
    title = excluded.title, summary = excluded.summary, body = excluded.body;

  insert into public.lessons(content_id, learning_objectives, key_points)
  values (v_content,
    '["Describe the tennis court, net and equipment","Explain how a serve and a rally work","Score a game, a set and a match"]'::jsonb,
    '["Every point starts with a serve into the diagonal service box","Scores go 15, 30, 40, then game; deuce needs two clear points","A set is won at six games with a two-game lead (tiebreak at 6-6)","The ball may bounce only once, and a ball touching the line is in"]'::jsonb)
  on conflict (content_id) do update set
    learning_objectives = excluded.learning_objectives, key_points = excluded.key_points;
end $$;
