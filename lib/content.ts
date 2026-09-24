export type Language = 'en' | 'ur';

export type ContentRow = {
  id: string; slug: string; content_type: string; difficulty: string | null;
  age_min: number | null; age_max: number | null; estimated_minutes: number | null;
  featured: boolean; subject_id: string | null; icon?: string | null;
  subjects?: { slug: string; name: string; icon: string | null } | null;
  content_translations?: { language: string; title: string; summary: string | null; body: string | null }[];
  // Supabase returns an object for a to-one embed (unique FK) on newer clients,
  // but an array on some setups — we normalize for both in lessonExtras() below.
  lessons?:
    | { learning_objectives: string[] | null; key_points: string[] | null }
    | { learning_objectives: string[] | null; key_points: string[] | null }[]
    | null;
  quizzes?: QuizRow | QuizRow[] | null;
  activities?: ActivityRow | ActivityRow[] | null;
  experiments?: ExperimentRow | ExperimentRow[] | null;
};

export type QuizAnswer = { id: string; answer_order: number; answer_en: string; answer_ur: string | null; is_correct: boolean };
export type QuizQuestion = {
  id: string; question_order: number; question_en: string; question_ur: string | null;
  explanation_en: string | null; explanation_ur: string | null; quiz_answers: QuizAnswer[];
};
export type QuizRow = { id: string; passing_score: number; quiz_questions: QuizQuestion[] };
export type ActivityRow = { instructions: unknown; materials: unknown; safety_notes: unknown };
export type ExperimentRow = { materials: unknown; steps: unknown; safety_notes: unknown; observation_questions: unknown };

// The embedded one-to-one tables can come back as an object or a one-item array.
function one<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

// jsonb list columns should be arrays of strings, but tolerate {text|en} objects.
export function strList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((i) => (typeof i === 'string' ? i : (i as any)?.text ?? (i as any)?.en ?? ''))
    .filter((i): i is string => typeof i === 'string' && i.trim().length > 0);
}

export function quizOf(row: ContentRow): QuizRow | null {
  const q = one(row.quizzes);
  if (!q) return null;
  const questions = [...(q.quiz_questions ?? [])]
    .sort((a, b) => a.question_order - b.question_order)
    .map((qq) => ({ ...qq, quiz_answers: [...(qq.quiz_answers ?? [])].sort((a, b) => a.answer_order - b.answer_order) }));
  return { ...q, quiz_questions: questions };
}

export function activityOf(row: ContentRow) {
  const a = one(row.activities);
  if (!a) return null;
  const out = { instructions: strList(a.instructions), materials: strList(a.materials), safety: strList(a.safety_notes) };
  return out.instructions.length || out.materials.length || out.safety.length ? out : null;
}

export function experimentOf(row: ContentRow) {
  const e = one(row.experiments);
  if (!e) return null;
  const out = {
    materials: strList(e.materials), steps: strList(e.steps),
    safety: strList(e.safety_notes), questions: strList(e.observation_questions),
  };
  return out.materials.length || out.steps.length || out.safety.length || out.questions.length ? out : null;
}

export type MagazineArticleRow = { article_order: number; content: ContentRow | null };
export type MagazineIssueRow = {
  id: string; issue_number: number; slug: string; cover_image_url: string | null;
  published_date: string | null; published: boolean;
  title_en: string | null; title_ur: string | null; summary_en: string | null; summary_ur: string | null;
  magazine_articles?: MagazineArticleRow[];
};

export function issueTitle(issue: MagazineIssueRow, lang: Language = 'en') {
  const byLang = lang === 'ur' ? issue.title_ur : issue.title_en;
  return byLang ?? issue.title_en ?? `Issue ${issue.issue_number}`;
}

export function issueSummary(issue: MagazineIssueRow, lang: Language = 'en') {
  return (lang === 'ur' ? issue.summary_ur : issue.summary_en) ?? issue.summary_en ?? '';
}

export function issueArticles(issue: MagazineIssueRow): ContentRow[] {
  return [...(issue.magazine_articles ?? [])]
    .sort((a, b) => a.article_order - b.article_order)
    .map((a) => a.content)
    .filter((c): c is ContentRow => !!c);
}

export function translated(row: ContentRow, language: Language = 'en') {
  const list = row.content_translations ?? [];
  return list.find(t => t.language === language) ?? list.find(t => t.language === 'en') ?? list[0] ?? {title: row.slug, summary: '', body: ''};
}

/**
 * Pulls the real learning_objectives / key_points for this piece of content
 * (from the `lessons` table) instead of showing generic placeholder text.
 * Returns null if there's nothing real to show, so the UI can skip the section
 * entirely rather than render empty/fake boxes.
 */
export function lessonExtras(row: ContentRow) {
  const raw = row.lessons;
  if (!raw) return null;
  const lesson = Array.isArray(raw) ? raw[0] : raw;
  if (!lesson) return null;

  const objectives = Array.isArray(lesson.learning_objectives) ? lesson.learning_objectives : [];
  const points = Array.isArray(lesson.key_points) ? lesson.key_points : [];

  if (!objectives.length && !points.length) return null;
  return { objectives, points };
}
