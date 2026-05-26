'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setError('Invalid reset link.');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      return;
    }

    setDone(true);
    setTimeout(() => router.push('/login'), 3000);
  };

  return (
    <div className="neuro-raised p-7">
      {done ? (
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(52,199,89,0.12)' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 11L9 16L18 7" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Password updated
            </p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
              Redirecting you to sign in…
            </p>
          </div>
          <Link
            href="/login"
            className="block text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            Sign in now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
              New password <span style={{ fontWeight: 400 }}>(min. 8 chars)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
              style={{ color: 'var(--text-primary)' }}
              placeholder="••••••••"
              required
              autoFocus
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
              style={{ color: 'var(--text-primary)' }}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-center py-2 px-3 rounded-xl" style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="accent-btn w-full py-3 text-sm font-semibold"
            style={{ borderRadius: '12px' }}
          >
            {loading ? 'Saving...' : 'Set new password'}
          </button>

          <Link
            href="/login"
            className="block text-center text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#9CA3AF' }}
          >
            Back to sign in
          </Link>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(145deg, #FF5F55, #FF1A0E)',
              boxShadow: '6px 6px 12px rgba(204,46,37,0.4), -3px -3px 8px rgba(255,107,98,0.3)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M4 12H16M4 18H12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
            prompts<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            Set a new password
          </p>
        </div>

        <Suspense fallback={<div className="neuro-raised p-7 text-center text-sm" style={{ color: '#9CA3AF' }}>Loading…</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
