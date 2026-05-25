'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', { email, password, redirect: false });

    if (result?.error) {
      setError('Nesprávný email nebo heslo.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
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
            Přihlaste se pro správu promptů
          </p>
        </div>

        <div className="neuro-raised p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: '#9CA3AF' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
                style={{ color: 'var(--text-primary)' }}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: '#9CA3AF' }}
              >
                Heslo
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
                style={{ color: 'var(--text-primary)' }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
              className="accent-btn w-full py-3 text-sm font-semibold mt-2"
              style={{ borderRadius: '12px' }}
            >
              {loading ? 'Přihlašuji...' : 'Přihlásit se'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
