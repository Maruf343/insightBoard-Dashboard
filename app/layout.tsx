import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'InsightBoard Analytics',
  description: 'A portfolio-ready SaaS analytics dashboard built with Next.js, Tailwind CSS, Firebase, and Prisma.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
