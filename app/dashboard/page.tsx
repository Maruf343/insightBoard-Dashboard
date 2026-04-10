'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyticsMetrics as defaultMetrics, type Metric } from '../../data/metrics';
import { countryBreakdown } from '../../data/breakdown';
import { recentActivity as allActivity } from '../../data/recentActivity';
import Sidebar from '../../components/Sidebar';
import MetricCard from '../../components/MetricCard';
import TrendChart from '../../components/TrendChart';
import BreakdownPanel from '../../components/BreakdownPanel';
import ActivityTable from '../../components/ActivityTable';
import DropdownMenu from '../../components/DropdownMenu';
import Modal from '../../components/Modal';
import SettingsPanel from '../../components/SettingsPanel';
import ToggleSwitch from '../../components/ToggleSwitch';
import ToastContainer from '../../components/ToastContainer';
import { getFirebaseAuth } from '../../lib/firebase';
import type { User } from 'firebase/auth';

type ActivityEntry = {
  id: string;
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

type ProfileSettings = {
  name: string;
  avatarUrl: string;
  email: string;
};

type AccountSettings = {
  plan: string;
  storageUsed: string;
  memberSince: string;
};

type AppearanceSettings = {
  theme: 'dark' | 'light';
  compactMode: boolean;
};

type NotificationSettings = {
  emailAlerts: boolean;
  productUpdates: boolean;
  activityDigest: boolean;
};

type PrivacySettings = {
  analyticsSharing: boolean;
  personalizedContent: boolean;
  secureSession: boolean;
};

type DashboardSettings = {
  profile: ProfileSettings;
  account: AccountSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
};

const defaultSettings: DashboardSettings = {
  profile: {
    name: 'Avery Morgan',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
    email: 'avery.morgan@insightboard.app',
  },
  account: {
    plan: 'Pro',
    storageUsed: '42 GB',
    memberSince: 'Jul 2024',
  },
  appearance: {
    theme: 'dark',
    compactMode: false,
  },
  notifications: {
    emailAlerts: true,
    productUpdates: true,
    activityDigest: false,
  },
  privacy: {
    analyticsSharing: true,
    personalizedContent: true,
    secureSession: true,
  },
};

const rangeOptions = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '1y', label: 'Last 12 months' },
];

const segmentOptions = ['All customers', 'Enterprise', 'SMB', 'Trials'];

const reportTabs = ['Summary', 'Pipeline', 'Performance'];

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

const metricsByRange: Record<string, Metric[]> = {
  '7d': [
    {
      title: 'Revenue',
      value: '$98.1K',
      change: '+6%',
      comparison: 'This week vs last week: +4.8%',
      description: 'Last week focused revenue from active accounts.',
      trend: 'Healthy short-term gains across the product.',
      trendDirection: 'up',
    },
    {
      title: 'Active users',
      value: '14.1K',
      change: '+8%',
      comparison: 'This week vs last week: +5.1%',
      description: 'Users engaging with the product this week.',
      trend: 'Daily activity improved after onboarding updates.',
      trendDirection: 'up',
    },
    {
      title: 'Conversion rate',
      value: '7.2%',
      change: '+0.4%',
      comparison: 'This week vs last week: +0.2%',
      description: 'Trial-to-paid conversion for the past 7 days.',
      trend: 'Smaller friction points are now turning into conversions.',
      trendDirection: 'up',
    },
    {
      title: 'Growth',
      value: '17.4%',
      change: '+3.5%',
      comparison: 'This week vs last week: +1.8%',
      description: 'Week-over-week growth in active seats and revenue.',
      trend: 'Rapid adoption from new accounts continues.',
      trendDirection: 'up',
    },
  ],
  '30d': [
    {
      title: 'Revenue',
      value: '$124.8K',
      change: '+18%',
      comparison: 'This month vs last month: +11.2%',
      description: 'Monthly recurring revenue from core product subscriptions.',
      trend: 'Growth led by higher plan upgrades and renewals.',
      trendDirection: 'up',
    },
    {
      title: 'Active users',
      value: '16.2K',
      change: '+12%',
      comparison: 'This month vs last month: +8.6%',
      description: 'Weekly active customers engaging with the product.',
      trend: 'User activity is driven by stronger onboarding success.',
      trendDirection: 'up',
    },
    {
      title: 'Conversion rate',
      value: '7.8%',
      change: '+0.5%',
      comparison: 'This month vs last month: +0.2%',
      description: 'Trial-to-paid conversion across the last 30 days.',
      trend: 'Optimized flow is improving sign-up conversions.',
      trendDirection: 'up',
    },
    {
      title: 'Growth',
      value: '28.4%',
      change: '+4.2%',
      comparison: 'This month vs last month: +2.1%',
      description: 'Quarter-over-quarter growth in revenue and adoption.',
      trend: 'Customer expansion and retention are both up.',
      trendDirection: 'up',
    },
  ],
  '90d': [
    {
      title: 'Revenue',
      value: '$314.2K',
      change: '+32%',
      comparison: 'This quarter vs last quarter: +18.3%',
      description: 'Performance across the last quarter.',
      trend: 'Strong pipeline conversion from enterprise and midsize accounts.',
      trendDirection: 'up',
    },
    {
      title: 'Active users',
      value: '18.9K',
      change: '+21%',
      comparison: 'This quarter vs last quarter: +14.6%',
      description: 'User base growth and retention across 90 days.',
      trend: 'Healthy product adoption across new segments.',
      trendDirection: 'up',
    },
    {
      title: 'Conversion rate',
      value: '8.5%',
      change: '+0.9%',
      comparison: 'This quarter vs last quarter: +0.5%',
      description: 'Longer-term conversion performance for paid plans.',
      trend: 'Trial improvement and conversion optimization are paying off.',
      trendDirection: 'up',
    },
    {
      title: 'Growth',
      value: '44.1%',
      change: '+6.8%',
      comparison: 'This quarter vs last quarter: +3.4%',
      description: 'Quarterly adoption growth from new customer segments.',
      trend: 'Expansion momentum is now sustainable.',
      trendDirection: 'up',
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
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [activeSettingsTab, setActiveSettingsTab] = useState('Profile Settings');
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityEntry[]>(() =>
    allActivity.map((item, index) => ({ id: `activity-${index}`, ...item }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ActivityEntry>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [liveModeEnabled, setLiveModeEnabled] = useState(true);
  const [showBenchmarks, setShowBenchmarks] = useState(true);
  const [activeReportTab, setActiveReportTab] = useState(reportTabs[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<ActivityEntry | null>(null);
  const [draftActivity, setDraftActivity] = useState<Omit<ActivityEntry, 'id'>>({
    user: '',
    action: '',
    value: '',
    time: 'Just now',
    segment: 'All customers',
  });

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

  const handleSettingsUpdate = (update: Partial<DashboardSettings>) => {
    setSettings((current) => ({ ...current, ...update }));
  };

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    pushToast({ title: 'Range changed', description: `Now showing data for ${range}.`, type: 'info' });
  };

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment);
    setCurrentPage(1);
    pushToast({ title: 'Segment filter applied', description: `Filtered to ${segment}.`, type: 'info' });
  };

  const handleSort = (field: keyof ActivityEntry) => {
    setCurrentPage(1);
    setSortDirection((current) => (sortField === field ? (current === 'asc' ? 'desc' : 'asc') : 'asc'));
    setSortField(field);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setDraftActivity({ user: '', action: '', value: '', time: 'Just now', segment: 'All customers' });
    setEditTarget(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (activity: ActivityEntry) => {
    setModalMode('edit');
    setDraftActivity({ user: activity.user, action: activity.action, value: activity.value, time: activity.time, segment: activity.segment });
    setEditTarget(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = () => {
    const newItem: ActivityEntry = {
      id: editTarget ? editTarget.id : `activity-${Date.now()}`,
      ...draftActivity,
    };

    if (editTarget) {
      setActivityItems((current) => current.map((item) => (item.id === editTarget.id ? newItem : item)));
      pushToast({ title: 'Activity updated', description: 'Your activity item was edited successfully.', type: 'success' });
    } else {
      setActivityItems((current) => [newItem, ...current]);
      pushToast({ title: 'Activity created', description: 'A new item has been added to the dashboard.', type: 'success' });
    }

    setIsModalOpen(false);
    setEditTarget(null);
    setDraftActivity({ user: '', action: '', value: '', time: 'Just Now', segment: 'All customers' });
  };

  useEffect(() => {
    const saved = window.localStorage.getItem('insightboardSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Invalid dashboard settings in localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('insightboardSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const isDarkMode = settings.appearance.theme === 'dark';
    root.classList.toggle('theme-dark', isDarkMode);
    root.classList.toggle('theme-light', !isDarkMode);
  }, [settings.appearance.theme]);

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

  const filteredActivity = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return activityItems
      .filter((entry) => selectedSegment === 'All customers' || entry.segment === selectedSegment)
      .filter((entry) => {
        if (!query) return true;
        return [entry.user, entry.action, entry.value, entry.time, entry.segment].some((value) =>
          value.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aRaw = String(a[sortField]).toLowerCase();
        const bRaw = String(b[sortField]).toLowerCase();

        if (aRaw === bRaw) return 0;
        if (sortDirection === 'asc') return aRaw > bRaw ? 1 : -1;
        return aRaw > bRaw ? -1 : 1;
      });
  }, [activityItems, selectedSegment, searchTerm, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredActivity.length / rowsPerPage));
  const paginatedActivity = filteredActivity.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const metrics = metricsByRange[selectedRange] ?? defaultMetrics;
  const positiveMetrics = metrics.filter((metric) => metric.trendDirection === 'up');
  const negativeMetrics = metrics.filter((metric) => metric.trendDirection === 'down');
  const dynamicInsight =
    positiveMetrics.length === metrics.length
      ? 'All core growth signals are moving upward this period — maintain focus on expansion and retention.'
      : negativeMetrics.length === metrics.length
      ? 'Most metrics are softening; investigate conversion and customer health to recover momentum.'
      : negativeMetrics.length === 0
      ? `Mixed performance: ${positiveMetrics.map((metric) => metric.title).join(', ')} are trending up.`
      : `Mixed performance: ${positiveMetrics.map((metric) => metric.title).join(', ')} are trending up, while ${negativeMetrics
          .map((metric) => metric.title)
          .join(', ')} need closer attention.`;

  const activityContextMessage = searchTerm
    ? `Showing ${filteredActivity.length} results for "${searchTerm}".`
    : filteredActivity.length > 6
    ? 'Your activity stream is active and recent events are feeding the dashboard.'
    : filteredActivity.length > 0
    ? 'Activity volume is moderate; focus on conversion signals for the next sprint.'
    : 'No activity matches the current filters. Try a different segment or refresh the page.';

  const comparisonItems = metrics.slice(0, 3);
  const insightText = insightMessages[selectedSegment];
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

  const isDarkMode = settings.appearance.theme === 'dark';
  const compactModeClass = settings.appearance.compactMode ? 'space-y-6 px-5' : 'space-y-8 px-6';

  return (
    <div className="relative min-h-screen bg-base text-base">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />

      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="absolute left-0 top-0 h-full w-[85vw] max-w-sm overflow-y-auto border-r border-panel bg-panel/95 shadow-2xl">
          <Sidebar
            activeSection={selectedSection}
            onChangeSection={(section) => {
              setSelectedSection(section);
              setSidebarOpen(false);
            }}
            onClose={() => setSidebarOpen(false)}
            className="h-full"
          />
        </div>
      </div>

      <div className="grid min-h-screen grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:gap-8">
        <div className="hidden lg:block">
          <Sidebar activeSection={selectedSection} onChangeSection={setSelectedSection} />
        </div>
        <main className={`${compactModeClass} pb-10 pt-6 sm:px-8 xl:px-12`}>
          <section className="rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted">{selectedSection === 'Settings' ? 'Workspace settings' : 'Business analytics'}</p>
                <h1 className="mt-2 text-3xl font-semibold">
                  {selectedSection === 'Settings' ? 'Personalize your experience' : 'Revenue & growth overview'}
                </h1>
                <p className="mt-3 max-w-2xl text-muted">{selectedSection === 'Settings' ? 'Update your profile, account, and preferences with persistent local settings.' : sectionText}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-panel bg-surface/90 px-4 py-2 text-sm font-semibold transition hover:bg-surface lg:hidden"
                >
                  Menu
                </button>
                <DropdownMenu
                  label="Actions"
                  items={[
                    { id: 'new', label: 'Create activity', onClick: handleOpenCreateModal },
                    { id: 'refresh', label: 'Force refresh', onClick: handleRefresh },
                    { id: 'export', label: 'Export report', onClick: handleExport },
                  ]}
                />
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="rounded-full border border-panel bg-surface/90 px-4 py-2 text-sm transition hover:bg-surface"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="rounded-full border border-brand bg-brand-soft px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20"
                >
                  Export
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full border border-panel bg-surface/90 px-4 py-2 text-sm transition hover:bg-surface"
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

              <div className="flex flex-col gap-4 rounded-[28px] border border-panel bg-surface/90 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-muted">Theme</p>
                    <p className="mt-2 text-lg font-semibold">{isDarkMode ? 'Dark' : 'Light'} mode</p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        appearance: {
                          ...current.appearance,
                          theme: current.appearance.theme === 'dark' ? 'light' : 'dark',
                        },
                      }))
                    }
                    className="rounded-full border border-panel bg-base px-4 py-3 text-sm transition hover:bg-surface"
                  >
                    {isDarkMode ? 'Switch to light' : 'Switch to dark'}
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ToggleSwitch enabled={liveModeEnabled} onChange={setLiveModeEnabled} label="Live activity stream" />
                  <ToggleSwitch enabled={showBenchmarks} onChange={setShowBenchmarks} label="Show benchmarks" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[28px] bg-surface/90 p-5 shadow-soft">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Segment</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {segmentOptions.map((segment) => (
                    <button
                      key={segment}
                      onClick={() => handleSegmentChange(segment)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        selectedSegment === segment
                          ? 'bg-brand text-white shadow-soft'
                          : 'bg-surface text-base hover:bg-surface/90'
                      }`}
                    >
                      {segment}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] bg-surface/90 p-5 shadow-soft">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Quick tip</p>
                <p className="mt-4 text-sm leading-7 text-muted">{insightText}</p>
              </div>
              <div className="rounded-[28px] border border-brand bg-brand-soft p-5 shadow-soft">
                <p className="text-sm uppercase tracking-[0.28em] text-brand">What's trending</p>
                <p className="mt-4 text-4xl font-semibold">+18%</p>
                <p className="mt-2 text-sm text-muted">More users are converting compared to last 30 days.</p>
              </div>
            </div>
          </section>

          {selectedSection === 'Settings' ? (
            <section className="rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft sm:p-8">
              <SettingsPanel
                settings={settings}
                activeTab={activeSettingsTab}
                onChangeTab={setActiveSettingsTab}
                onUpdate={handleSettingsUpdate}
                onNotify={(message) => pushToast({ title: 'Settings updated', description: message, type: 'success' })}
              />
            </section>
          ) : (
            <>
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

              <section className="rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted">Insight summary</p>
                <h2 className="mt-2 text-xl font-semibold">Comparative performance</h2>
                <p className="mt-3 max-w-2xl text-muted">{dynamicInsight}</p>
              </div>
              <span className="rounded-full bg-surface/90 px-3 py-1 text-sm text-muted">{selectedRange} comparison</span>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {comparisonItems.map((metric) => (
                <div key={metric.title} className="rounded-[28px] border border-panel bg-surface/95 p-5 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.28em] text-muted">{metric.title}</p>
                  <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
                  <p className="mt-2 text-sm text-muted">{metric.comparison}</p>
                  <p
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white ${
                      metric.trendDirection === 'up' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {metric.trendDirection === 'up' ? 'Upward trend' : 'Softening trend'}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted">{activityContextMessage}</p>
          </section>

          <section className="rounded-[32px] border border-panel bg-panel/95 p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-muted">Dashboard view</p>
                <h2 className="mt-2 text-xl font-semibold">Report layout</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {reportTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveReportTab(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeReportTab === tab
                        ? 'bg-brand text-white shadow-soft'
                        : 'bg-surface text-base hover:bg-surface/90'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] bg-surface/95 p-6 shadow-soft transition duration-200 hover:shadow-xl">
              <p className="text-sm uppercase tracking-[0.28em] text-muted">Current report</p>
              <p className="mt-3 text-lg font-semibold">{activeReportTab} analytics</p>
              <p className="mt-2 text-sm text-muted">
                {activeReportTab === 'Summary'
                  ? 'A quick overview of the most important business metrics.'
                  : activeReportTab === 'Pipeline'
                  ? 'Pipeline health, conversion velocity, and forecasted close rates.'
                  : 'Performance benchmarks across product, pricing, and onboarding.'}
              </p>
            </div>
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
            <ActivityTable
              activity={paginatedActivity}
              loading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={handleOpenEditModal}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              liveMode={liveModeEnabled}
            />
          </section>
        </>
        )}
        </main>
      </div>

      <Modal
        title={modalMode === 'create' ? 'Create activity item' : 'Edit activity item'}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        footer={
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full border border-panel bg-surface px-4 py-2 text-sm transition hover:bg-panel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveActivity}
              className="rounded-full border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
            >
              {modalMode === 'create' ? 'Create item' : 'Save changes'}
            </button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-muted">
            <span className="text-white">User</span>
            <input
              type="text"
              value={draftActivity.user}
              onChange={(event) => setDraftActivity((current) => ({ ...current, user: event.target.value }))}
              placeholder="Enter user name"
              className="mt-2 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </label>
          <label className="block text-sm text-muted">
            <span className="text-white">Segment</span>
            <select
              value={draftActivity.segment}
              onChange={(event) => setDraftActivity((current) => ({ ...current, segment: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm outline-none transition focus:border-brand"
            >
              {segmentOptions.map((segment) => (
                <option key={segment} value={segment}>
                  {segment}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-muted">
            <span className="text-white">Action</span>
            <input
              type="text"
              value={draftActivity.action}
              onChange={(event) => setDraftActivity((current) => ({ ...current, action: event.target.value }))}
              placeholder="Describe the activity"
              className="mt-2 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </label>
          <label className="block text-sm text-muted">
            <span className="text-white">Value</span>
            <input
              type="text"
              value={draftActivity.value}
              onChange={(event) => setDraftActivity((current) => ({ ...current, value: event.target.value }))}
              placeholder="Enter value or status"
              className="mt-2 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </label>
          <label className="block text-sm text-muted sm:col-span-2">
            <span className="text-white">Timestamp</span>
            <input
              type="text"
              value={draftActivity.time}
              onChange={(event) => setDraftActivity((current) => ({ ...current, time: event.target.value }))}
              placeholder="E.g. 10 min ago"
              className="mt-2 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}
