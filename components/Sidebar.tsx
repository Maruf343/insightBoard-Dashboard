import Link from 'next/link';

const sections = [
  { label: 'Overview', href: '/dashboard', active: true },
  { label: 'Customers', href: '/dashboard', active: false },
  { label: 'Revenue', href: '/dashboard', active: false },
  { label: 'Insights', href: '/dashboard', active: false },
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen flex-col justify-between border-r border-white/10 bg-slate-950/90 px-6 py-8 text-slate-300 shadow-soft backdrop-blur lg:px-6 xl:px-8">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">InsightBoard</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Analytics</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            All of your business metrics in one elegant workspace.
          </p>
        </div>

        <nav className="space-y-2">
          {sections.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                item.active ? 'bg-slate-900 text-white shadow-soft' : 'text-slate-400 hover:bg-slate-900/70 hover:text-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-5 text-sm text-slate-300">
        <p className="text-slate-400">Heads up</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Monthly recurring revenue is up 16% while churn remains steady. Keep an eye on product adoption next.
        </p>
      </div>
    </aside>
  );
}
