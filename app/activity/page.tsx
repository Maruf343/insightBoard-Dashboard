'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebase';
import type { User } from 'firebase/auth';

type ActivityLog = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string | null;
  createdAt: string;
};

export default function ActivityPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async (requestedPage = 1) => {
    if (!currentUser) return;
    const params = new URLSearchParams({
      userId: currentUser.uid,
      page: String(requestedPage),
      pageSize: String(pageSize),
    });
    if (keyword) params.set('keyword', keyword);

    const response = await fetch(`/api/activity?${params.toString()}`);
    if (!response.ok) return;
    const payload = await response.json();
    setLogs(payload.logs);
    setTotal(payload.total);
    setPage(payload.page);
  }, [currentUser, keyword, pageSize]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function initAuth() {
      const { auth } = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isMounted) return;
        setCurrentUser(user);
        setAuthLoading(false);
      });
    }

    initAuth();
    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (currentUser) fetchLogs(1);
  }, [currentUser, fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const visibleLogs = useMemo(() => logs, [logs]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 rounded-[2rem] border border-panel bg-panel/95 p-8 shadow-panel">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-lg font-semibold">Checking authentication...</p>
            <p className="max-w-md text-sm text-muted">Loading your activity log.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-panel bg-panel/95 p-8 text-center shadow-panel">
          <p className="text-lg font-semibold">Sign in to view your activity log.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base px-6 py-10 text-base text-white sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="rounded-[32px] border border-panel bg-panel/95 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.28em] text-muted">Activity log</p>
          <h1 className="mt-3 text-4xl font-semibold">Track your actions</h1>
          <p className="mt-4 max-w-2xl text-muted">All create, update, and delete events are recorded and user-scoped in your Neon Postgres database.</p>
        </div>

        <div className="rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Search logs</p>
              <h2 className="mt-2 text-2xl font-semibold">Recent actions</h2>
            </div>
            <div className="w-full max-w-md">
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search actions, entities, details"
                className="w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-muted">
              <thead>
                <tr className="border-b border-panel text-sm uppercase tracking-[0.24em] text-muted">
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel">
                {visibleLogs.length > 0 ? (
                  visibleLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/90">
                      <td className="px-4 py-4 font-semibold text-white">{log.action}</td>
                      <td className="px-4 py-4 text-muted">{log.entity}</td>
                      <td className="px-4 py-4 text-muted">{log.details ?? '-'}</td>
                      <td className="px-4 py-4 text-muted">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted">
                      No activity logs found for the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                className="rounded-full border border-panel bg-surface px-4 py-2 text-sm text-white transition hover:bg-panel disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-panel bg-surface px-4 py-2 text-sm text-white transition hover:bg-panel disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
