type Activity = {
  user: string;
  action: string;
  value: string;
  time: string;
};

export default function ActivityTable({ activity }: { activity: Activity[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-soft backdrop-blur">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Recent activity</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Live updates</h2>
        </div>
        <span className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-300">Real-time</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-500">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Activity</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {activity.map((entry) => (
              <tr key={`${entry.user}-${entry.time}`} className="transition hover:bg-slate-950/80">
                <td className="py-4 px-4 font-medium text-white">{entry.user}</td>
                <td className="py-4 px-4 text-slate-400">{entry.action}</td>
                <td className="py-4 px-4 text-slate-300">{entry.value}</td>
                <td className="py-4 px-4 text-slate-400">{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
