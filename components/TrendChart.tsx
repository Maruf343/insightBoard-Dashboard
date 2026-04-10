import type { CSSProperties } from 'react';

type TrendPoint = {
  label: string;
  value: number;
};

const points: TrendPoint[] = [
  { label: 'Jan', value: 48 },
  { label: 'Feb', value: 54 },
  { label: 'Mar', value: 60 },
  { label: 'Apr', value: 66 },
  { label: 'May', value: 72 },
  { label: 'Jun', value: 80 },
  { label: 'Jul', value: 78 },
  { label: 'Aug', value: 84 },
  { label: 'Sep', value: 92 },
  { label: 'Oct', value: 100 },
  { label: 'Nov', value: 112 },
  { label: 'Dec', value: 128 },
];

export default function TrendChart({ loading }: { loading?: boolean }) {
  const maxValue = Math.max(...points.map((point) => point.value));

  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-panel bg-panel p-6 shadow-panel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-surface" />
            <div className="h-5 w-52 rounded-full bg-surface" />
          </div>
          <div className="h-12 w-28 rounded-3xl bg-surface" />
        </div>
        <div className="mt-8 h-72 rounded-[2rem] bg-surface" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-panel bg-panel p-6 shadow-panel transition duration-300 hover:-translate-y-0.5 hover:border-brand/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-muted">Trend</p>
          <h2 className="mt-2 text-2xl font-semibold">Revenue growth</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Weekly revenue and activation trends across the product funnel.
          </p>
        </div>
        <div className="rounded-3xl bg-surface px-4 py-3 text-sm">
          <p className="text-muted">Current run rate</p>
          <p className="mt-1 text-lg font-semibold">$124.8K</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-surface/80 p-4 sm:p-6">
        <div className="relative h-72 w-full">
          <div className="absolute inset-x-0 top-4 flex justify-between text-xs text-muted">
            <span>140</span>
            <span>120</span>
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 top-12 opacity-40">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="absolute left-0 right-0 top-[calc(20%*var(--i))] border-t border-surface/20" style={{ '--i': index } as CSSProperties} />
            ))}
          </div>
          <svg className="relative h-full w-full" viewBox="0 0 120 72" preserveAspectRatio="none">
            <path
              d={points
                .map((point, index) => {
                  const x = (index / (points.length - 1)) * 120;
                  const y = 72 - (point.value / maxValue) * 72;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="2.5"
            />
            <path
              d={`${points
                .map((point, index) => {
                  const x = (index / (points.length - 1)) * 120;
                  const y = 72 - (point.value / maxValue) * 72;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                })} L 120 72 L 0 72 Z`}
              fill="rgba(99, 102, 241, 0.18)"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-muted">
            {points.map((point) => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
