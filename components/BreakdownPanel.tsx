type Breakdown = {
  country: string;
  share: number;
  signups: string;
};

export default function BreakdownPanel({ data, loading }: { data?: Breakdown[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-panel bg-panel p-6 shadow-panel">
        <div className="h-10 w-3/4 rounded-full bg-surface" />
        <div className="mt-6 space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-3 rounded-3xl bg-surface p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-full bg-panel" />
                  <div className="h-3 w-24 rounded-full bg-panel" />
                </div>
                <div className="h-5 w-10 rounded-full bg-panel" />
              </div>
              <div className="h-2 rounded-full bg-panel" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div className="rounded-3xl border border-panel bg-panel p-6 text-center shadow-panel">
        <p className="text-sm uppercase tracking-[0.32em] text-muted">Users by country</p>
        <h2 className="mt-2 text-xl font-semibold">Regional adoption</h2>
        <p className="mt-4 text-sm text-muted">No regional breakdown data is available. Connect a data source to populate this chart.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-panel bg-panel p-6 shadow-panel transition duration-300 hover:-translate-y-0.5 hover:border-brand/30">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-muted">Users by country</p>
          <h2 className="mt-2 text-xl font-semibold">Regional adoption</h2>
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-sm text-muted">Top markets</span>
      </div>

      <div className="mt-6 space-y-4">
        {data?.map((item) => (
          <div key={item.country} className="space-y-3 rounded-3xl bg-surface p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{item.country}</p>
                <p className="text-sm text-muted">{item.signups} signups</p>
              </div>
              <p className="text-sm font-semibold text-brand">{item.share}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-panel">
              <div className="h-full rounded-full bg-brand" style={{ width: `${item.share}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
