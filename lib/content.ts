export type Language = 'en' | 'ur';

export type ContentRow = {
  id: string; slug: string; content_type: string; difficulty: string | null;
  age_min: number | null; age_max: number | null; estimated_minutes: number | null;
  featured: boolean; subject_id: string | null;
  subjects?: { slug: string; name: string; icon: string | null } | null;
  content_translations?: { language: string; title: string; summary: string | null; body: string | null }[];
  // Supabase returns an object for a to-one embed (unique FK) on newer clients,
  // but an array on some setups — we normalize for both in lessonExtras() below.
  lessons?:
    | { learning_objectives: string[] | null; key_points: string[] | null }
    | { learning_objectives: string[] | null; key_points: string[] | null }[]
    | null;
};

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
