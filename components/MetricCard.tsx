type Metric = {
  title: string;
  value: string;
  trend: string;
  description: string;
  change: string;
};

export default function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-slate-900/95">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{metric.title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{metric.change}</span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-400">{metric.description}</p>
      <div className="mt-6 h-1 rounded-full bg-slate-800">
        <div className="h-full w-3/4 rounded-full bg-brand-500"></div>
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">{metric.trend}</p>
    </div>
  );
}
