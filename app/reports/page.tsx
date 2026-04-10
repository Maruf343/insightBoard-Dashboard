'use client';

import { useEffect, useMemo, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebase';
import ReportBuilder from '../../components/ReportBuilder';
import type { User } from 'firebase/auth';

type ReportRecord = {
  id: string;
  title: string;
  userId: string;
  filters: { range: string; category: string; metrics: string[] };
  sections: string[];
  status: string;
  summary?: string;
  pdfUrl: string;
  createdAt: string;
};

export default function ReportsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function initAuthListener() {
      const { auth } = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isMounted) return;
        setAuthLoading(false);
        setCurrentUser(user);
      });
    }

    initAuthListener();
    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    fetchReports(currentUser.uid);
  }, [currentUser]);

  const fetchReports = async (userId: string) => {
    const response = await fetch(`/api/reports?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) return;
    const data = await response.json();
    setReports(data);
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [reports, searchQuery, statusFilter]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 rounded-[2rem] border border-panel bg-panel/95 p-8 shadow-panel">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-lg font-semibold">Checking authentication...</p>
            <p className="max-w-md text-sm text-muted">Loading your reports and user session.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-panel bg-panel/95 p-8 text-center shadow-panel">
          <p className="text-lg font-semibold">Please sign in to view your reports.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base px-6 py-10 text-base text-white sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-panel bg-panel/95 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-muted">Reports</p>
            <h1 className="mt-3 text-4xl font-semibold">Your generated reports</h1>
            <p className="mt-4 max-w-2xl text-muted">
              Build and manage custom PDF reports from your dashboard metrics, then download or review them anytime.
            </p>
          </div>

          <div className="rounded-[32px] border border-panel bg-surface/95 p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-muted">User</p>
            <p className="mt-3 text-xl font-semibold">{currentUser.displayName ?? currentUser.email}</p>
            <p className="mt-2 text-sm text-muted">{currentUser.email}</p>
            <div className="mt-6 space-y-3 rounded-[28px] bg-panel/90 p-4">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Reports</span>
                <span>{reports.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Last refresh</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <ReportBuilder currentUser={currentUser} onReportCreated={() => fetchReports(currentUser.uid)} />

        <div className="rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Report history</p>
              <h2 className="mt-2 text-2xl font-semibold">All generated reports</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title"
                className="rounded-3xl border border-panel bg-surface/90 px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-3xl border border-panel bg-surface/90 px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
              >
                <option>All</option>
                <option value="generated">Generated</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead>
                <tr className="border-b border-panel/70 text-sm uppercase tracking-[0.24em] text-muted">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Filters</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="border-b border-panel/40 hover:bg-surface/90">
                      <td className="px-4 py-4 font-semibold text-white">{report.title}</td>
                      <td className="px-4 py-4 text-sm text-muted">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-sm text-muted">
                        {report.filters.range}, {report.filters.category}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted">{report.status}</td>
                      <td className="px-4 py-4 space-x-2">
                        <a
                          href={report.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-full border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                      No reports found. Generate your first report to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
