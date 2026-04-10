type Breakdown = {
  country: string;
  share: number;
  signups: string;
};

export default function BreakdownPanel({ data }: { data: Breakdown[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Users by country</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Regional adoption</h2>
        </div>
        <span className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-300">Top markets</span>
      </div>

      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div key={item.country} className="space-y-3 rounded-3xl bg-slate-950/80 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{item.country}</p>
                <p className="text-sm text-slate-400">{item.signups} signups</p>
              </div>
              <p className="text-sm font-semibold text-brand-100">{item.share}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${item.share}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
