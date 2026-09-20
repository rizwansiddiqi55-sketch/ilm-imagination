-- Run once in Supabase → SQL Editor. Safe to run again (it updates in place).
-- Adds the quiz record and 6 bilingual questions for "Human or AI? Puzzle".
do $$
declare
  v_content uuid;
  v_quiz uuid;
  v_q uuid;
  q jsonb;
  a jsonb;
  qi int := 0;
  ai int;
  qs jsonb := $json$[
    {
      "en": "Your music app builds a playlist from songs you replayed a lot this week. Who (or what) made that choice?",
      "ur": "آپ کی میوزک ایپ نے اس ہفتے بار بار سنے گئے گانوں سے ایک پلے لسٹ بنائی۔ یہ انتخاب کس نے کیا؟",
      "exp_en": "The app looked for a pattern in what you played. That is an AI system spotting a pattern.",
      "exp_ur": "ایپ نے آپ کے سنے ہوئے گانوں میں ایک نمونہ تلاش کیا۔ یہ ایک اے آئی نظام کا کام ہے۔",
      "correct": "ai"
    },
    {
      "en": "A teacher gives the class ten extra minutes because everyone looks tired. Who made that choice?",
      "ur": "استاد نے کلاس کو دس منٹ اضافی دیے کیونکہ سب تھکے ہوئے لگ رہے تھے۔ یہ فیصلہ کس نے کیا؟",
      "exp_en": "The teacher noticed how people felt and decided. That is a person's direct decision.",
      "exp_ur": "استاد نے لوگوں کی کیفیت دیکھی اور خود فیصلہ کیا۔ یہ ایک انسان کا براہِ راست فیصلہ ہے۔",
      "correct": "human"
    },
    {
      "en": "A message that says \"You won a free phone!\" lands in your spam folder without you doing anything. Who made that choice?",
      "ur": "\"آپ نے مفت فون جیت لیا!\" والا پیغام آپ کے کچھ کیے بغیر سپیم فولڈر میں چلا گیا۔ یہ فیصلہ کس نے کیا؟",
      "exp_en": "Spam filters learn from millions of past messages to spot suspicious patterns. That is AI.",
      "exp_ur": "سپیم فلٹر لاکھوں پرانے پیغامات سے سیکھ کر مشکوک نمونے پہچانتا ہے۔ یہ اے آئی ہے۔",
      "correct": "ai"
    },
    {
      "en": "A friend picks a comedy for movie night because they know you love to laugh. Who made that choice?",
      "ur": "ایک دوست نے فلم نائٹ کے لیے کامیڈی چنی کیونکہ اسے معلوم ہے کہ آپ کو ہنسنا پسند ہے۔ یہ انتخاب کس نے کیا؟",
      "exp_en": "Your friend used what they know about you and chose. That is a person's decision.",
      "exp_ur": "آپ کے دوست نے آپ کے بارے میں اپنی معلومات استعمال کر کے خود چنا۔ یہ انسان کا فیصلہ ہے۔",
      "correct": "human"
    },
    {
      "en": "A map app suggests a different road because it detected heavy traffic ahead. Who (or what) made that choice?",
      "ur": "نقشے کی ایپ نے آگے بھاری ٹریفک دیکھ کر دوسرا راستہ تجویز کیا۔ یہ انتخاب کس نے کیا؟",
      "exp_en": "The app compared live data from many phones to spot a pattern of slow traffic. That is AI.",
      "exp_ur": "ایپ نے بہت سے فونز کے براہِ راست ڈیٹا کا موازنہ کر کے سست ٹریفک کا نمونہ پہچانا۔ یہ اے آئی ہے۔",
      "correct": "ai"
    },
    {
      "en": "A shopkeeper puts a \"Half Price\" sign on bread that expires tomorrow. Who made that choice?",
      "ur": "ایک دکاندار نے کل ختم ہونے والی ڈبل روٹی پر \"آدھی قیمت\" کا نشان لگا دیا۔ یہ فیصلہ کس نے کیا؟",
      "exp_en": "The shopkeeper decided this on their own. That is a person's direct decision.",
      "exp_ur": "دکاندار نے یہ فیصلہ خود کیا۔ یہ ایک انسان کا براہِ راست فیصلہ ہے۔",
      "correct": "human"
    }
  ]$json$::jsonb;
begin
  select c.id into v_content
  from public.content c
  join public.content_translations t on t.content_id = c.id and t.language = 'en'
  where t.title = 'Human or AI? Puzzle' and c.content_type = 'quiz'
  limit 1;

  if v_content is null then
    raise exception 'Could not find a quiz titled "Human or AI? Puzzle". Check the title in content_translations.';
  end if;

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
    for a in select * from jsonb_array_elements(jsonb_build_array(
      jsonb_build_object('en', 'A person''s direct decision', 'ur', 'انسان کا براہِ راست فیصلہ', 'key', 'human'),
      jsonb_build_object('en', 'An AI system spotting a pattern', 'ur', 'اے آئی نظام کا نمونہ پہچاننا', 'key', 'ai')
    )) loop
      ai := ai + 1;
      insert into public.quiz_answers(question_id, answer_order, answer_en, answer_ur, is_correct)
      values (v_q, ai, a->>'en', a->>'ur', (a->>'key') = (q->>'correct'))
      on conflict (question_id, answer_order) do update set
        answer_en = excluded.answer_en, answer_ur = excluded.answer_ur, is_correct = excluded.is_correct;
    end loop;
  end loop;
end $$;
