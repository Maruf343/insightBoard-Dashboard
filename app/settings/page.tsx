'use client';

import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebase';
import type { User } from 'firebase/auth';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('insightboardTheme') as 'dark' | 'light' | null;
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('theme-dark', theme === 'dark');
    root.classList.toggle('theme-light', theme === 'light');
    window.localStorage.setItem('insightboardTheme', theme);
  }, [theme]);

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
        if (user) {
          setDisplayName(user.displayName ?? '');
          setPhotoUrl(user.photoURL ?? '');
        }
      });
    }

    initAuth();
    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    const { updateProfile } = await import('firebase/auth');
    try {
      await updateProfile(currentUser, { displayName: displayName.trim(), photoURL: photoUrl.trim() || undefined });
      setStatusMessage('Profile updated successfully.');
    } catch (error) {
      setStatusMessage('Unable to update profile.');
    }
  };

  const handleLogout = async () => {
    const { auth, googleProvider } = await getFirebaseAuth();
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    window.location.href = '/login';
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-panel bg-panel/95 p-8 shadow-panel">
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-lg font-semibold">Checking authentication...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-panel bg-panel/95 p-8 text-center shadow-panel">
          <p className="text-lg font-semibold">Sign in to manage your profile.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base px-6 py-10 text-base text-white sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="rounded-[32px] border border-panel bg-panel/95 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.28em] text-muted">Profile</p>
          <h1 className="mt-3 text-4xl font-semibold">Account settings</h1>
          <p className="mt-4 max-w-2xl text-muted">Update your display details, theme preference, and manage your session.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[32px] border border-panel bg-panel/95 p-8 shadow-soft">
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-3xl bg-surface">
                  {photoUrl ? <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-muted">No image</div>}
                </div>
                <div>
                  <p className="text-sm text-muted">Signed in as</p>
                  <p className="mt-2 text-xl font-semibold">{currentUser.displayName ?? currentUser.email}</p>
                  <p className="text-sm text-muted">{currentUser.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-muted">
                  Display name
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                  />
                </label>
                <label className="block text-sm text-muted">
                  Photo URL
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(event) => setPhotoUrl(event.target.value)}
                    className="mt-3 w-full rounded-3xl border border-panel bg-base px-4 py-3 text-sm text-white outline-none transition focus:border-brand"
                  />
                </label>
              </div>

              <div className="rounded-[28px] border border-panel bg-surface/90 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">Theme preference</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                      theme === 'dark' ? 'bg-brand text-white' : 'bg-panel text-muted hover:bg-surface/90'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                      theme === 'light' ? 'bg-brand text-white' : 'bg-panel text-muted hover:bg-surface/90'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
                >
                  Save profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-panel bg-surface px-5 py-3 text-sm font-semibold text-white transition hover:bg-panel"
                >
                  Log out
                </button>
              </div>
              {statusMessage ? <p className="text-sm text-brand">{statusMessage}</p> : null}
            </div>
          </div>

          <div className="rounded-[32px] border border-panel bg-surface/95 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.28em] text-muted">Security</p>
            <h2 className="mt-3 text-2xl font-semibold">Session controls</h2>
            <p className="mt-4 text-sm text-muted">Use this panel to sign out and keep your account secure.</p>
            <dl className="mt-6 space-y-4 text-sm text-muted">
              <div className="rounded-3xl border border-panel bg-panel/90 p-4">
                <dt className="font-semibold text-white">Theme</dt>
                <dd className="mt-2">{theme === 'dark' ? 'Dark mode active' : 'Light mode active'}</dd>
              </div>
              <div className="rounded-3xl border border-panel bg-panel/90 p-4">
                <dt className="font-semibold text-white">Firebase UID</dt>
                <dd className="mt-2 break-all">{currentUser.uid}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
