import Link from 'next/link';

const features = [
  {
    title: 'Live growth insights',
    description: 'See revenue, retention, and product adoption in one polished analytics workspace.',
  },
  {
    title: 'Segmented performance',
    description: 'Filter customers, campaigns, and product cohorts with instant comparison views.',
  },
  {
    title: 'Actionable activity feed',
    description: 'Track sales, customer touchpoints, and product events in a clean activity stream.',
  },
  {
    title: 'Fast onboarding',
    description: 'Ready-to-use dashboard structure with modern SaaS design and reusable components.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base px-6 py-8 text-base text-white sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <header className="flex flex-col gap-6 rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted">InsightBoard</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Analytics built for modern SaaS teams.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              Turn product metrics into clarity with a responsive dashboard, segment filtering, and realtime activity insights.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                Start free demo
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-panel bg-surface/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-surface"
              >
                View dashboard
              </Link>
            </div>
            <p className="text-sm text-muted">Firebase authentication, Tailwind UI, and Prisma-ready analytics.</p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6 rounded-[32px] border border-panel bg-panel/95 p-8 shadow-soft">
            <div className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
              Portfolio-ready SaaS analytics
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Build trust with a dashboard that feels like a real product.</h2>
              <p className="max-w-xl text-muted">
                Showcase your engineering and design skills with a working admin experience that includes metrics, growth insights, activity feeds, and interactive controls.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-surface/90 p-5 shadow-soft">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Revenue</p>
                <p className="mt-3 text-3xl font-semibold">$124K</p>
                <p className="mt-2 text-sm text-muted">Daily metrics with trend analysis and benchmarks.</p>
              </div>
              <div className="rounded-[28px] bg-surface/90 p-5 shadow-soft">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Retention</p>
                <p className="mt-3 text-3xl font-semibold">82%</p>
                <p className="mt-2 text-sm text-muted">Customer signals that drive better product decisions.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-panel bg-surface/95 p-8 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Live preview</p>
                <h3 className="mt-2 text-xl font-semibold">Overview snapshot</h3>
              </div>
              <span className="rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">Updated now</span>
            </div>
            <div className="mt-8 space-y-5">
              <div className="flex items-center justify-between rounded-3xl bg-base p-5">
                <div>
                  <p className="text-sm text-muted">Active users</p>
                  <p className="mt-2 text-2xl font-semibold">14.1K</p>
                </div>
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">+8%</span>
              </div>
              <div className="h-48 rounded-[28px] bg-base/80 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-muted">Conversion trend</p>
                  <p className="text-sm font-semibold">+7.2%</p>
                </div>
                <div className="flex h-32 items-end gap-2">
                  <span className="h-20 w-full rounded-full bg-brand/70" />
                  <span className="h-28 w-full rounded-full bg-brand/90" />
                  <span className="h-16 w-full rounded-full bg-brand/50" />
                  <span className="h-24 w-full rounded-full bg-brand/80" />
                  <span className="h-32 w-full rounded-full bg-brand/95" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[28px] border border-panel bg-panel/95 p-6 shadow-soft">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] border border-panel bg-panel/95 p-8 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Built for polished demos</p>
              <h2 className="mt-4 text-3xl font-semibold">Deliver an analytics experience that feels finished.</h2>
              <p className="mt-4 max-w-2xl text-muted">
                InsightBoard gives you a strong portfolio narrative: a real Next.js app with tailored dashboard interactions, authentication, and responsive layout.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-surface/90 p-5 shadow-soft">
                <p className="text-sm text-muted">Stack</p>
                <p className="mt-3 text-2xl font-semibold">Next.js + Tailwind</p>
              </div>
              <div className="rounded-[28px] bg-surface/90 p-5 shadow-soft">
                <p className="text-sm text-muted">Data</p>
                <p className="mt-3 text-2xl font-semibold">Firebase + Prisma</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="rounded-[32px] border border-panel bg-surface/95 p-6 text-center text-sm text-muted shadow-soft">
          Crafted as a portfolio-ready analytics dashboard with modern SaaS polish.
        </footer>
      </div>
    </main>
  );
}
