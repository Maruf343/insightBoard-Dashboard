'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '../../lib/firebase';
import ToastContainer from '../../components/ToastContainer';

type ToastMessage = {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'error';
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4200);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function initAuth() {
      const { auth } = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');

      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isMounted) return;
        setAuthLoading(false);
        if (user) {
          router.push('/dashboard');
        }
      });
    }

    initAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [router]);

  const signInWithEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { auth } = await getFirebaseAuth();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
      pushToast({ title: 'Signed in', description: 'Welcome back to InsightBoard.', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (authError) {
      setError('Unable to sign in. Please check your email and password.');
      pushToast({ title: 'Sign-in failed', description: 'Please verify your credentials and try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const { auth, googleProvider } = await getFirebaseAuth();
      const { signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(auth, googleProvider);
      pushToast({ title: 'Signed in', description: 'Google authentication succeeded.', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (authError) {
      setError('Google sign-in failed. Please try again.');
      pushToast({ title: 'Google sign in failed', description: 'We could not complete the sign in.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 rounded-[2rem] border border-panel bg-panel/95 p-8 shadow-panel">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-lg font-semibold">Checking authentication...</p>
            <p className="max-w-md text-sm text-muted">Just a moment while we confirm your session state.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base px-6 py-12 text-base text-white sm:px-10">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 rounded-[2rem] border border-panel bg-panel/95 p-8 shadow-panel">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-muted">InsightBoard</p>
          <h1 className="mt-4 text-4xl font-semibold">Sign in to your dashboard</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Use your Firebase account to securely access your analytics workspace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={signInWithEmail} className="space-y-5 rounded-3xl bg-surface p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Email sign in</p>
            <label className="block text-sm font-medium text-muted">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-panel bg-panel/90 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block text-sm font-medium text-muted">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-panel bg-panel/90 px-4 py-3 text-sm text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </form>

          <div className="rounded-3xl bg-surface p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Quick access</p>
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-panel bg-base px-4 py-3 text-sm font-semibold transition hover:bg-slate-100/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Opening Google…' : 'Continue with Google'}
            </button>
            <p className="mt-6 text-sm leading-6 text-muted">
              If you do not yet have an email account in this project, create one in the Firebase console or use Google sign-in.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
