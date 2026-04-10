type Insight = {
  title: string;
  value: string;
  note: string;
};

export default function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft backdrop-blur transition hover:border-brand-500/30 hover:bg-slate-900/95">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{insight.title}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{insight.value}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-400">{insight.note}</p>
    </div>
  );
}
