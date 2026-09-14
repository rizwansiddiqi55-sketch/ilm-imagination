import Link from "next/link";

const subjects = [
  { icon: "➗", name: "Mathematics", urdu: "ریاضی", href: "/math", text: "Numbers, logic, puzzles & real-world problem solving." },
  { icon: "🧬", name: "Biology", urdu: "حیاتیات", href: "/biology", text: "Explore cells, animals, plants and the human body." },
  { icon: "⚛️", name: "Physics", urdu: "طبیعیات", href: "/physics", text: "Discover motion, energy, light, sound and space." },
  { icon: "🧪", name: "Chemistry", urdu: "کیمسٹری", href: "/chemistry", text: "Meet atoms, elements, reactions and everyday chemistry." },
  { icon: "💻", name: "Computer Science", urdu: "کمپیوٹر سائنس", href: "/computer-science", text: "Learn coding, AI, algorithms, internet & cybersecurity." },
];

const features = [
  ["📖", "Stories", "Adventure, mystery, science fiction and inspiring stories.", "/stories"],
  ["🧠", "Brain Games", "Logic puzzles and challenges that make you think.", "/activities"],
  ["🔬", "Experiments", "Safe, age-appropriate ways to explore science.", "/experiments"],
  ["🏆", "Quizzes", "Test your knowledge and earn XP.", "/quizzes"],
];

const challenges = [
  { q: "What is 25% of 80?", a: "20", subject: "Math" },
  { q: "Which organ pumps blood around the body?", a: "The heart", subject: "Biology" },
  { q: "What force pulls objects toward Earth?", a: "Gravity", subject: "Physics" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-xl">💡</span>
            <span>
              <span className="block text-lg font-black tracking-tight">Ilm & Imagination</span>
              <span className="block text-xs font-medium text-slate-500">Learn • Explore • Imagine • Discover</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <Link href="/stories" className="hover:text-indigo-600">Stories</Link>
            <Link href="/activities" className="hover:text-indigo-600">Activities</Link>
            <Link href="/quizzes" className="hover:text-indigo-600">Quizzes</Link>
            <Link href="/magazine" className="hover:text-indigo-600">Magazine</Link>
            <Link href="/ask-ilm" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">Ask Ilm ✨</Link>
          </nav>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold">EN | اردو</button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-28">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">🌟 A smarter magazine for curious minds</div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Learn something amazing every day.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Stories become knowledge, questions become discoveries, and learning becomes an adventure — in English and اردو.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/stories" className="rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-950 shadow-lg">📖 Start Reading</Link>
              <Link href="/daily-challenge" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-extrabold backdrop-blur">🧠 Today's Challenge</Link>
            </div>
            <div className="mt-8 flex gap-7 text-sm text-slate-300">
              <span>👧 Ages 10–16</span><span>🌐 English + اردو</span><span>🔒 Kid-safe</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[2rem] bg-white p-6 text-slate-900 shadow-2xl md:translate-y-5">
              <div className="text-5xl">🧪</div><p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">Science Lab</p>
              <h3 className="mt-1 text-xl font-black">Why does ice float?</h3>
              <p className="mt-2 text-sm text-slate-500">Discover density with a simple experiment.</p>
            </div>
            <div className="rounded-[2rem] bg-indigo-500 p-6 shadow-2xl">
              <div className="text-5xl">🧠</div><p className="mt-6 text-xs font-bold uppercase tracking-wider text-indigo-100">Brain Booster</p>
              <h3 className="mt-1 text-xl font-black">Can you beat the clock?</h3>
              <p className="mt-2 text-sm text-indigo-100">Solve today's logic challenge and earn XP.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex items-end justify-between gap-4">
          <div><p className="font-bold text-indigo-600">EXPLORE</p><h2 className="mt-1 text-3xl font-black tracking-tight">Choose your adventure</h2></div>
          <Link href="/subjects" className="hidden text-sm font-bold text-indigo-600 md:block">View all →</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {subjects.map((s) => (
            <Link key={s.name} href={s.href} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="text-4xl">{s.icon}</div>
              <h3 className="mt-5 font-black">{s.name}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-400">{s.urdu}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">{s.text}</p>
              <span className="mt-5 block text-sm font-extrabold text-indigo-600">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-5 md:grid-cols-4">
            {features.map(([icon, title, text, href]) => (
              <Link href={href} key={title} className="rounded-3xl bg-slate-50 p-6 transition hover:bg-slate-100">
                <span className="text-4xl">{icon}</span><h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-50 to-cyan-50 p-7 md:p-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="font-bold text-indigo-600">🔥 DAILY CHALLENGE</p><h2 className="mt-1 text-3xl font-black">Think. Solve. Learn.</h2></div>
            <Link href="/daily-challenge" className="font-bold text-indigo-600">See today's full challenge →</Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {challenges.map((c) => (
              <div key={c.q} className="rounded-2xl bg-white p-5 shadow-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{c.subject}</span>
                <h3 className="mt-4 font-bold">{c.q}</h3>
                <details className="mt-4 text-sm"><summary className="cursor-pointer font-bold text-indigo-600">Reveal answer</summary><p className="mt-2 text-slate-600">{c.a}</p></details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 py-14 md:flex-row md:items-center">
          <div><p className="text-indigo-300 font-bold">🤖 ASK ILM</p><h2 className="mt-1 text-3xl font-black">Stuck on a question?</h2><p className="mt-2 max-w-xl text-slate-300">Get simple explanations, examples and hints in English or Urdu.</p></div>
          <Link href="/ask-ilm" className="rounded-2xl bg-white px-6 py-3 font-extrabold text-slate-900">Ask Ilm ✨</Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Ilm & Imagination. Learn • Explore • Imagine • Discover.</p>
          <div className="flex gap-5"><Link href="/parent">Parents</Link><Link href="/admin">Admin</Link><Link href="/privacy">Privacy & Safety</Link></div>
        </div>
      </footer>
    </main>
  );
}
