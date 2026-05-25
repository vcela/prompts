'use client';
import { useState, useEffect } from 'react';

const COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759',
  '#007AFF', '#5856D6', '#FF2D55', '#30B0C7',
];

interface CategoryModalProps {
  onSave: (data: { name: string; color: string }) => Promise<void>;
  onClose: () => void;
}

export function CategoryModal({ onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ name, color });
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,26,46,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="neuro-raised w-full max-w-sm animate-modal">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            Nová kategorie
          </h2>
          <button onClick={onClose} className="neuro-circle w-8 h-8 flex items-center justify-center" style={{ color: '#9CA3AF' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 2L11 11M11 2L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
              Název
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Název kategorie..."
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>
              Barva
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform duration-150"
                  style={{
                    backgroundColor: c,
                    transform: color === c ? 'scale(1.25)' : 'scale(1)',
                    boxShadow:
                      color === c
                        ? `0 0 0 3px var(--bg), 0 0 0 5px ${c}`
                        : '2px 2px 4px rgba(0,0,0,0.15)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold rounded-xl transition-all"
              style={{
                background: 'var(--bg)',
                boxShadow: '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)',
                color: 'var(--text-secondary)',
              }}
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 text-sm font-semibold rounded-xl text-white transition-all"
              style={{
                background: `linear-gradient(145deg, ${color}DD, ${color})`,
                boxShadow: `4px 4px 10px ${color}66`,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Ukládám...' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
