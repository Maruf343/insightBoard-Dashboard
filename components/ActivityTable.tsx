import { motion } from 'framer-motion';

export type Activity = {
  id: string;
  user: string;
  action: string;
  value: string;
  time: string;
  segment: string;
};

type ActivityTableProps = {
  activity?: Activity[];
  loading?: boolean;
  sortField: keyof Activity;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Activity) => void;
  onEdit: (entry: Activity) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
  liveMode: boolean;
};

const headerCells: Array<{ field: keyof Activity; label: string }> = [
  { field: 'user', label: 'User' },
  { field: 'action', label: 'Activity' },
  { field: 'value', label: 'Value' },
  { field: 'time', label: 'When' },
  { field: 'segment', label: 'Segment' },
];

function sortIndicator(field: keyof Activity, activeField: keyof Activity, direction: 'asc' | 'desc') {
  if (field !== activeField) return '⇅';
  return direction === 'asc' ? '↑' : '↓';
}

export default function ActivityTable({
  activity,
  loading,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearch,
  liveMode,
}: ActivityTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-[32px] border border-panel bg-panel p-6 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-brand/30"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-muted">Recent activity</p>
          <h2 className="mt-2 text-xl font-semibold">Live updates</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full border border-panel px-3 py-1 text-sm font-medium transition ${liveMode ? 'bg-brand-soft text-brand' : 'bg-surface text-muted'}`}>
            {liveMode ? 'Live mode' : 'Snapshot mode'}
          </span>
          <div className="rounded-full border border-panel bg-surface px-4 py-2 text-sm text-muted shadow-sm">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="relative block w-full">
          <span className="sr-only">Search activity</span>
          <input
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search activity..."
            className="w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
          />
        </label>
        <div className="rounded-3xl border border-panel bg-surface p-3 text-sm text-muted">
          <p className="font-semibold text-base text-white">Sort by</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {headerCells.map((header) => (
              <button
                key={header.field}
                type="button"
                onClick={() => onSort(header.field)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  sortField === header.field ? 'bg-brand-soft text-brand' : 'bg-panel text-muted hover:bg-slate-800'
                }`}
              >
                {header.label} {sortIndicator(header.field, sortField, sortDirection)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-muted">
          <thead>
            <tr className="border-b border-panel text-muted">
              {headerCells.map((header) => (
                <th key={header.field} className="py-3 px-4">
                  {header.label}
                </th>
              ))}
              <th className="py-3 px-4 text-right">Actions</th>
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
                  <td className="py-4 px-4">
                    <div className="h-4 w-16 rounded-full bg-panel" />
                  </td>
                </tr>
              ))
            ) : activity && activity.length > 0 ? (
              activity.map((entry) => (
                <tr key={entry.id} className="transition hover:bg-surface">
                  <td className="py-4 px-4 font-medium text-base">{entry.user}</td>
                  <td className="py-4 px-4 text-muted">{entry.action}</td>
                  <td className="py-4 px-4 text-base">{entry.value}</td>
                  <td className="py-4 px-4 text-muted">{entry.time}</td>
                  <td className="py-4 px-4 text-muted">{entry.segment}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      className="rounded-full border border-panel bg-surface px-3 py-2 text-sm font-medium transition hover:bg-brand/10"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center text-sm text-muted">
                  No activity matches your current filters. Try clearing search or selecting a different segment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted">
          Showing {activity?.length ?? 0} total item{activity?.length === 1 ? '' : 's'}.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="rounded-full border border-panel bg-surface px-4 py-2 text-sm transition hover:border-brand hover:bg-panel"
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="rounded-full border border-panel bg-surface px-4 py-2 text-sm transition hover:border-brand hover:bg-panel"
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
