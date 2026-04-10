import { motion } from 'framer-motion';

type Metric = {
  title: string;
  value: string;
  change: string;
  comparison: string;
  description: string;
  trend: string;
  trendDirection: 'up' | 'down';
};

export default function MetricCard({ metric, loading }: { metric?: Metric; loading?: boolean }) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-[32px] border border-panel bg-panel p-6 shadow-soft">
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="rounded-[32px] border border-panel bg-panel p-6 shadow-soft transition duration-300 hover:border-brand/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-muted">{metric?.title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{metric?.value}</p>
        </div>
        <span className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-muted shadow-sm">
          {metric?.change}
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-muted">{metric?.description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-panel bg-surface/90 px-4 py-3 text-sm backdrop-blur-sm">
        <span
          className={`rounded-full px-3 py-1 font-semibold ${
            metric?.trendDirection === 'up'
              ? 'bg-emerald-500/15 text-emerald-200'
              : 'bg-rose-500/15 text-rose-200'
          }`}
        >
          {metric?.trendDirection === 'up' ? 'Improving' : 'Softening'}
        </span>
        <span className="text-muted">{metric?.comparison}</span>
      </div>
      <div className="mt-6 h-1 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: metric?.change.includes('%') ? `${Math.min(100, parseFloat(metric.change.replace(/[+%]/g, '')) * 4)}%` : '75%' }}
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted">{metric?.trend}</p>
    </motion.div>
  );
}
