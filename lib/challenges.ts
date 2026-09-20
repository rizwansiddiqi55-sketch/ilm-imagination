// Built-in daily challenge content.
// Used to (a) enrich a challenge row that only has a title/description, and
// (b) keep the Daily Challenge page from ever being empty when no row is published.
// A row in `daily_challenges` can override any of these fields (see migrations/002).

export type Challenge = {
  id?: string;
  challenge_date?: string;
  title_en: string;
  title_ur?: string | null;
  description_en?: string | null;
  description_ur?: string | null;
  xp_reward: number;
  steps_en?: string[] | null;
  steps_ur?: string[] | null;
  hint_en?: string | null;
  hint_ur?: string | null;
  example_en?: string | null;
  example_ur?: string | null;
};

export const CHALLENGE_BANK: Challenge[] = [
  {
    title_en: 'Pattern Detective',
    title_ur: 'نمونہ جاسوس',
    description_en: 'Find one number pattern in everyday life and explain its rule.',
    description_ur: 'روزمرہ زندگی میں اعداد کا ایک نمونہ تلاش کریں اور اس کا اصول بیان کریں۔',
    xp_reward: 20,
    steps_en: [
      'Look around you: a calendar, a clock, house numbers on your street, a keyboard, floor buttons in a lift.',
      'Pick one place where numbers repeat or change in an orderly way.',
      'Write down at least four numbers from it in order.',
      'Work out the rule: what do you add, multiply or repeat to get from one number to the next?',
      'Test your rule by predicting the next number, then check it.',
    ],
    steps_ur: [
      'اپنے اردگرد دیکھیں: کیلنڈر، گھڑی، گلی کے مکانوں کے نمبر، کی بورڈ یا لفٹ کے بٹن۔',
      'کوئی ایسی جگہ چنیں جہاں اعداد ترتیب سے دہراتے یا بدلتے ہوں۔',
      'اس میں سے کم از کم چار اعداد ترتیب سے لکھیں۔',
      'اصول تلاش کریں: ایک عدد سے اگلے تک پہنچنے کے لیے کیا جمع، ضرب یا دہرایا جاتا ہے؟',
      'اگلا عدد اندازے سے بتا کر اپنے اصول کو جانچیں، پھر تصدیق کریں۔',
    ],
    hint_en: 'Subtract each number from the one after it. If the answer is always the same, that is your rule. If not, try dividing.',
    hint_ur: 'ہر عدد کو اس کے بعد والے عدد سے گھٹا کر دیکھیں۔ اگر جواب ہمیشہ ایک جیسا ہو تو وہی آپ کا اصول ہے۔ ورنہ تقسیم آزمائیں۔',
    example_en: 'House numbers on one side of a street: 2, 4, 6, 8. Rule: add 2 each time (even numbers). Next: 10.',
    example_ur: 'گلی کی ایک طرف مکانوں کے نمبر: 2، 4، 6، 8۔ اصول: ہر بار 2 جمع کریں (جفت اعداد)۔ اگلا: 10۔',
  },
  {
    title_en: 'Estimation Station',
    title_ur: 'اندازہ اسٹیشن',
    description_en: 'Estimate how many steps it takes to walk from your bed to the front door, then check.',
    description_ur: 'اندازہ لگائیں کہ آپ کے بستر سے صدر دروازے تک کتنے قدم ہیں، پھر گن کر دیکھیں۔',
    xp_reward: 20,
    steps_en: [
      'Write your guess before you move.',
      'Walk the route and count every step.',
      'Find the difference between your guess and the real number.',
      'Guess again for a different route, using what you learned.',
    ],
    steps_ur: [
      'حرکت کرنے سے پہلے اپنا اندازہ لکھ لیں۔',
      'راستے پر چلیں اور ہر قدم گنیں۔',
      'اپنے اندازے اور اصل تعداد کا فرق نکالیں۔',
      'اب کسی دوسرے راستے کے لیے دوبارہ اندازہ لگائیں۔',
    ],
    hint_en: 'Estimate one room first, then multiply by the number of rooms you pass through.',
    hint_ur: 'پہلے ایک کمرے کا اندازہ لگائیں، پھر جتنے کمروں سے گزریں ان سے ضرب دیں۔',
    example_en: 'Guess: 25 steps. Actual: 31. Difference: 6, so my guess was about 20% low.',
    example_ur: 'اندازہ: 25 قدم۔ اصل: 31۔ فرق: 6، یعنی میرا اندازہ تقریباً 20 فیصد کم تھا۔',
  },
  {
    title_en: 'Sink or Float?',
    title_ur: 'ڈوبے یا تیرے؟',
    description_en: 'Test five small household objects in a bowl of water and explain why each one sinks or floats.',
    description_ur: 'گھر کی پانچ چھوٹی چیزیں پانی کے پیالے میں ڈال کر دیکھیں اور بتائیں کہ ہر ایک کیوں ڈوبی یا تیری۔',
    xp_reward: 25,
    steps_en: [
      'Choose five safe objects (a coin, a cork, a spoon, a leaf, a small toy).',
      'Predict sink or float for each one before testing.',
      'Drop them in one at a time and record the result.',
      'Find one surprise and explain it using the idea of density.',
    ],
    steps_ur: [
      'پانچ محفوظ چیزیں چنیں (سکہ، کارک، چمچ، پتہ، چھوٹا کھلونا)۔',
      'آزمانے سے پہلے ہر ایک کے بارے میں ڈوبنے یا تیرنے کی پیش گوئی کریں۔',
      'انہیں ایک ایک کر کے ڈالیں اور نتیجہ لکھیں۔',
      'کوئی حیران کن نتیجہ چنیں اور کثافت (density) کے خیال سے اس کی وجہ بتائیں۔',
    ],
    hint_en: 'Something floats when it is less dense than water, not simply when it is light. A big heavy ship floats because of its shape.',
    hint_ur: 'کوئی چیز اس وقت تیرتی ہے جب اس کی کثافت پانی سے کم ہو، صرف ہلکی ہونے سے نہیں۔ بڑا بھاری جہاز اپنی شکل کی وجہ سے تیرتا ہے۔',
    example_en: 'A coin sank, but a wooden spoon floated. Wood is less dense than water; metal is more dense.',
    example_ur: 'سکہ ڈوب گیا مگر لکڑی کا چمچ تیرتا رہا۔ لکڑی کی کثافت پانی سے کم ہے اور دھات کی زیادہ۔',
  },
  {
    title_en: 'Human Algorithm',
    title_ur: 'انسانی الگورتھم',
    description_en: 'Write exact step-by-step instructions for making a glass of water or tea, as if a robot will follow them.',
    description_ur: 'پانی کا گلاس یا چائے بنانے کی ایسی درست ترتیب وار ہدایات لکھیں جیسے کوئی روبوٹ ان پر عمل کرے گا۔',
    xp_reward: 25,
    steps_en: [
      'Pick a small everyday task.',
      'Write every step as a separate line. Do not skip anything, a robot knows nothing.',
      'Add at least one decision (an "if ... then ..." step).',
      'Ask someone to follow your steps literally and note where they get stuck.',
    ],
    steps_ur: [
      'روزمرہ کا کوئی چھوٹا سا کام چنیں۔',
      'ہر مرحلہ الگ سطر میں لکھیں۔ کچھ نہ چھوڑیں، روبوٹ کچھ نہیں جانتا۔',
      'کم از کم ایک فیصلہ شامل کریں ("اگر ... تو ..." والا قدم)۔',
      'کسی سے کہیں کہ آپ کی ہدایات پر لفظ بہ لفظ عمل کرے اور دیکھیں کہاں اٹکتا ہے۔',
    ],
    hint_en: 'Start with "1. Pick up the glass." Be that specific: which hand, which tap, how full?',
    hint_ur: 'یوں شروع کریں: "1۔ گلاس اٹھائیں۔" اتنی ہی وضاحت رکھیں: کون سا ہاتھ، کون سا نل، کتنا بھرنا ہے؟',
    example_en: '1. Pick up the glass. 2. Go to the tap. 3. Turn the tap on. 4. If the glass is not full, wait. 5. Turn the tap off.',
    example_ur: '1۔ گلاس اٹھائیں۔ 2۔ نل کے پاس جائیں۔ 3۔ نل کھولیں۔ 4۔ اگر گلاس بھرا نہیں تو انتظار کریں۔ 5۔ نل بند کریں۔',
  },
  {
    title_en: 'Kitchen Chemist',
    title_ur: 'باورچی خانے کا کیمیا دان',
    description_en: 'Find one change that happens in your kitchen (melting, boiling, rusting, cooking) and decide if it is physical or chemical.',
    description_ur: 'باورچی خانے میں ہونے والی کوئی ایک تبدیلی (پگھلنا، ابلنا، زنگ لگنا، پکنا) ڈھونڈیں اور بتائیں کہ وہ طبعی ہے یا کیمیائی۔',
    xp_reward: 25,
    steps_en: [
      'Observe one change and write what you see, smell or feel.',
      'Ask: can the change be reversed easily?',
      'Ask: is a new substance formed?',
      'Decide: physical change or chemical change, and give your reason.',
    ],
    steps_ur: [
      'کوئی ایک تبدیلی دیکھیں اور جو نظر آئے، سونگھیں یا محسوس ہو وہ لکھیں۔',
      'سوچیں: کیا یہ تبدیلی آسانی سے واپس ہو سکتی ہے؟',
      'سوچیں: کیا کوئی نیا مادہ بنا؟',
      'فیصلہ کریں: طبعی تبدیلی یا کیمیائی تبدیلی، اور وجہ بتائیں۔',
    ],
    hint_en: 'Chemical changes usually make something new that you cannot easily turn back: a new colour, gas bubbles, heat, or a new smell.',
    hint_ur: 'کیمیائی تبدیلی میں عموماً کوئی نئی چیز بنتی ہے جسے واپس کرنا مشکل ہوتا ہے: نیا رنگ، بلبلے، حرارت یا نئی بو۔',
    example_en: 'Ice melting in a glass is physical: it is still water and can freeze again. Toasting bread is chemical: it cannot become bread again.',
    example_ur: 'گلاس میں برف کا پگھلنا طبعی ہے: وہ پھر بھی پانی ہے اور دوبارہ جم سکتا ہے۔ ٹوسٹ کا سینکنا کیمیائی ہے: وہ واپس ڈبل روٹی نہیں بن سکتی۔',
  },
  {
    title_en: 'Nature Spotter',
    title_ur: 'فطرت کا کھوجی',
    description_en: 'Find a plant or insect near your home, sketch or describe it, and explain one way it is adapted to where it lives.',
    description_ur: 'گھر کے قریب کوئی پودا یا کیڑا ڈھونڈیں، اس کا خاکہ بنائیں یا بیان کریں، اور بتائیں کہ وہ اپنے ماحول کے مطابق کیسے ڈھلا ہوا ہے۔',
    xp_reward: 25,
    steps_en: [
      'Go outside (a balcony or window view is fine) and pick one living thing.',
      'Describe its shape, colour, size and where you found it.',
      'Think about what it needs: food, water, safety, sunlight.',
      'Explain one feature that helps it survive there.',
    ],
    steps_ur: [
      'باہر جائیں (بالکونی یا کھڑکی سے نظارہ بھی چلے گا) اور کوئی ایک جاندار چنیں۔',
      'اس کی شکل، رنگ، سائز اور جہاں ملا وہ جگہ بیان کریں۔',
      'سوچیں کہ اسے کیا چاہیے: خوراک، پانی، حفاظت، دھوپ۔',
      'ایک ایسی خصوصیت بتائیں جو وہاں زندہ رہنے میں اس کی مدد کرتی ہے۔',
    ],
    hint_en: 'Adaptations can be colour (camouflage), shape (thorns, thin leaves) or behaviour (coming out only at night).',
    hint_ur: 'موافقت رنگ (چھپاؤ)، شکل (کانٹے، باریک پتے) یا رویے (صرف رات کو نکلنا) کی صورت میں ہو سکتی ہے۔',
    example_en: 'A cactus has thick stems that store water and spines instead of leaves, so it loses less water in the desert.',
    example_ur: 'کیکٹس کے موٹے تنے پانی جمع رکھتے ہیں اور پتوں کی جگہ کانٹے ہوتے ہیں، اس لیے صحرا میں پانی کم ضائع ہوتا ہے۔',
  },
  {
    title_en: 'Story Spark',
    title_ur: 'کہانی کی چنگاری',
    description_en: 'Write a six-sentence story that starts with: "The lights went out, and then I heard a number being whispered."',
    description_ur: 'چھ جملوں کی ایک کہانی لکھیں جو یوں شروع ہو: "بتی چلی گئی، پھر مجھے کسی کے سرگوشی میں ایک عدد بولنے کی آواز آئی۔"',
    xp_reward: 20,
    steps_en: [
      'Decide who is telling the story and where they are.',
      'Use the opening line exactly as given.',
      'Make the number matter: it must be a clue, a code or a warning.',
      'Finish with a surprising last sentence.',
    ],
    steps_ur: [
      'طے کریں کہ کہانی کون سنا رہا ہے اور وہ کہاں ہے۔',
      'پہلا جملہ بالکل ویسے ہی استعمال کریں جیسا دیا گیا ہے۔',
      'عدد کو اہم بنائیں: وہ کوئی سراغ، خفیہ کوڈ یا خبردار کرنے والی بات ہو۔',
      'ایک حیران کن آخری جملے پر ختم کریں۔',
    ],
    hint_en: 'Ask "what happens if the number is a locker code?" or "a date?" and follow the most interesting answer.',
    hint_ur: 'سوچیں "اگر یہ عدد کسی لاکر کا کوڈ ہو تو؟" یا "کوئی تاریخ ہو تو؟" اور سب سے دلچسپ جواب کے پیچھے چلیں۔',
    example_en: 'The lights went out, and then I heard a number being whispered. "Seven." Grandpa\'s old clock had just struck seven, and the missing key was taped behind it.',
    example_ur: 'بتی چلی گئی، پھر مجھے کسی کے سرگوشی میں ایک عدد بولنے کی آواز آئی۔ "سات۔" دادا کی پرانی گھڑی نے ابھی سات بجائے تھے اور کھوئی ہوئی چابی اس کے پیچھے چپکی تھی۔',
  },
];

export function contentFor(title: string): Challenge | undefined {
  return CHALLENGE_BANK.find((c) => c.title_en.toLowerCase() === title.toLowerCase());
}

// Stable pick for a given YYYY-MM-DD so everyone sees the same fallback challenge that day.
export function pickFallback(dateISO: string): Challenge {
  const day = Math.floor(new Date(dateISO + 'T00:00:00Z').getTime() / 86400000);
  return CHALLENGE_BANK[((day % CHALLENGE_BANK.length) + CHALLENGE_BANK.length) % CHALLENGE_BANK.length];
}

export const GENERIC_STEPS_EN = [
  'Read the challenge carefully.',
  'Think or explore, then try it in real life.',
  'Write what you found and why.',
  'Check your answer, then mark the challenge complete.',
];
export const GENERIC_STEPS_UR = [
  'چیلنج کو غور سے پڑھیں۔',
  'سوچیں یا کھوجیں، پھر حقیقی زندگی میں آزمائیں۔',
  'جو ملا اور اس کی وجہ لکھیں۔',
  'اپنے جواب کو جانچیں، پھر چیلنج مکمل کا نشان لگائیں۔',
];
