type Metric = {
  title: string;
  value: string;
  trend: string;
  description: string;
  change: string;
};

export default function MetricCard({ metric, loading }: { metric?: Metric; loading?: boolean }) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-panel bg-panel p-6 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded-full bg-surface" />
            <div className="h-10 w-32 rounded-2xl bg-surface" />
          </div>
          <div className="h-8 w-16 rounded-full bg-surface" />
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-3 rounded-full bg-surface" />
          <div className="h-3 rounded-full bg-surface w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-panel bg-panel p-6 shadow-panel transition duration-300 hover:-translate-y-0.5 hover:border-brand/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{metric?.title}</p>
          <p className="mt-3 text-3xl font-semibold">{metric?.value}</p>
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-sm text-muted">{metric?.change}</span>
      </div>
      <p className="mt-5 text-sm leading-6 text-muted">{metric?.description}</p>
      <div className="mt-6 h-1 rounded-full bg-surface">
        <div className="h-full w-3/4 rounded-full bg-brand" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-muted">{metric?.trend}</p>
    </div>
  );
}
