import type { Figure, Limb, P } from '@/lib/yoga';

// Illustrated female instructor: modest long-sleeve top, full-length leggings, hair in a bun.
const SKIN = '#c98e6b';
const TOP = '#0d9488';
const TOP_FAR = '#0f766e';
const LEGS = '#334155';
const LEGS_FAR = '#1e293b';
const HAIR = '#2b1d16';

const pt = (p: P) => `${p[0]},${p[1]}`;
const unit = (a: P, b: P): P => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.hypot(dx, dy) || 1;
  return [dx / d, dy / d];
};

function Arm({ root, l, far }: { root: P; l: Limb; far?: boolean }) {
  const from = l.from ?? root;
  const c = far ? TOP_FAR : TOP;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polyline points={`${pt(from)} ${pt(l.j)} ${pt(l.e)}`} stroke={c} strokeWidth={9} />
      <circle cx={l.e[0]} cy={l.e[1]} r={4.2} fill={SKIN} />
    </g>
  );
}

function Leg({ root, l, far }: { root: P; l: Limb; far?: boolean }) {
  const from = l.from ?? root;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polyline points={`${pt(from)} ${pt(l.j)} ${pt(l.e)}`} stroke={far ? LEGS_FAR : LEGS} strokeWidth={12} />
      <circle cx={l.e[0]} cy={l.e[1]} r={4.8} fill={SKIN} />
    </g>
  );
}

export default function YogaFigure({ figure, label, className }: { figure: Figure; label: string; className?: string }) {
  const { head, sh, hip, mid, arms, legs } = figure;
  const spine = mid ? `M${pt(sh)} Q${pt(mid)} ${pt(hip)}` : `M${pt(sh)} L${pt(hip)}`;
  // Neck runs from the shoulders toward the head; bun sits on the crown, continuing that line.
  const u = unit(sh, head);
  const neckEnd: P = [head[0] - u[0] * 8, head[1] - u[1] * 8];
  const bun: P = [head[0] + u[0] * 11, head[1] + u[1] * 11];

  return (
    <svg viewBox="0 0 240 200" role="img" aria-label={label} className={className}>
      <defs>
        <linearGradient id="yoga-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f0fdfa" />
          <stop offset="1" stopColor="#ecfeff" />
        </linearGradient>
      </defs>
      <rect width="240" height="200" rx="18" fill="url(#yoga-bg)" />
      <circle cx="200" cy="40" r="18" fill="#fde68a" opacity=".55" />
      {/* mat */}
      <rect x="20" y="186" width="200" height="6" rx="3" fill="#a78bfa" opacity=".8" />

      <Arm root={sh} l={arms[0]} far />
      <Leg root={hip} l={legs[0]} far />

      {/* neck */}
      <line x1={sh[0]} y1={sh[1]} x2={neckEnd[0]} y2={neckEnd[1]} stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
      {/* torso: top over the chest, leggings waistband at the hip */}
      <path d={spine} stroke={TOP} strokeWidth={22} strokeLinecap="round" fill="none" />
      <circle cx={hip[0]} cy={hip[1]} r={10.5} fill={LEGS} />

      <Leg root={hip} l={legs[1]} />
      <Arm root={sh} l={arms[1]} />

      {/* head */}
      <circle cx={bun[0]} cy={bun[1]} r={5.5} fill={HAIR} />
      {/* hair cap toward the crown, face toward the neck */}
      <circle cx={head[0]} cy={head[1]} r={10} fill={HAIR} />
      <circle cx={head[0] - u[0] * 3} cy={head[1] - u[1] * 3} r={8} fill={SKIN} />
    </svg>
  );
}
