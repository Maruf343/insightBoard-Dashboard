type Activity = {
  user: string;
  action: string;
  value: string;
  time: string;
};

export default function ActivityTable({ activity, loading }: { activity?: Activity[]; loading?: boolean }) {
  return (
    <div className="rounded-3xl border border-panel bg-panel p-6 shadow-panel transition duration-300 hover:-translate-y-0.5 hover:border-brand/30">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-muted">Recent activity</p>
          <h2 className="mt-2 text-xl font-semibold">Live updates</h2>
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-sm text-muted">Real-time</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-muted">
          <thead>
            <tr className="border-b border-panel text-muted">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Activity</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse bg-surface">
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 rounded-full bg-panel" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-40 rounded-full bg-panel" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 rounded-full bg-panel" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-20 rounded-full bg-panel" />
                  </td>
                </tr>
              ))
            ) : activity && activity.length > 0 ? (
              activity.map((entry) => (
                <tr key={`${entry.user}-${entry.time}`} className="transition hover:bg-surface">
                  <td className="py-4 px-4 font-medium text-base">{entry.user}</td>
                  <td className="py-4 px-4 text-muted">{entry.action}</td>
                  <td className="py-4 px-4 text-base">{entry.value}</td>
                  <td className="py-4 px-4 text-muted">{entry.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 px-4 text-center text-sm text-muted">
                  No recent activity available. Try changing the segment filter or refresh the dashboard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
