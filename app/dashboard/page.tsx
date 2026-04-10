import { analyticsMetrics } from '../../data/metrics';
import { countryBreakdown } from '../../data/breakdown';
import { recentActivity } from '../../data/recentActivity';
import Sidebar from '../../components/Sidebar';
import MetricCard from '../../components/MetricCard';
import TrendChart from '../../components/TrendChart';
import BreakdownPanel from '../../components/BreakdownPanel';
import ActivityTable from '../../components/ActivityTable';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:gap-8">
        <Sidebar />
        <main className="space-y-8 px-6 pb-10 pt-6 sm:px-8 xl:px-12">
          <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft backdrop-blur sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Business analytics</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Revenue & growth overview</h1>
                <p className="mt-3 max-w-2xl text-slate-400">
                  Monitor your main KPIs, track engagement trends, and see where your business is headed.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800/90">
                  Last 30 days
                </button>
                <button className="rounded-full border border-slate-700 bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400">
                  Export report
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {analyticsMetrics.map((metric) => (
              <MetricCard key={metric.title} metric={metric} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <TrendChart />
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Growth snapshot</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Performance highlights</h2>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-300">+12% goal</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Avg. revenue per user</p>
                    <p className="mt-3 text-2xl font-semibold text-white">$152</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Weekly retention</p>
                    <p className="mt-3 text-2xl font-semibold text-white">82.1%</p>
                  </div>
                </div>
              </div>

              <BreakdownPanel data={countryBreakdown} />
            </div>
          </section>

          <section>
            <ActivityTable activity={recentActivity} />
          </section>
        </main>
      </div>
    </div>
  );
}
