export type Metric = {
  title: string;
  value: string;
  change: string;
  comparison: string;
  description: string;
  trend: string;
  trendDirection: 'up' | 'down';
};

export const analyticsMetrics: Metric[] = [
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
    comparison: 'This month vs last month: +9.3%',
    description: 'Weekly active customers engaging with the product.',
    trend: 'User activity is driven by stronger onboarding success.',
    trendDirection: 'up',
  },
  {
    title: 'Conversion rate',
    value: '7.8%',
    change: '+0.5%',
    comparison: 'This month vs last month: +0.1%',
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
];
