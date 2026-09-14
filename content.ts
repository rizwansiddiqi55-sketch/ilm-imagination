export type Language = 'en' | 'ur';
export type ContentRow = {
  id: string; slug: string; content_type: string; difficulty: string | null;
  age_min: number | null; age_max: number | null; estimated_minutes: number | null;
  featured: boolean; subject_id: string | null;
  subjects?: { slug: string; name: string; icon: string | null } | null;
  content_translations?: { language: string; title: string; summary: string | null; body: string | null }[];
};

export function translated(row: ContentRow, language: Language = 'en') {
  const list = row.content_translations ?? [];
  return list.find(t => t.language === language) ?? list.find(t => t.language === 'en') ?? list[0] ?? {title: row.slug, summary: '', body: ''};
}
