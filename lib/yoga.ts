// YogaAI pose library and session planner.
// Every pose follows the teaching format: purpose, start, movement, breathing,
// hold, alignment, common mistakes, modification and an advanced variation.

export type Lang = 'en' | 'ur';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Goal =
  | 'flexibility'
  | 'mobility'
  | 'relaxation'
  | 'stress'
  | 'balance'
  | 'fitness'
  | 'morning'
  | 'evening'
  | 'desk';
export type Limitation = 'wrists' | 'knees' | 'back' | 'neck' | 'balance';
export type Section = 'warmup' | 'mobility' | 'main' | 'strength' | 'cooldown' | 'relax';

type Text = { en: string; ur: string };
type List = { en: string[]; ur: string[] };

// Keypoints for the illustrated instructor (viewBox 0 0 240 200, floor at y=186).
export type P = [number, number];
export type Limb = { from?: P; j: P; e: P };
export type Figure = {
  head: P;
  sh: P;
  hip: P;
  mid?: P; // spine curve control point
  arms: [Limb, Limb]; // [far, near]
  legs: [Limb, Limb]; // [far, near]
};

export type Pose = {
  id: string;
  sanskrit?: string;
  name: Text;
  purpose: Text;
  start: Text;
  steps: List;
  breath: Text;
  hold: Text;
  alignment: List;
  mistakes: List;
  modification: Text;
  advanced: Text;
  cues: List; // short spoken coaching lines during the hold
  stress: Limitation[]; // body areas this pose loads
  figure: Figure;
};

export const POSES: Record<string, Pose> = {
  breathing: {
    id: 'breathing',
    sanskrit: 'Sukhasana',
    name: { en: 'Easy Seat & Breathing', ur: 'آسان نشست اور سانس' },
    purpose: { en: 'Calms the mind and prepares the body for practice.', ur: 'ذہن کو پُرسکون کرتا ہے اور جسم کو مشق کے لیے تیار کرتا ہے۔' },
    start: { en: 'Sit cross-legged on your mat. Rest your hands on your knees.', ur: 'میٹ پر آلتی پالتی مار کر بیٹھیں۔ ہاتھ گھٹنوں پر رکھیں۔' },
    steps: {
      en: ['Lengthen your spine and let your shoulders relax.', 'Close your eyes or soften your gaze.', 'Breathe slowly in and out through your nose.'],
      ur: ['کمر سیدھی کریں اور کندھے ڈھیلے چھوڑ دیں۔', 'آنکھیں بند کریں یا نظر نرم رکھیں۔', 'ناک سے آہستہ آہستہ سانس اندر اور باہر لیں۔'],
    },
    breath: { en: 'Inhale for 4 counts, exhale for 4–6 counts.', ur: '4 گنتی تک سانس اندر، 4 سے 6 گنتی تک سانس باہر۔' },
    hold: { en: '1–2 minutes of steady breathing.', ur: '1 سے 2 منٹ آرام سے سانس لیں۔' },
    alignment: {
      en: ['Sit tall, crown of the head up', 'Shoulders away from the ears', 'Hips level on the mat'],
      ur: ['سیدھا بیٹھیں، سر اوپر کی طرف', 'کندھے کانوں سے دور', 'دونوں کولہے برابر'],
    },
    mistakes: { en: ['Slouching the lower back', 'Holding the breath'], ur: ['کمر جھکا لینا', 'سانس روک لینا'] },
    modification: { en: 'Sit on a folded blanket or cushion so your knees can relax.', ur: 'تہہ کیے کمبل یا کشن پر بیٹھیں تاکہ گھٹنے آرام سے رہیں۔' },
    advanced: { en: 'Lengthen the exhale to twice the inhale.', ur: 'سانس باہر نکالنے کا وقت اندر لینے سے دوگنا کریں۔' },
    cues: {
      en: ['Take a deep breath in.', 'Slowly exhale.', 'Relax your shoulders.', 'Keep your spine long.'],
      ur: ['گہرا سانس اندر لیں۔', 'آہستہ سے سانس باہر نکالیں۔', 'کندھے ڈھیلے چھوڑیں۔', 'کمر سیدھی رکھیں۔'],
    },
    stress: [],
    figure: {
      head: [120, 90],
      sh: [120, 110],
      hip: [120, 160],
      arms: [
        { from: [132, 114], j: [142, 138], e: [138, 160] },
        { from: [108, 114], j: [98, 138], e: [102, 160] },
      ],
      legs: [
        { from: [128, 164], j: [156, 174], e: [116, 180] },
        { from: [112, 164], j: [84, 174], e: [124, 181] },
      ],
    },
  },

  neck: {
    id: 'neck',
    name: { en: 'Neck & Shoulder Release', ur: 'گردن اور کندھوں کی ورزش' },
    purpose: { en: 'Releases tension in the neck and upper back.', ur: 'گردن اور اوپری کمر کا تناؤ کم کرتا ہے۔' },
    start: { en: 'Sit tall in Easy Seat or on a chair.', ur: 'آسان نشست میں یا کرسی پر سیدھا بیٹھیں۔' },
    steps: {
      en: ['Slowly tilt your right ear toward your right shoulder.', 'Return to centre, then tilt to the left.', 'Roll your shoulders up, back and down five times.'],
      ur: ['دایاں کان آہستہ سے دائیں کندھے کی طرف جھکائیں۔', 'درمیان میں واپس آئیں، پھر بائیں طرف جھکائیں۔', 'کندھوں کو پانچ بار اوپر، پیچھے اور نیچے گھمائیں۔'],
    },
    breath: { en: 'Exhale as you tilt, inhale as you return to centre.', ur: 'جھکتے وقت سانس باہر، درمیان میں آتے وقت سانس اندر۔' },
    hold: { en: '3–5 breaths on each side.', ur: 'ہر طرف 3 سے 5 سانس۔' },
    alignment: {
      en: ['Keep the opposite shoulder down', 'Move slowly, never force', 'Keep the chin level'],
      ur: ['دوسرا کندھا نیچے رکھیں', 'آہستہ حرکت کریں، زور نہ لگائیں', 'ٹھوڑی سیدھی رکھیں'],
    },
    mistakes: { en: ['Lifting the shoulder to the ear', 'Rolling the head quickly in circles'], ur: ['کندھا کان تک اٹھانا', 'سر کو تیزی سے گول گھمانا'] },
    modification: { en: 'Make the movement smaller and stay where it feels comfortable.', ur: 'حرکت چھوٹی رکھیں اور جہاں آرام دہ ہو وہیں رکیں۔' },
    advanced: { en: 'Rest the hand lightly on the head for a gentle extra stretch — no pulling.', ur: 'ہاتھ ہلکے سے سر پر رکھیں تاکہ ہلکا اضافی کھنچاؤ ہو — کھینچیں نہیں۔' },
    cues: {
      en: ['Only move within a comfortable range of motion.', 'Relax your shoulders.', 'Slowly exhale.'],
      ur: ['صرف آرام دہ حد تک حرکت کریں۔', 'کندھے ڈھیلے چھوڑیں۔', 'آہستہ سے سانس باہر نکالیں۔'],
    },
    stress: ['neck'],
    figure: {
      head: [131, 93],
      sh: [120, 110],
      hip: [120, 160],
      arms: [
        { from: [132, 114], j: [142, 138], e: [138, 160] },
        { from: [108, 114], j: [98, 138], e: [102, 160] },
      ],
      legs: [
        { from: [128, 164], j: [156, 174], e: [116, 180] },
        { from: [112, 164], j: [84, 174], e: [124, 181] },
      ],
    },
  },

  sideStretch: {
    id: 'sideStretch',
    name: { en: 'Seated Side Stretch', ur: 'بیٹھ کر پہلو کا کھنچاؤ' },
    purpose: { en: 'Opens the sides of the body and the ribs.', ur: 'جسم کے پہلو اور پسلیوں کو کھولتا ہے۔' },
    start: { en: 'Sit tall in Easy Seat with your left hand on the floor.', ur: 'آسان نشست میں سیدھا بیٹھیں، بایاں ہاتھ زمین پر رکھیں۔' },
    steps: {
      en: ['Reach your right arm up toward the ceiling.', 'Lean gently to the left, making a long curve.', 'Come back to centre and repeat on the other side.'],
      ur: ['دایاں بازو چھت کی طرف اٹھائیں۔', 'آہستہ سے بائیں طرف جھکیں، ایک لمبا خم بنائیں۔', 'درمیان میں واپس آئیں اور دوسری طرف دہرائیں۔'],
    },
    breath: { en: 'Inhale to reach up, exhale to lean over.', ur: 'اوپر اٹھاتے ہوئے سانس اندر، جھکتے ہوئے سانس باہر۔' },
    hold: { en: '3–5 breaths each side.', ur: 'ہر طرف 3 سے 5 سانس۔' },
    alignment: {
      en: ['Both hips stay grounded', 'Reach long before you lean', 'Keep the chest open'],
      ur: ['دونوں کولہے زمین پر رہیں', 'جھکنے سے پہلے اوپر کی طرف لمبا کھنچیں', 'سینہ کھلا رکھیں'],
    },
    mistakes: { en: ['Collapsing forward', 'Lifting the opposite hip'], ur: ['آگے کی طرف ڈھے جانا', 'دوسرا کولہا اٹھا لینا'] },
    modification: { en: 'Do it seated on a chair with feet flat on the floor.', ur: 'کرسی پر بیٹھ کر، پاؤں زمین پر رکھ کر کریں۔' },
    advanced: { en: 'Sit with legs wide and reach toward the opposite foot.', ur: 'ٹانگیں کھول کر بیٹھیں اور مخالف پاؤں کی طرف ہاتھ بڑھائیں۔' },
    cues: {
      en: ['Take a deep breath in.', 'Slowly exhale and lean.', 'Keep your spine long.'],
      ur: ['گہرا سانس اندر لیں۔', 'آہستہ سانس باہر نکالیں اور جھکیں۔', 'کمر لمبی رکھیں۔'],
    },
    stress: [],
    figure: {
      head: [102, 94],
      sh: [112, 112],
      hip: [120, 160],
      mid: [120, 136],
      arms: [
        { from: [124, 108], j: [124, 82], e: [100, 66] },
        { from: [102, 116], j: [94, 140], e: [90, 162] },
      ],
      legs: [
        { from: [128, 164], j: [156, 174], e: [116, 180] },
        { from: [112, 164], j: [84, 174], e: [124, 181] },
      ],
    },
  },

  catCow: {
    id: 'catCow',
    sanskrit: 'Marjaryasana–Bitilasana',
    name: { en: 'Cat-Cow', ur: 'بلی اور گائے' },
    purpose: { en: 'Warms up and mobilises the whole spine.', ur: 'پوری ریڑھ کی ہڈی کو گرم اور لچکدار بناتا ہے۔' },
    start: { en: 'Come onto hands and knees: wrists under shoulders, knees under hips.', ur: 'ہاتھوں اور گھٹنوں کے بل آئیں: کلائیاں کندھوں کے نیچے، گھٹنے کولہوں کے نیچے۔' },
    steps: {
      en: ['Cow: drop the belly, lift the chest and tailbone, look slightly forward.', 'Cat: press the floor away, round the back and tuck the chin.', 'Flow slowly between the two with your breath.'],
      ur: ['گائے: پیٹ نیچے، سینہ اور کمر کا نچلا حصہ اوپر، ہلکا سا آگے دیکھیں۔', 'بلی: زمین کو دھکیلیں، کمر گول کریں اور ٹھوڑی اندر کریں۔', 'سانس کے ساتھ آہستہ آہستہ دونوں کے درمیان حرکت کریں۔'],
    },
    breath: { en: 'Inhale into Cow, exhale into Cat.', ur: 'گائے میں سانس اندر، بلی میں سانس باہر۔' },
    hold: { en: '6–10 slow rounds.', ur: '6 سے 10 آہستہ چکر۔' },
    alignment: {
      en: ['Wrists under shoulders', 'Knees under hips', 'Move from the whole spine, not just the neck'],
      ur: ['کلائیاں کندھوں کے نیچے', 'گھٹنے کولہوں کے نیچے', 'صرف گردن نہیں، پوری ریڑھ سے حرکت کریں'],
    },
    mistakes: { en: ['Moving too fast', 'Locking the elbows', 'Throwing the head back in Cow'], ur: ['بہت تیز حرکت', 'کہنیاں لاک کرنا', 'گائے میں سر پیچھے پھینکنا'] },
    modification: { en: 'Place a folded blanket under the knees, or do seated cat-cow on a chair.', ur: 'گھٹنوں کے نیچے تہہ کیا کمبل رکھیں، یا کرسی پر بیٹھ کر یہ حرکت کریں۔' },
    advanced: { en: 'Add a slow hip circle between rounds.', ur: 'چکروں کے درمیان کولہوں کا آہستہ دائرہ شامل کریں۔' },
    cues: {
      en: ['Inhale, into Cow.', 'Exhale, round into Cat.', 'Move slowly with your breath.'],
      ur: ['سانس اندر، گائے۔', 'سانس باہر، بلی۔', 'سانس کے ساتھ آہستہ حرکت کریں۔'],
    },
    stress: ['wrists', 'knees'],
    figure: {
      head: [162, 146],
      sh: [142, 134],
      hip: [84, 140],
      mid: [113, 116],
      arms: [
        { j: [146, 159], e: [146, 184] },
        { j: [141, 159], e: [141, 184] },
      ],
      legs: [
        { j: [88, 180], e: [50, 183] },
        { j: [84, 180], e: [46, 183] },
      ],
    },
  },

  child: {
    id: 'child',
    sanskrit: 'Balasana',
    name: { en: "Child's Pose", ur: 'بچے کا آسن' },
    purpose: { en: 'A resting pose that gently stretches the back and hips.', ur: 'آرام کا آسن جو کمر اور کولہوں کو نرمی سے کھینچتا ہے۔' },
    start: { en: 'Kneel on the mat with big toes touching and knees hip-width apart.', ur: 'میٹ پر گھٹنوں کے بل بیٹھیں، انگوٹھے ملے ہوں اور گھٹنے کولہوں جتنے کھلے۔' },
    steps: {
      en: ['Sit your hips back toward your heels.', 'Walk your hands forward and lower your chest.', 'Rest your forehead on the mat or a cushion.'],
      ur: ['کولہے ایڑیوں کی طرف پیچھے لے جائیں۔', 'ہاتھ آگے بڑھائیں اور سینہ نیچے کریں۔', 'ماتھا میٹ یا کشن پر ٹکا دیں۔'],
    },
    breath: { en: 'Breathe slowly into your back body; let each exhale soften you.', ur: 'کمر کی طرف آہستہ سانس لیں؛ ہر سانس کے باہر نکلنے کے ساتھ ڈھیلے ہوں۔' },
    hold: { en: '30 seconds to 2 minutes.', ur: '30 سیکنڈ سے 2 منٹ۔' },
    alignment: {
      en: ['Hips sink toward the heels', 'Neck relaxed, forehead supported', 'Shoulders soft'],
      ur: ['کولہے ایڑیوں کی طرف', 'گردن ڈھیلی، ماتھا ٹکا ہوا', 'کندھے نرم'],
    },
    mistakes: { en: ['Forcing the hips down', 'Straining the neck'], ur: ['کولہوں کو زبردستی نیچے دبانا', 'گردن پر زور ڈالنا'] },
    modification: { en: 'Place a cushion between hips and heels, or under the chest.', ur: 'کولہوں اور ایڑیوں کے درمیان یا سینے کے نیچے کشن رکھیں۔' },
    advanced: { en: 'Walk both hands to one side for a side-body stretch.', ur: 'پہلو کے کھنچاؤ کے لیے دونوں ہاتھ ایک طرف لے جائیں۔' },
    cues: {
      en: ['Rest here.', 'Take a deep breath in.', 'Slowly exhale and soften.'],
      ur: ['یہاں آرام کریں۔', 'گہرا سانس اندر لیں۔', 'آہستہ سانس باہر نکالیں اور ڈھیلے ہو جائیں۔'],
    },
    stress: ['knees'],
    figure: {
      head: [158, 175],
      sh: [140, 170],
      hip: [92, 166],
      mid: [116, 156],
      arms: [
        { j: [168, 178], e: [196, 182] },
        { j: [166, 180], e: [192, 183] },
      ],
      legs: [
        { j: [124, 181], e: [88, 183] },
        { j: [120, 181], e: [84, 184] },
      ],
    },
  },

  downDog: {
    id: 'downDog',
    sanskrit: 'Adho Mukha Svanasana',
    name: { en: 'Downward-Facing Dog', ur: 'نیچے دیکھتا کتا' },
    purpose: { en: 'Stretches the hamstrings, calves and shoulders; builds arm strength.', ur: 'پنڈلیوں، رانوں کے پچھلے حصے اور کندھوں کو کھینچتا ہے؛ بازو مضبوط کرتا ہے۔' },
    start: { en: 'Start on hands and knees, hands slightly ahead of the shoulders.', ur: 'ہاتھوں اور گھٹنوں کے بل شروع کریں، ہاتھ کندھوں سے تھوڑا آگے۔' },
    steps: {
      en: ['Tuck your toes under.', 'Lift your knees and send your hips up and back.', 'Make an upside-down V; heels reach toward the floor.'],
      ur: ['پاؤں کی انگلیاں موڑ کر نیچے رکھیں۔', 'گھٹنے اٹھائیں اور کولہے اوپر اور پیچھے لے جائیں۔', 'اُلٹا V بنائیں؛ ایڑیاں زمین کی طرف۔'],
    },
    breath: { en: 'Exhale to lift the hips; breathe steadily while holding.', ur: 'کولہے اٹھاتے ہوئے سانس باہر؛ رکتے وقت برابر سانس لیں۔' },
    hold: { en: '5–8 breaths (about 30–60 seconds).', ur: '5 سے 8 سانس (تقریباً 30 سے 60 سیکنڈ)۔' },
    alignment: {
      en: ['Spread the fingers and press through the whole hand', 'Long spine is more important than straight legs', 'Head relaxed between the arms'],
      ur: ['انگلیاں پھیلائیں اور پورے ہاتھ سے دبائیں', 'سیدھی ٹانگوں سے زیادہ لمبی کمر اہم ہے', 'سر بازوؤں کے درمیان ڈھیلا'],
    },
    mistakes: { en: ['Rounding the back to force the heels down', 'Shoulders hunched to the ears', 'Weight only in the wrists'], ur: ['ایڑیاں نیچے کرنے کے لیے کمر گول کرنا', 'کندھے کانوں تک اٹھانا', 'سارا وزن کلائیوں پر'] },
    modification: { en: 'Bend your knees generously, or do it with hands on a wall or chair.', ur: 'گھٹنے اچھی طرح موڑیں، یا دیوار یا کرسی پر ہاتھ رکھ کر کریں۔' },
    advanced: { en: 'Lift one leg high behind you (Three-Legged Dog).', ur: 'ایک ٹانگ پیچھے اوپر اٹھائیں (تین ٹانگوں والا کتا)۔' },
    cues: {
      en: ['Press the floor away.', 'Hips up and back.', 'Bend your knees if you need to.', 'Hold this position.'],
      ur: ['زمین کو دور دھکیلیں۔', 'کولہے اوپر اور پیچھے۔', 'ضرورت ہو تو گھٹنے موڑ لیں۔', 'اسی حالت میں رکیں۔'],
    },
    stress: ['wrists', 'back'],
    figure: {
      head: [154, 150],
      sh: [158, 136],
      hip: [116, 84],
      arms: [
        { j: [172, 160], e: [182, 184] },
        { j: [168, 160], e: [178, 184] },
      ],
      legs: [
        { j: [94, 134], e: [68, 183] },
        { j: [90, 134], e: [64, 184] },
      ],
    },
  },

  mountain: {
    id: 'mountain',
    sanskrit: 'Tadasana',
    name: { en: 'Mountain Pose', ur: 'پہاڑ کا آسن' },
    purpose: { en: 'Teaches good standing posture and body awareness.', ur: 'اچھے انداز میں کھڑا ہونا اور جسم کا شعور سکھاتا ہے۔' },
    start: { en: 'Stand with feet hip-width apart, arms by your sides.', ur: 'پاؤں کولہوں جتنے کھول کر کھڑے ہوں، بازو پہلو میں۔' },
    steps: {
      en: ['Spread your toes and press evenly through both feet.', 'Lift the chest and relax the shoulders down.', 'Reach the crown of your head toward the sky.'],
      ur: ['پاؤں کی انگلیاں پھیلائیں اور دونوں پاؤں پر برابر وزن ڈالیں۔', 'سینہ اٹھائیں اور کندھے نیچے ڈھیلے کریں۔', 'سر کا اوپری حصہ آسمان کی طرف۔'],
    },
    breath: { en: 'Slow, even breaths through the nose.', ur: 'ناک سے آہستہ اور برابر سانس۔' },
    hold: { en: '5 breaths.', ur: '5 سانس۔' },
    alignment: {
      en: ['Ears over shoulders over hips over ankles', 'Knees soft, not locked', 'Weight even between both feet'],
      ur: ['کان، کندھے، کولہے اور ٹخنے ایک سیدھ میں', 'گھٹنے نرم، لاک نہیں', 'دونوں پاؤں پر برابر وزن'],
    },
    mistakes: { en: ['Locking the knees', 'Sticking the ribs out'], ur: ['گھٹنے لاک کرنا', 'پسلیاں باہر نکالنا'] },
    modification: { en: 'Stand with your back near a wall for feedback.', ur: 'رہنمائی کے لیے دیوار کے قریب پیٹھ کر کے کھڑے ہوں۔' },
    advanced: { en: 'Close your eyes to challenge your balance.', ur: 'توازن کو آزمانے کے لیے آنکھیں بند کریں۔' },
    cues: {
      en: ['Stand tall.', 'Relax your shoulders.', 'Take a deep breath in.', 'Slowly exhale.'],
      ur: ['سیدھے کھڑے ہوں۔', 'کندھے ڈھیلے چھوڑیں۔', 'گہرا سانس اندر لیں۔', 'آہستہ سے سانس باہر نکالیں۔'],
    },
    stress: [],
    figure: {
      head: [120, 38],
      sh: [120, 58],
      hip: [120, 112],
      arms: [
        { from: [133, 62], j: [137, 88], e: [139, 112] },
        { from: [107, 62], j: [103, 88], e: [101, 112] },
      ],
      legs: [
        { from: [127, 114], j: [127, 148], e: [127, 184] },
        { from: [113, 114], j: [113, 148], e: [113, 184] },
      ],
    },
  },

  forwardFold: {
    id: 'forwardFold',
    sanskrit: 'Uttanasana',
    name: { en: 'Standing Forward Fold', ur: 'کھڑے ہو کر آگے جھکنا' },
    purpose: { en: 'Stretches the back of the legs and calms the mind.', ur: 'ٹانگوں کے پچھلے حصے کو کھینچتا ہے اور ذہن کو پُرسکون کرتا ہے۔' },
    start: { en: 'Stand in Mountain Pose with feet hip-width apart.', ur: 'پہاڑ کے آسن میں پاؤں کولہوں جتنے کھول کر کھڑے ہوں۔' },
    steps: {
      en: ['Bend your knees slightly.', 'Hinge forward from the hips, not the waist.', 'Let your head and arms hang heavy.'],
      ur: ['گھٹنے تھوڑے سے موڑیں۔', 'کمر نہیں، کولہوں سے آگے جھکیں۔', 'سر اور بازو ڈھیلے لٹکنے دیں۔'],
    },
    breath: { en: 'Exhale to fold; inhale to lengthen slightly; exhale to relax deeper.', ur: 'جھکتے ہوئے سانس باہر؛ سانس اندر لے کر تھوڑا لمبا ہوں؛ سانس باہر نکال کر مزید ڈھیلے ہوں۔' },
    hold: { en: '5–8 breaths. Roll up slowly to stand.', ur: '5 سے 8 سانس۔ آہستہ آہستہ اوپر آئیں۔' },
    alignment: {
      en: ['Fold from the hips', 'Knees bent as much as needed', 'Neck relaxed'],
      ur: ['کولہوں سے جھکیں', 'ضرورت کے مطابق گھٹنے موڑیں', 'گردن ڈھیلی'],
    },
    mistakes: { en: ['Bouncing to reach the floor', 'Standing up too quickly'], ur: ['زمین تک پہنچنے کے لیے اچھلنا', 'بہت جلدی کھڑے ہونا'] },
    modification: { en: 'Rest your hands on your shins or on blocks.', ur: 'ہاتھ پنڈلیوں یا بلاکس پر رکھیں۔' },
    advanced: { en: 'Hold opposite elbows and let the upper body sway gently (Ragdoll).', ur: 'مخالف کہنیاں پکڑیں اور اوپری جسم کو ہلکا سا جھولنے دیں۔' },
    cues: {
      en: ['Let your head hang heavy.', 'Bend your knees if you need to.', 'Slowly exhale.'],
      ur: ['سر کو ڈھیلا لٹکنے دیں۔', 'ضرورت ہو تو گھٹنے موڑ لیں۔', 'آہستہ سے سانس باہر نکالیں۔'],
    },
    stress: ['back'],
    figure: {
      head: [132, 170],
      sh: [134, 152],
      hip: [116, 104],
      mid: [138, 124],
      arms: [
        { j: [140, 170], e: [142, 184] },
        { j: [136, 170], e: [138, 184] },
      ],
      legs: [
        { j: [124, 144], e: [120, 183] },
        { j: [120, 144], e: [116, 184] },
      ],
    },
  },

  warrior2: {
    id: 'warrior2',
    sanskrit: 'Virabhadrasana II',
    name: { en: 'Warrior II', ur: 'جنگجو دوم' },
    purpose: { en: 'Builds leg strength, stamina and focus.', ur: 'ٹانگوں کی طاقت، برداشت اور توجہ بڑھاتا ہے۔' },
    start: { en: 'Stand with feet wide apart, about one leg-length.', ur: 'پاؤں کافی کھول کر کھڑے ہوں، تقریباً ایک ٹانگ کے برابر فاصلہ۔' },
    steps: {
      en: ['Turn your right foot out; keep the left foot slightly in.', 'Bend the right knee over the right ankle.', 'Stretch your arms out at shoulder height and look over the right hand.'],
      ur: ['دایاں پاؤں باہر کی طرف موڑیں؛ بایاں پاؤں تھوڑا اندر۔', 'دایاں گھٹنا دائیں ٹخنے کے اوپر موڑیں۔', 'بازو کندھوں کی اونچائی پر پھیلائیں اور دائیں ہاتھ کی طرف دیکھیں۔'],
    },
    breath: { en: 'Inhale to lift the arms; exhale to bend the knee; breathe steadily.', ur: 'بازو اٹھاتے ہوئے سانس اندر؛ گھٹنا موڑتے ہوئے سانس باہر؛ برابر سانس لیں۔' },
    hold: { en: '20–45 seconds each side.', ur: 'ہر طرف 20 سے 45 سیکنڈ۔' },
    alignment: {
      en: ['Front knee over the ankle, pointing toward the toes', 'Torso stays upright over the hips', 'Shoulders relaxed, arms active'],
      ur: ['اگلا گھٹنا ٹخنے کے اوپر، انگلیوں کی سمت', 'دھڑ کولہوں کے اوپر سیدھا', 'کندھے ڈھیلے، بازو فعال'],
    },
    mistakes: { en: ['Front knee collapsing inward', 'Leaning the torso forward', 'Lifting the shoulders'], ur: ['اگلا گھٹنا اندر کی طرف گرنا', 'دھڑ آگے جھکانا', 'کندھے اٹھانا'] },
    modification: { en: 'Shorten your stance and bend the front knee less.', ur: 'پاؤں کا فاصلہ کم کریں اور اگلا گھٹنا کم موڑیں۔' },
    advanced: { en: 'Bend the front thigh parallel to the floor and hold longer.', ur: 'اگلی ران کو زمین کے متوازی تک موڑیں اور زیادہ دیر رکیں۔' },
    cues: {
      en: ['Knee over the ankle.', 'Keep your spine long.', 'Relax your shoulders.', 'Hold this position.'],
      ur: ['گھٹنا ٹخنے کے اوپر۔', 'کمر سیدھی رکھیں۔', 'کندھے ڈھیلے چھوڑیں۔', 'اسی حالت میں رکیں۔'],
    },
    stress: ['knees'],
    figure: {
      head: [124, 48],
      sh: [120, 68],
      hip: [120, 118],
      arms: [
        { from: [107, 70], j: [82, 70], e: [56, 70] },
        { from: [133, 70], j: [158, 70], e: [184, 70] },
      ],
      legs: [
        { from: [113, 120], j: [94, 152], e: [72, 184] },
        { from: [127, 120], j: [160, 142], e: [162, 184] },
      ],
    },
  },

  tree: {
    id: 'tree',
    sanskrit: 'Vrksasana',
    name: { en: 'Tree Pose', ur: 'درخت کا آسن' },
    purpose: { en: 'Improves balance, focus and ankle strength.', ur: 'توازن، توجہ اور ٹخنوں کی مضبوطی بہتر کرتا ہے۔' },
    start: { en: 'Stand in Mountain Pose and shift your weight onto the left foot.', ur: 'پہاڑ کے آسن میں کھڑے ہوں اور وزن بائیں پاؤں پر لے آئیں۔' },
    steps: {
      en: ['Place the right foot on the inner left calf or thigh — never on the knee.', 'Bring the palms together at your chest.', 'When steady, reach the arms overhead.'],
      ur: ['دایاں پاؤں بائیں پنڈلی یا ران کے اندر رکھیں — گھٹنے پر کبھی نہیں۔', 'ہتھیلیاں سینے کے سامنے ملائیں۔', 'مستحکم ہوں تو بازو سر کے اوپر لے جائیں۔'],
    },
    breath: { en: 'Keep the breath slow and smooth to stay steady.', ur: 'مستحکم رہنے کے لیے سانس آہستہ اور ہموار رکھیں۔' },
    hold: { en: '20–30 seconds each side.', ur: 'ہر طرف 20 سے 30 سیکنڈ۔' },
    alignment: {
      en: ['Foot above or below the knee, not on it', 'Hips level', 'Fix your gaze on one still point'],
      ur: ['پاؤں گھٹنے کے اوپر یا نیچے، اس پر نہیں', 'کولہے برابر', 'نظر ایک ساکن نقطے پر'],
    },
    mistakes: { en: ['Pressing the foot into the knee joint', 'Hip jutting out to the side'], ur: ['پاؤں گھٹنے کے جوڑ پر دبانا', 'کولہا ایک طرف باہر نکالنا'] },
    modification: { en: 'Keep your toes on the floor like a kickstand, or hold a wall.', ur: 'پاؤں کی انگلیاں زمین پر رکھیں، یا دیوار کا سہارا لیں۔' },
    advanced: { en: 'Close your eyes, or sway the arms slowly like branches.', ur: 'آنکھیں بند کریں، یا بازوؤں کو شاخوں کی طرح آہستہ جھلائیں۔' },
    cues: {
      en: ['Find a still point to look at.', 'Grow tall through the standing leg.', 'If you wobble, that is fine — come back.'],
      ur: ['دیکھنے کے لیے ایک ساکن نقطہ چنیں۔', 'کھڑی ٹانگ سے اوپر کی طرف لمبے ہوں۔', 'اگر ڈگمگائیں تو کوئی بات نہیں — دوبارہ آئیں۔'],
    },
    stress: ['balance'],
    figure: {
      head: [120, 40],
      sh: [120, 60],
      hip: [120, 112],
      arms: [
        { from: [132, 64], j: [136, 36], e: [121, 14] },
        { from: [108, 64], j: [104, 36], e: [119, 14] },
      ],
      legs: [
        { from: [114, 114], j: [114, 148], e: [114, 184] },
        { from: [126, 114], j: [152, 134], e: [118, 142] },
      ],
    },
  },

  chair: {
    id: 'chair',
    sanskrit: 'Utkatasana',
    name: { en: 'Chair Pose', ur: 'کرسی کا آسن' },
    purpose: { en: 'Strengthens the legs and core and builds heat.', ur: 'ٹانگوں اور پیٹ کے پٹھوں کو مضبوط کرتا ہے اور جسم گرم کرتا ہے۔' },
    start: { en: 'Stand in Mountain Pose with feet together or hip-width.', ur: 'پہاڑ کے آسن میں پاؤں ملا کر یا کولہوں جتنے کھول کر کھڑے ہوں۔' },
    steps: {
      en: ['Bend your knees and sit back as if onto a chair.', 'Reach your arms up beside your ears.', 'Keep your weight in your heels.'],
      ur: ['گھٹنے موڑیں اور ایسے پیچھے بیٹھیں جیسے کرسی پر بیٹھ رہے ہوں۔', 'بازو کانوں کے ساتھ اوپر اٹھائیں۔', 'وزن ایڑیوں پر رکھیں۔'],
    },
    breath: { en: 'Inhale to reach up, exhale to sit lower; keep breathing.', ur: 'اوپر اٹھاتے ہوئے سانس اندر، نیچے بیٹھتے ہوئے سانس باہر؛ سانس جاری رکھیں۔' },
    hold: { en: '15–30 seconds, 2 rounds.', ur: '15 سے 30 سیکنڈ، 2 بار۔' },
    alignment: {
      en: ['You can see your toes past your knees', 'Chest lifted, back long', 'Knees track over the toes'],
      ur: ['گھٹنوں کے پار پاؤں کی انگلیاں نظر آئیں', 'سینہ اٹھا ہوا، کمر لمبی', 'گھٹنے انگلیوں کی سیدھ میں'],
    },
    mistakes: { en: ['Knees shooting far past the toes', 'Arching the lower back'], ur: ['گھٹنے انگلیوں سے بہت آگے نکالنا', 'نچلی کمر کو زیادہ خم دینا'] },
    modification: { en: 'Keep your hands on your hips or at your chest and bend less.', ur: 'ہاتھ کولہوں پر یا سینے پر رکھیں اور کم جھکیں۔' },
    advanced: { en: 'Sit lower and lift the heels slightly for a balance challenge.', ur: 'مزید نیچے بیٹھیں اور توازن کے لیے ایڑیاں تھوڑی اٹھائیں۔' },
    cues: {
      en: ['Sit back into your heels.', 'Keep your spine long.', 'Keep breathing.', 'Hold this position.'],
      ur: ['ایڑیوں پر وزن ڈال کر پیچھے بیٹھیں۔', 'کمر لمبی رکھیں۔', 'سانس لیتے رہیں۔', 'اسی حالت میں رکیں۔'],
    },
    stress: ['knees'],
    figure: {
      head: [136, 64],
      sh: [128, 82],
      hip: [112, 130],
      arms: [
        { j: [142, 58], e: [154, 35] },
        { j: [139, 58], e: [150, 34] },
      ],
      legs: [
        { j: [156, 150], e: [136, 183] },
        { j: [152, 150], e: [132, 184] },
      ],
    },
  },

  cobra: {
    id: 'cobra',
    sanskrit: 'Bhujangasana',
    name: { en: 'Cobra Pose', ur: 'ناگ کا آسن' },
    purpose: { en: 'Strengthens the back and opens the chest.', ur: 'کمر کو مضبوط اور سینے کو کھولتا ہے۔' },
    start: { en: 'Lie on your front with hands under your shoulders and legs together.', ur: 'پیٹ کے بل لیٹیں، ہاتھ کندھوں کے نیچے اور ٹانگیں ملی ہوئی۔' },
    steps: {
      en: ['Press the tops of the feet into the mat.', 'Lift your chest using your back muscles.', 'Keep the elbows bent and close to your body.'],
      ur: ['پاؤں کا اوپری حصہ میٹ پر دبائیں۔', 'کمر کے پٹھوں سے سینہ اٹھائیں۔', 'کہنیاں مڑی ہوئی اور جسم کے قریب رکھیں۔'],
    },
    breath: { en: 'Inhale to lift, exhale to lower. Repeat 3–5 times.', ur: 'اٹھاتے ہوئے سانس اندر، نیچے آتے ہوئے سانس باہر۔ 3 سے 5 بار دہرائیں۔' },
    hold: { en: '3–5 breaths at the top, or 3–5 slow lifts.', ur: 'اوپر 3 سے 5 سانس، یا 3 سے 5 آہستہ اٹھان۔' },
    alignment: {
      en: ['Shoulders down and back', 'Neck long — look slightly forward', 'Hips stay on the mat'],
      ur: ['کندھے نیچے اور پیچھے', 'گردن لمبی — ہلکا سا آگے دیکھیں', 'کولہے میٹ پر رہیں'],
    },
    mistakes: { en: ['Pushing up too high with the arms', 'Cranking the neck back'], ur: ['بازوؤں سے بہت اونچا دھکیلنا', 'گردن کو بہت پیچھے موڑنا'] },
    modification: { en: 'Sphinx Pose: rest on your forearms instead.', ur: 'اسفنکس آسن: اس کے بجائے بازوؤں کے اگلے حصے پر ٹکیں۔' },
    advanced: { en: 'Hover the hands off the mat for a few breaths.', ur: 'چند سانسوں کے لیے ہاتھ میٹ سے ذرا اوپر اٹھا لیں۔' },
    cues: {
      en: ['Lift with your back, not your arms.', 'Shoulders away from your ears.', 'If this feels uncomfortable, come out of the pose.'],
      ur: ['بازوؤں سے نہیں، کمر سے اٹھیں۔', 'کندھے کانوں سے دور۔', 'اگر تکلیف ہو تو آسن سے باہر آ جائیں۔'],
    },
    stress: ['back', 'wrists'],
    figure: {
      head: [172, 134],
      sh: [160, 150],
      hip: [116, 178],
      mid: [142, 170],
      arms: [
        { j: [154, 168], e: [162, 184] },
        { j: [150, 168], e: [158, 184] },
      ],
      legs: [
        { j: [84, 181], e: [50, 182] },
        { j: [82, 182], e: [48, 183] },
      ],
    },
  },

  bridge: {
    id: 'bridge',
    sanskrit: 'Setu Bandhasana',
    name: { en: 'Bridge Pose', ur: 'پُل کا آسن' },
    purpose: { en: 'Strengthens the glutes and back; opens the front of the hips.', ur: 'کولہوں اور کمر کو مضبوط اور کولہوں کا اگلا حصہ کھولتا ہے۔' },
    start: { en: 'Lie on your back, knees bent, feet flat and hip-width apart.', ur: 'کمر کے بل لیٹیں، گھٹنے موڑیں، پاؤں زمین پر کولہوں جتنے کھلے۔' },
    steps: {
      en: ['Place your arms by your sides, palms down.', 'Press into your feet and lift your hips.', 'Lower slowly, one part of the spine at a time.'],
      ur: ['بازو پہلو میں، ہتھیلیاں نیچے۔', 'پاؤں سے دبائیں اور کولہے اٹھائیں۔', 'ریڑھ کو ایک ایک حصہ کر کے آہستہ نیچے لائیں۔'],
    },
    breath: { en: 'Inhale to lift, exhale to lower.', ur: 'اٹھاتے ہوئے سانس اندر، نیچے لاتے ہوئے سانس باہر۔' },
    hold: { en: '3–5 breaths, 2–3 rounds.', ur: '3 سے 5 سانس، 2 سے 3 بار۔' },
    alignment: {
      en: ['Knees over the ankles', 'Knees stay hip-width, not falling in', 'Do not turn your head while lifted'],
      ur: ['گھٹنے ٹخنوں کے اوپر', 'گھٹنے کولہوں جتنے کھلے، اندر نہ گریں', 'اٹھے ہوئے سر نہ گھمائیں'],
    },
    mistakes: { en: ['Knees splaying out or in', 'Pushing the hips too high and arching the lower back'], ur: ['گھٹنے باہر یا اندر گرنا', 'کولہے بہت اونچے کر کے نچلی کمر میں خم ڈالنا'] },
    modification: { en: 'Lift only a little, or place a cushion or block under the sacrum.', ur: 'تھوڑا سا ہی اٹھائیں، یا کمر کے نچلے حصے کے نیچے کشن یا بلاک رکھیں۔' },
    advanced: { en: 'Lift one leg toward the ceiling while keeping the hips level.', ur: 'کولہے برابر رکھتے ہوئے ایک ٹانگ چھت کی طرف اٹھائیں۔' },
    cues: {
      en: ['Press into your feet.', 'Take a deep breath in and lift.', 'Slowly exhale and lower.'],
      ur: ['پاؤں سے دبائیں۔', 'گہرا سانس اندر لیں اور اٹھیں۔', 'آہستہ سانس باہر نکالیں اور نیچے آئیں۔'],
    },
    stress: ['neck', 'back'],
    figure: {
      head: [52, 176],
      sh: [70, 176],
      hip: [120, 146],
      arms: [
        { j: [96, 181], e: [120, 182] },
        { j: [94, 182], e: [118, 183] },
      ],
      legs: [
        { j: [160, 134], e: [154, 183] },
        { j: [156, 134], e: [150, 184] },
      ],
    },
  },

  twist: {
    id: 'twist',
    sanskrit: 'Supta Matsyendrasana',
    name: { en: 'Reclined Twist', ur: 'لیٹ کر مروڑ' },
    purpose: { en: 'Gently releases the spine and hips.', ur: 'ریڑھ کی ہڈی اور کولہوں کو نرمی سے ڈھیلا کرتا ہے۔' },
    start: { en: 'Lie on your back and hug your knees to your chest.', ur: 'کمر کے بل لیٹیں اور گھٹنے سینے سے لگائیں۔' },
    steps: {
      en: ['Open your arms out to the sides.', 'Let both knees fall slowly to the right.', 'Turn your head gently to the left if comfortable. Switch sides.'],
      ur: ['بازو دونوں طرف پھیلائیں۔', 'دونوں گھٹنے آہستہ سے دائیں طرف گرنے دیں۔', 'آرام دہ ہو تو سر نرمی سے بائیں طرف موڑیں۔ پھر طرف بدلیں۔'],
    },
    breath: { en: 'Slow breaths; let each exhale help you relax into the twist.', ur: 'آہستہ سانس؛ ہر سانس کے باہر نکلنے کے ساتھ مروڑ میں ڈھیلے ہوں۔' },
    hold: { en: '5–10 breaths each side.', ur: 'ہر طرف 5 سے 10 سانس۔' },
    alignment: {
      en: ['Both shoulders stay heavy on the mat', 'Knees stacked', 'Twist gently — no forcing'],
      ur: ['دونوں کندھے میٹ پر رہیں', 'گھٹنے ایک دوسرے کے اوپر', 'نرمی سے مروڑیں — زور نہیں'],
    },
    mistakes: { en: ['Forcing the knees to the floor', 'Lifting the opposite shoulder high'], ur: ['گھٹنے زبردستی زمین پر لگانا', 'دوسرا کندھا بہت اٹھا لینا'] },
    modification: { en: 'Place a cushion under the knees.', ur: 'گھٹنوں کے نیچے کشن رکھیں۔' },
    advanced: { en: 'Straighten the top leg and hold the foot with the hand.', ur: 'اوپر والی ٹانگ سیدھی کریں اور پاؤں ہاتھ سے پکڑیں۔' },
    cues: {
      en: ['Let your knees be heavy.', 'Slowly exhale.', 'Only move within a comfortable range of motion.'],
      ur: ['گھٹنوں کو بھاری ہونے دیں۔', 'آہستہ سے سانس باہر نکالیں۔', 'صرف آرام دہ حد تک حرکت کریں۔'],
    },
    stress: ['back'],
    figure: {
      head: [40, 174],
      sh: [58, 178],
      hip: [110, 179],
      arms: [
        { j: [44, 164], e: [28, 156] },
        { j: [80, 182], e: [100, 183] },
      ],
      legs: [
        { j: [144, 162], e: [124, 181] },
        { j: [140, 166], e: [118, 183] },
      ],
    },
  },

  savasana: {
    id: 'savasana',
    sanskrit: 'Savasana',
    name: { en: 'Savasana (Final Relaxation)', ur: 'شواسن (مکمل آرام)' },
    purpose: { en: 'Lets the body absorb the practice and the mind rest.', ur: 'جسم کو مشق جذب کرنے اور ذہن کو آرام کرنے دیتا ہے۔' },
    start: { en: 'Lie flat on your back, legs relaxed, arms a little away from your body.', ur: 'کمر کے بل سیدھا لیٹیں، ٹانگیں ڈھیلی، بازو جسم سے تھوڑا دور۔' },
    steps: {
      en: ['Turn your palms up.', 'Close your eyes.', 'Let the whole body become heavy and still.'],
      ur: ['ہتھیلیاں اوپر کی طرف موڑیں۔', 'آنکھیں بند کریں۔', 'پورے جسم کو بھاری اور ساکن ہونے دیں۔'],
    },
    breath: { en: 'Natural breathing — no control needed.', ur: 'قدرتی سانس — کسی کنٹرول کی ضرورت نہیں۔' },
    hold: { en: '2–10 minutes.', ur: '2 سے 10 منٹ۔' },
    alignment: {
      en: ['Body symmetrical', 'Jaw and face relaxed', 'Shoulders soft'],
      ur: ['جسم دونوں طرف برابر', 'جبڑا اور چہرہ ڈھیلا', 'کندھے نرم'],
    },
    mistakes: { en: ['Fidgeting', 'Getting up too quickly afterwards'], ur: ['بار بار ہلنا', 'بعد میں بہت جلدی اٹھنا'] },
    modification: { en: 'Put a cushion under your knees if your lower back feels tight.', ur: 'اگر نچلی کمر میں کھنچاؤ ہو تو گھٹنوں کے نیچے کشن رکھیں۔' },
    advanced: { en: 'Scan slowly from toes to head, relaxing each part.', ur: 'پاؤں سے سر تک آہستہ آہستہ ہر حصے کو ڈھیلا کریں۔' },
    cues: {
      en: ['Let your whole body relax.', 'Breathe naturally.', 'Nothing to do now — just rest.'],
      ur: ['پورے جسم کو ڈھیلا چھوڑ دیں۔', 'قدرتی سانس لیں۔', 'اب کچھ نہیں کرنا — بس آرام کریں۔'],
    },
    stress: [],
    figure: {
      head: [40, 174],
      sh: [58, 178],
      hip: [114, 180],
      arms: [
        { j: [84, 180], e: [106, 181] },
        { j: [84, 182], e: [108, 183] },
      ],
      legs: [
        { j: [150, 181], e: [186, 180] },
        { j: [150, 182], e: [188, 182] },
      ],
    },
  },
};

// Pose candidates per session section, in priority order, for each goal.
const PLAN: Record<Goal, Record<Section, string[]>> = {
  flexibility: { warmup: ['breathing'], mobility: ['catCow', 'sideStretch', 'neck'], main: ['downDog', 'forwardFold', 'warrior2'], strength: ['bridge', 'cobra'], cooldown: ['twist', 'child'], relax: ['savasana'] },
  mobility: { warmup: ['breathing'], mobility: ['neck', 'catCow', 'sideStretch'], main: ['downDog', 'warrior2', 'forwardFold'], strength: ['bridge', 'chair'], cooldown: ['twist', 'child'], relax: ['savasana'] },
  relaxation: { warmup: ['breathing'], mobility: ['neck', 'sideStretch', 'catCow'], main: ['child', 'forwardFold'], strength: ['bridge'], cooldown: ['twist'], relax: ['savasana'] },
  stress: { warmup: ['breathing'], mobility: ['neck', 'catCow', 'sideStretch'], main: ['forwardFold', 'child'], strength: ['tree', 'bridge'], cooldown: ['twist'], relax: ['savasana'] },
  balance: { warmup: ['breathing'], mobility: ['catCow', 'neck'], main: ['mountain', 'warrior2'], strength: ['tree', 'chair'], cooldown: ['child', 'twist'], relax: ['savasana'] },
  fitness: { warmup: ['breathing'], mobility: ['catCow', 'sideStretch'], main: ['downDog', 'warrior2', 'chair'], strength: ['cobra', 'bridge', 'tree'], cooldown: ['child', 'twist'], relax: ['savasana'] },
  morning: { warmup: ['breathing'], mobility: ['catCow', 'sideStretch', 'neck'], main: ['mountain', 'forwardFold', 'downDog', 'warrior2'], strength: ['chair', 'tree'], cooldown: ['child'], relax: ['savasana'] },
  evening: { warmup: ['breathing'], mobility: ['neck', 'catCow'], main: ['forwardFold', 'child'], strength: ['bridge'], cooldown: ['twist'], relax: ['savasana'] },
  desk: { warmup: ['breathing'], mobility: ['neck', 'sideStretch', 'catCow'], main: ['mountain', 'forwardFold', 'downDog'], strength: ['cobra', 'bridge'], cooldown: ['twist', 'child'], relax: ['savasana'] },
};

// Share of the session given to each section.
const SPLIT: [Section, number][] = [
  ['warmup', 0.1],
  ['mobility', 0.2],
  ['main', 0.3],
  ['strength', 0.2],
  ['cooldown', 0.1],
  ['relax', 0.1],
];

export const SECTION_LABEL: Record<Section, Text> = {
  warmup: { en: 'Warm-up', ur: 'وارم اپ' },
  mobility: { en: 'Mobility', ur: 'لچک' },
  main: { en: 'Main Poses', ur: 'اہم آسن' },
  strength: { en: 'Strength & Balance', ur: 'طاقت اور توازن' },
  cooldown: { en: 'Cool-down', ur: 'ٹھنڈا ہونا' },
  relax: { en: 'Relaxation', ur: 'آرام' },
};

export type Step = { pose: Pose; section: Section; seconds: number };

// Builds a session whose pose durations add up to exactly `minutes`.
export function buildSession(opts: { minutes: number; goal: Goal; level: Level; avoid: Limitation[] }): { steps: Step[]; skipped: string[] } {
  const total = Math.max(5, Math.round(opts.minutes)) * 60;
  const perPose = opts.level === 'beginner' ? 120 : opts.level === 'intermediate' ? 100 : 90; // target seconds per pose
  const plan = PLAN[opts.goal];
  const skipped = new Set<string>();
  const ok = (id: string) => {
    const bad = POSES[id].stress.some((s) => opts.avoid.includes(s));
    if (bad) skipped.add(id);
    return !bad;
  };

  const sections: { section: Section; ids: string[]; seconds: number }[] = [];
  for (const [section, share] of SPLIT) {
    let seconds = total * share;
    let pool = plan[section].filter(ok);
    // Fall back to gentle poses that are safe for everyone.
    if (!pool.length) pool = section === 'relax' ? ['savasana'] : ['breathing', 'sideStretch', 'savasana'].filter(ok).slice(0, 1);
    const count = Math.max(1, Math.min(pool.length, Math.round(seconds / perPose)));
    sections.push({ section, ids: pool.slice(0, count), seconds });
  }

  const steps: Step[] = [];
  for (const s of sections) {
    const each = Math.max(15, Math.round(s.seconds / s.ids.length / 5) * 5);
    for (const id of s.ids) steps.push({ pose: POSES[id], section: s.section, seconds: each });
  }
  // Absorb rounding into the final relaxation so the session fits exactly.
  const used = steps.reduce((a, s) => a + s.seconds, 0);
  steps[steps.length - 1].seconds = Math.max(15, steps[steps.length - 1].seconds + (total - used));
  const drift = total - steps.reduce((a, s) => a + s.seconds, 0);
  if (drift) steps[0].seconds = Math.max(15, steps[0].seconds + drift);

  return { steps, skipped: [...skipped].map((id) => POSES[id].name.en) };
}
