'use client';

import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '../lib/firebase';
import type { User } from 'firebase/auth';

type SidebarProps = {
  activeSection: string;
  onChangeSection: (section: string) => void;
  onClose?: () => void;
  onSignOut?: () => void;
  className?: string;
};

const navItems = [
  { label: 'Dashboard' },
  { label: 'Customers' },
  { label: 'Leads' },
  { label: 'Deals' },
  { label: 'Reports' },
  { label: 'Settings' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Sidebar({
  activeSection,
  onChangeSection,
  onClose,
  onSignOut,
  className = '',
}: SidebarProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function initAuth() {
      const { auth } = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isMounted) return;
        setCurrentUser(user);
      });
    }

    initAuth();
    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const displayName =
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0].replace('.', ' ') ||
    'Guest User';

  const avatarText = getInitials(displayName);

  return (
    <aside className={`flex min-h-screen flex-col justify-between rounded-[32px] border border-panel/80 bg-panel/95 p-6 shadow-soft backdrop-blur-xl ${className}`}>
      <div className="space-y-10">

        {/* 🔥 UPDATED PROFILE SECTION */}
        <div className="flex items-center justify-between rounded-2xl border border-panel/70 bg-surface/90 p-4 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            
            {/* Avatar */}
            <div className="relative h-12 w-12">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-brand/20"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                  {avatarText}
                </div>
              )}

              {/* Online Dot */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[color:var(--text)]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[color:var(--muted)]">
                {currentUser?.email ?? 'Guest user'}
              </p>
            </div>
          </div>

          {/* Sign Out */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-xs font-medium text-muted transition hover:text-red-500"
            >
              Sign out
            </button>
          )}
        </div>

        {/* NAVIGATION (UNCHANGED) */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onChangeSection(item.label)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-[28px] border border-transparent px-4 py-3 text-left text-sm font-semibold transition duration-200 ${
                  isActive
                    ? 'bg-brand/10 text-brand shadow-soft ring-1 ring-brand/30'
                    : 'text-muted hover:border-panel hover:bg-surface/90 hover:text-[color:var(--text)]'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive ? 'bg-brand text-white' : 'bg-panel/80 text-muted'
                  }`}
                >
                  •
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION (UNCHANGED) */}
      <div className="rounded-[32px] border border-panel/70 bg-surface/90 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">CRM overview</p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Stay focused on leads, deals, and customer relationships with a clean side nav designed for your sales workflow.
        </p>
      </div>
    </aside>
  );
}