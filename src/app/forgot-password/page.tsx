'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
      return;
    }

    setSent(true);
  };

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
            Reset your password
          </p>
        </div>

        <div className="neuro-raised p-7">
          {sent ? (
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
                  Check your inbox
                </p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  If an account exists for <strong>{email}</strong>, we sent a reset link. Check your spam folder too.
                </p>
              </div>
              <Link
                href="/login"
                className="block text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ color: 'var(--accent)' }}
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-center py-2 px-3 rounded-xl" style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="accent-btn w-full py-3 text-sm font-semibold"
                style={{ borderRadius: '12px' }}
              >
                {loading ? 'Sending...' : 'Send reset link'}
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
      </div>
    </div>
  );
}
