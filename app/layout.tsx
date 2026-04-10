import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'InsightBoard Analytics',
  description: 'Modern SaaS analytics dashboard built with Next.js App Router and Tailwind CSS.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
