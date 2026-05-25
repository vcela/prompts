'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registrace se nezdařila.');
        setLoading(false);
        return;
      }
    }

    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError(mode === 'register' ? 'Registrace proběhla, ale přihlášení selhalo.' : 'Nesprávný email nebo heslo.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleGoogle = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setName('');
    setEmail('');
    setPassword('');
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
            {mode === 'login' ? 'Přihlaste se pro správu promptů' : 'Vytvořte si bezplatný účet'}
          </p>
        </div>

        <div className="neuro-raised p-7 space-y-4">
          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 text-sm font-semibold rounded-xl transition-opacity hover:opacity-80"
            style={{
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Pokračovat přes Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>nebo</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                  Jméno (nepovinné)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="Vaše jméno"
                  autoComplete="name"
                />
              </div>
            )}

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
                placeholder="vas@email.cz"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                Heslo {mode === 'register' && <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(min. 8 znaků)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
                style={{ color: 'var(--text-primary)' }}
                placeholder="••••••••"
                required
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
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
              {loading
                ? (mode === 'register' ? 'Registruji...' : 'Přihlašuji...')
                : (mode === 'register' ? 'Zaregistrovat se' : 'Přihlásit se')}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-xs" style={{ color: '#9CA3AF' }}>
            {mode === 'login' ? 'Nemáte účet?' : 'Již máte účet?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent)' }}
            >
              {mode === 'login' ? 'Zaregistrujte se' : 'Přihlaste se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
