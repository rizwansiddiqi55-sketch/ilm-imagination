-- Run once in Supabase → SQL Editor (after 004_sports_subject.sql and 005_tennis_lesson.sql). Safe to run again.
-- Adds a new "Tennis Quiz: Rules and Scoring" quiz under Sports, with 6 bilingual multiple-choice questions
-- based on migrations/005_tennis_lesson.sql, so it appears automatically on /quizzes.

-- If a previous "impersonate a user" / "run as" session is still active in this SQL Editor tab
-- (e.g. left over from testing the admin RLS policy), it makes every insert here fail with
-- "new row violates row-level security policy" because content/subjects only have a public
-- SELECT policy. This line clears that impersonation back to the SQL Editor's real (privileged)
-- role before anything else runs, so the migration works regardless of that leftover UI state.
reset role;

do $$
declare
  v_subject uuid;
  v_content uuid;
  v_quiz uuid;
  v_q uuid;
  q jsonb;
  a jsonb;
  qi int := 0;
  ai int;
  qs jsonb := $json$[
    {
      "en": "What is it called when a server misses both their first and second serve attempts?",
      "ur": "جب سرور اپنی پہلی اور دوسری دونوں سروس چوک جائے تو اسے کیا کہتے ہیں؟",
      "exp_en": "Missing both serves is a double fault, and the point goes straight to the opponent.",
      "exp_ur": "دونوں سروسز چوک جانا ڈبل فالٹ کہلاتا ہے، اور پوائنٹ سیدھا مخالف کھلاڑی کو مل جاتا ہے۔",
      "answers": [
        {"en": "Let", "ur": "لیٹ", "correct": false},
        {"en": "Ace", "ur": "ایس", "correct": false},
        {"en": "Double fault", "ur": "ڈبل فالٹ", "correct": true},
        {"en": "Deuce", "ur": "ڈیوس", "correct": false}
      ]
    },
    {
      "en": "In tennis scoring, what is it called when both players have 40 points in a game?",
      "ur": "ٹینس اسکورنگ میں، جب دونوں کھلاڑیوں کے 40 پوائنٹس ہو جائیں تو اسے کیا کہتے ہیں؟",
      "exp_en": "That score is called deuce, and a player must then win two points in a row to take the game.",
      "exp_ur": "اس اسکور کو ڈیوس کہتے ہیں، اور گیم جیتنے کے لیے کھلاڑی کو لگاتار دو پوائنٹس جیتنے ہوتے ہیں۔",
      "answers": [
        {"en": "Match point", "ur": "میچ پوائنٹ", "correct": false},
        {"en": "Tiebreak", "ur": "ٹائی بریک", "correct": false},
        {"en": "Deuce", "ur": "ڈیوس", "correct": true},
        {"en": "Love", "ur": "لَو", "correct": false}
      ]
    },
    {
      "en": "How many games must a player usually win to take a set (with at least a two-game lead)?",
      "ur": "ایک سیٹ جیتنے کے لیے کھلاڑی کو عام طور پر کتنے گیمز جیتنے ہوتے ہیں (کم از کم دو گیمز کی برتری کے ساتھ)؟",
      "exp_en": "The first player to win six games, with a lead of at least two games, wins the set.",
      "exp_ur": "جو کھلاڑی پہلے چھ گیمز جیتے، اور کم از کم دو گیمز کی برتری رکھے، وہ سیٹ جیت جاتا ہے۔",
      "answers": [
        {"en": "Four", "ur": "چار", "correct": false},
        {"en": "Five", "ur": "پانچ", "correct": false},
        {"en": "Six", "ur": "چھ", "correct": true},
        {"en": "Seven", "ur": "سات", "correct": false}
      ]
    },
    {
      "en": "At six games each in a set, how is the set usually decided?",
      "ur": "سیٹ میں چھ چھ گیمز برابر ہونے پر سیٹ کا فیصلہ عام طور پر کیسے ہوتا ہے؟",
      "exp_en": "Most sets are then decided by a tiebreak, played first to seven points and won by two.",
      "exp_ur": "زیادہ تر سیٹس کا فیصلہ تب ٹائی بریک سے ہوتا ہے، جو سات پوائنٹس تک اور دو پوائنٹس کی برتری سے جیتا جاتا ہے۔",
      "answers": [
        {"en": "The set simply ends in a draw", "ur": "سیٹ برابر ہی ختم ہو جاتا ہے", "correct": false},
        {"en": "A tiebreak, played first to seven points won by two", "ur": "ایک ٹائی بریک، جو سات پوائنٹس تک اور دو کی برتری سے جیتا جائے", "correct": true},
        {"en": "Whoever served first automatically wins", "ur": "جس نے پہلے سروس کی وہ خود بخود جیت جاتا ہے", "correct": false},
        {"en": "The whole match restarts", "ur": "پورا میچ دوبارہ شروع ہوتا ہے", "correct": false}
      ]
    },
    {
      "en": "Which of these is NOT one of the four biggest Grand Slam tennis tournaments?",
      "ur": "ان میں سے کون سا ٹینس کا سب سے بڑا گرینڈ سلیم ٹورنامنٹ نہیں ہے؟",
      "exp_en": "The four Grand Slams are the Australian Open, the French Open, Wimbledon and the US Open. Dubai hosts its own professional championship, but it is not one of the four Grand Slams.",
      "exp_ur": "چار گرینڈ سلیم آسٹریلین اوپن، فرنچ اوپن، وِمبلڈن اور یو ایس اوپن ہیں۔ دبئی اپنی الگ پروفیشنل چیمپیئن شپ کی میزبانی کرتا ہے، لیکن یہ چار گرینڈ سلیمز میں شامل نہیں۔",
      "answers": [
        {"en": "Wimbledon", "ur": "وِمبلڈن", "correct": false},
        {"en": "US Open", "ur": "یو ایس اوپن", "correct": false},
        {"en": "Dubai Championship", "ur": "دبئی چیمپیئن شپ", "correct": true},
        {"en": "French Open", "ur": "فرنچ اوپن", "correct": false}
      ]
    },
    {
      "en": "How many times may the ball bounce on your side of the court before you must hit it back?",
      "ur": "گیند واپس مارنے سے پہلے آپ کی طرف زیادہ سے زیادہ کتنی بار اچھل سکتی ہے؟",
      "exp_en": "The ball may bounce once on your side before you hit it, but no more than once.",
      "exp_ur": "گیند آپ کی طرف مارنے سے پہلے صرف ایک بار اچھل سکتی ہے، اس سے زیادہ نہیں۔",
      "answers": [
        {"en": "Zero — it must be hit before it bounces", "ur": "صفر — اچھلنے سے پہلے ہی مارنا ضروری ہے", "correct": false},
        {"en": "Once", "ur": "ایک بار", "correct": true},
        {"en": "Twice", "ur": "دو بار", "correct": false},
        {"en": "Three times", "ur": "تین بار", "correct": false}
      ]
    }
  ]$json$::jsonb;
begin
  select id into v_subject from public.subjects where slug = 'sports';
  if v_subject is null then
    raise exception 'The Sports subject does not exist yet. Run 004_sports_subject.sql first.';
  end if;

  insert into public.content(slug, content_type, subject_id, icon, difficulty, age_min, age_max, estimated_minutes, published, featured)
  values ('tennis-quiz', 'quiz', v_subject, '🎾', 'beginner', 10, 16, 8, true, false)
  on conflict (slug) do update set subject_id = excluded.subject_id, icon = excluded.icon, published = true
  returning id into v_content;

  insert into public.content_translations(content_id, language, title, summary) values
  (v_content, 'en', 'Tennis Quiz: Rules and Scoring', 'Test what you know about the court, scoring, serve rules and the Grand Slams.'),
  (v_content, 'ur', 'ٹینس کوئز: قواعد اور اسکورنگ', 'کورٹ، اسکورنگ، سروس کے قواعد اور گرینڈ سلیمز کے بارے میں اپنی معلومات آزمائیں۔')
  on conflict (content_id, language) do update set
    title = excluded.title, summary = excluded.summary;

  insert into public.quizzes(content_id, passing_score)
  values (v_content, 60)
  on conflict (content_id) do update set passing_score = excluded.passing_score
  returning id into v_quiz;

  for q in select * from jsonb_array_elements(qs) loop
    qi := qi + 1;
    insert into public.quiz_questions(quiz_id, question_order, question_en, question_ur, explanation_en, explanation_ur)
    values (v_quiz, qi, q->>'en', q->>'ur', q->>'exp_en', q->>'exp_ur')
    on conflict (quiz_id, question_order) do update set
      question_en = excluded.question_en, question_ur = excluded.question_ur,
      explanation_en = excluded.explanation_en, explanation_ur = excluded.explanation_ur
    returning id into v_q;

    ai := 0;
    for a in select * from jsonb_array_elements(q->'answers') loop
      ai := ai + 1;
      insert into public.quiz_answers(question_id, answer_order, answer_en, answer_ur, is_correct)
      values (v_q, ai, a->>'en', a->>'ur', (a->>'correct')::boolean)
      on conflict (question_id, answer_order) do update set
        answer_en = excluded.answer_en, answer_ur = excluded.answer_ur, is_correct = excluded.is_correct;
    end loop;
  end loop;
end $$;
