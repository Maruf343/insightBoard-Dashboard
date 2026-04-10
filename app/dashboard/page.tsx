'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyticsMetrics as defaultMetrics } from '../../data/metrics';
import { countryBreakdown } from '../../data/breakdown';
import { recentActivity as allActivity } from '../../data/recentActivity';
import Sidebar from '../../components/Sidebar';
import MetricCard from '../../components/MetricCard';
import TrendChart from '../../components/TrendChart';
import BreakdownPanel from '../../components/BreakdownPanel';
import ActivityTable from '../../components/ActivityTable';
import ToastContainer from '../../components/ToastContainer';
import { getFirebaseAuth } from '../../lib/firebase';
import type { User } from 'firebase/auth';

type ActivityEntry = {
  user: string;
  action: string;
  value: string;
  time: string;
  segment: string;
};

type ToastType = 'success' | 'info' | 'error';

type ToastMessage = {
  id: string;
  title: string;
  description: string;
  type: ToastType;
};

const rangeOptions = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '1y', label: 'Last 12 months' },
];

const segmentOptions = ['All customers', 'Enterprise', 'SMB', 'Trials'];

const sectionMessages: Record<string, string> = {
  Overview: 'View a consolidated snapshot of revenue, customer health, and product momentum.',
  Customers: 'Track customer onboarding, expansion, and retention across key segments.',
  Revenue: 'Focus on contract value, MRR growth, and recurring revenue performance.',
  Insights: 'Review core signals and growth trends across the platform.',
};

const insightMessages: Record<string, string> = {
  'All customers': 'Revenue momentum remains strong across every segment.',
  Enterprise: 'Enterprise pipelines are converting faster after the new onboarding flow.',
  SMB: 'SMB engagement grew 18% after launching the recent growth campaign.',
  Trials: 'Trial activation is up thanks to improved product walkthroughs.',
};

const metricsByRange: Record<string, typeof defaultMetrics> = {
  '7d': [
    {
      title: 'Revenue',
      value: '$98.1K',
      change: '+6%',
      description: 'Last week focused revenue from active accounts.',
      trend: 'Healthy short-term gains across the product.',
    },
    {
      title: 'Active users',
      value: '14.1K',
      change: '+8%',
      description: 'Users engaging with the product this week.',
      trend: 'Daily activity improved after onboarding updates.',
    },
    {
      title: 'Conversion rate',
      value: '7.2%',
      change: '+0.4%',
      description: 'Trial-to-paid conversion for the past 7 days.',
      trend: 'Smaller friction points are now turning into conversions.',
    },
    {
      title: 'Growth',
      value: '17.4%',
      change: '+3.5%',
      description: 'Week-over-week growth in active seats and revenue.',
      trend: 'Rapid adoption from new accounts continues.',
    },
  ],
  '30d': [
    {
      title: 'Revenue',
      value: '$124.8K',
      change: '+18%',
      description: 'Monthly recurring revenue from core product subscriptions.',
      trend: 'Growth led by higher plan upgrades and renewals.',
    },
    {
      title: 'Active users',
      value: '16.2K',
      change: '+12%',
      description: 'Weekly active customers engaging with the product.',
      trend: 'User activity is driven by stronger onboarding success.',
    },
    {
      title: 'Conversion rate',
      value: '7.8%',
      change: '+0.5%',
      description: 'Trial-to-paid conversion across the last 30 days.',
      trend: 'Optimized flow is improving sign-up conversions.',
    },
    {
      title: 'Growth',
      value: '28.4%',
      change: '+4.2%',
      description: 'Quarter-over-quarter growth in revenue and adoption.',
      trend: 'Customer expansion and retention are both up.',
    },
  ],
  '90d': [
    {
      title: 'Revenue',
      value: '$314.2K',
      change: '+32%',
      description: 'Performance across the last quarter.',
      trend: 'Strong pipeline conversion from enterprise and midsize accounts.',
    },
    {
      title: 'Active users',
      value: '18.9K',
      change: '+21%',
      description: 'User base growth and retention across 90 days.',
      trend: 'Healthy product adoption across new segments.',
    },
    {
      title: 'Conversion rate',
      value: '8.5%',
      change: '+0.9%',
      description: 'Longer-term conversion performance for paid plans.',
      trend: 'Trial improvement and conversion optimization are paying off.',
    },
    {
      title: 'Growth',
      value: '44.1%',
      change: '+6.8%',
      description: 'Quarterly adoption growth from new customer segments.',
      trend: 'Expansion momentum is now sustainable.',
    },
  ],
  '1y': defaultMetrics,
};

export default function DashboardPage() {
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState('All customers');
  const [selectedSection, setSelectedSection] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4200);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    pushToast({ title: 'Refreshing', description: 'Loading the latest dashboard metrics.', type: 'info' });
    setTimeout(() => {
      setIsLoading(false);
      pushToast({ title: 'Updated', description: 'Your dashboard metrics are current.', type: 'success' });
    }, 800);
  };

  const handleExport = () => {
    pushToast({ title: 'Export started', description: 'Preparing your report for download.', type: 'info' });
  };

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    pushToast({ title: 'Range changed', description: `Now showing data for ${range}.`, type: 'info' });
  };

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment);
    pushToast({ title: 'Segment filter applied', description: `Filtered to ${segment}.`, type: 'info' });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('theme-dark', darkMode);
    root.classList.toggle('theme-light', !darkMode);
  }, [darkMode]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function initAuthListener() {
      const { auth } = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isMounted) return;
        setCurrentUser(user);
        setAuthLoading(false);
        if (!user) {
          router.push('/login');
        }
      });
    }

    initAuthListener();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  const activity = useMemo(() => {
    if (selectedSegment === 'All customers') return allActivity as ActivityEntry[];
    return (allActivity as ActivityEntry[]).filter((item) => item.segment === selectedSegment);
  }, [selectedSegment]);

  const insightText = insightMessages[selectedSegment];
  const metrics = metricsByRange[selectedRange] ?? defaultMetrics;
  const sectionText = sectionMessages[selectedSection] ?? sectionMessages.Overview;

  const handleSignOut = async () => {
    const { auth } = await getFirebaseAuth();
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    pushToast({ title: 'Signed out', description: 'You will be redirected to the login screen.', type: 'info' });
    setTimeout(() => router.push('/login'), 600);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-base text-base">
        <div className="flex min-h-screen items-center justify-center px-6 text-white">
          <div className="rounded-3xl border border-panel bg-panel px-10 py-12 shadow-panel">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <p className="text-lg font-semibold">Checking authentication...</p>
              <p className="max-w-sm text-center text-sm text-muted">Loading your session and preparing the dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base text-base">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
      <div className="grid min-h-screen grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:gap-8">
        <Sidebar activeSection={selectedSection} onChangeSection={setSelectedSection} />
        <main className="space-y-8 px-6 pb-10 pt-6 sm:px-8 xl:px-12">
          <section className="rounded-3xl border border-panel bg-panel p-6 shadow-panel sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted">Business analytics</p>
                <h1 className="mt-2 text-3xl font-semibold">Revenue & growth overview</h1>
                <p className="mt-3 max-w-2xl text-muted">{sectionText}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-3 rounded-3xl border border-panel bg-surface px-4 py-2 text-sm text-muted">
                  <span className="block rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">
                    {currentUser.displayName ? currentUser.displayName : currentUser.email?.split('@')[0]}
                  </span>
                  <span>signed in</span>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="rounded-full border border-panel bg-surface px-4 py-2 text-sm transition hover:bg-slate-100/80"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="rounded-full border border-brand bg-brand-soft px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20"
                >
                  Export report
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-panel bg-surface px-4 py-2 text-sm transition hover:bg-slate-100/80"
                >
                  Sign out
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.3fr_0.7fr]">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {rangeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleRangeChange(option.id)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      selectedRange === option.id
                        ? 'border-brand bg-brand-soft text-brand'
                        : 'border-panel bg-surface text-base hover:border-slate-400 hover:bg-slate-100/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 rounded-3xl border border-panel bg-surface p-4 shadow-inner">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-muted">Theme</p>
                  <p className="mt-2 text-lg font-semibold">{darkMode ? 'Dark' : 'Classic'} mode</p>
                </div>
                <button
                  onClick={() => setDarkMode((value) => !value)}
                  className="rounded-full border border-panel bg-base px-4 py-3 text-sm transition hover:bg-surface"
                >
                  {darkMode ? 'Switch to classic' : 'Switch to dark'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl bg-surface p-5 shadow-inner">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Segment</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {segmentOptions.map((segment) => (
                    <button
                      key={segment}
                      onClick={() => handleSegmentChange(segment)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selectedSegment === segment
                          ? 'bg-brand text-white'
                          : 'bg-surface text-base hover:bg-slate-100/80'
                      }`}
                    >
                      {segment}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-surface p-5 shadow-inner">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Quick tip</p>
                <p className="mt-4 text-sm leading-6 text-muted">{insightText}</p>
              </div>
              <div className="rounded-3xl border border-brand bg-brand-soft p-5 shadow-inner">
                <p className="text-sm uppercase tracking-[0.28em] text-brand">What's trending</p>
                <p className="mt-4 text-4xl font-semibold">+18%</p>
                <p className="mt-2 text-sm text-muted">More users are converting compared to last 30 days.</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.length > 0 ? (
              metrics.map((metric) => <MetricCard key={metric.title} metric={metric} loading={isLoading} />)
            ) : (
              <div className="col-span-full rounded-3xl border border-panel bg-surface p-6 text-center text-muted shadow-panel">
                <p className="text-lg font-semibold text-white">No metrics available</p>
                <p className="mt-3 text-sm">Create dashboard data or connect your data source to populate metrics.</p>
              </div>
            )}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <TrendChart loading={isLoading} />
            <div className="space-y-6">
              <div className="rounded-3xl border border-panel bg-panel p-6 shadow-panel transition duration-300 hover:-translate-y-0.5 hover:border-brand/30">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-muted">Growth snapshot</p>
                    <h2 className="mt-2 text-xl font-semibold">Performance highlights</h2>
                  </div>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">+12% goal</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-surface p-4 transition hover:bg-slate-100/80">
                    <p className="text-sm text-muted">Avg. revenue per user</p>
                    <p className="mt-3 text-2xl font-semibold">$152</p>
                  </div>
                  <div className="rounded-3xl bg-surface p-4 transition hover:bg-slate-100/80">
                    <p className="text-sm text-muted">Weekly retention</p>
                    <p className="mt-3 text-2xl font-semibold">82.1%</p>
                  </div>
                </div>
              </div>

              <BreakdownPanel data={countryBreakdown} loading={isLoading} />
            </div>
          </section>

          <section>
            <ActivityTable activity={activity} loading={isLoading} />
          </section>
        </main>
      </div>
    </div>
  );
}
