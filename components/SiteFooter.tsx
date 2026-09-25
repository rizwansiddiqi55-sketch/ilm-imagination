import Link from 'next/link';

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: 'Explore',
    links: [
      ['Stories', '/stories'],
      ['Subjects', '/subjects'],
      ['Activities', '/activities'],
      ['Experiments', '/experiments'],
      ['Quizzes', '/quizzes'],
      ['Magazine', '/magazine'],
    ],
  },
  {
    title: 'Subjects',
    links: [
      ['Mathematics', '/math'],
      ['Biology', '/biology'],
      ['Physics', '/physics'],
      ['Chemistry', '/chemistry'],
      ['Computer Science', '/computer-science'],
      ['Sports', '/sports'],
      ['Artificial Intelligence', '/ai'],
    ],
  },
  {
    title: 'More',
    links: [
      ['Daily Challenge', '/daily-challenge'],
      ['Ask Ilm', '/ask-ilm'],
      ['Badges', '/badges'],
      ['For Parents', '/parent'],
      ['Privacy & Safety', '/privacy'],
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-xl">💡</span>
              <span>
                <b className="block text-lg tracking-tight">Ilm &amp; Imagination</b>
                <small className="block text-xs text-slate-500">Learn • Explore • Imagine • Discover</small>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
              A bilingual English and Urdu learning magazine for curious minds aged 10–16.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm font-semibold text-slate-600">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-indigo-600">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© {year} Ilm &amp; Imagination. All rights reserved.</p>
          <p>
            Website designed by{' '}
            <a
              href="https://www.linkedin.com/in/rizwansiddiqi/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-600 transition hover:text-indigo-600"
            >
              Rizwan Siddiqi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
