'use client';
import { useState, useEffect } from 'react';
import { Category, Prompt } from '@/types';

interface PromptModalProps {
  prompt?: Prompt;
  categories: Category[];
  onSave: (data: {
    title: string;
    content: string;
    tags: string[];
    categoryId: string | null;
  }) => Promise<void>;
  onClose: () => void;
}

export function PromptModal({ prompt, categories, onSave, onClose }: PromptModalProps) {
  const [title, setTitle] = useState(prompt?.title ?? '');
  const [content, setContent] = useState(prompt?.content ?? '');
  const [tagInput, setTagInput] = useState(prompt?.tags.join(', ') ?? '');
  const [categoryId, setCategoryId] = useState(prompt?.categoryId ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tags = tagInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    await onSave({ title, content, tags, categoryId: categoryId || null });
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,26,46,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="neuro-raised w-full max-w-lg animate-modal">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            {prompt ? 'Upravit prompt' : 'Nový prompt'}
          </h2>
          <button onClick={onClose} className="neuro-circle w-8 h-8 flex items-center justify-center" style={{ color: '#9CA3AF' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 2L11 11M11 2L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
              Název
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm font-medium placeholder-[#9CA3AF]"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Výstižný název promptu..."
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
              Obsah promptu
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm placeholder-[#9CA3AF] resize-none"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Celý text promptu..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                Kategorie
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm appearance-none cursor-pointer"
                  style={{ color: categoryId ? 'var(--text-primary)' : '#9CA3AF' }}
                >
                  <option value="">Bez kategorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                >
                  <path d="M2 4L6 8L10 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                Tagy
              </label>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="neuro-inset w-full px-4 py-3 bg-transparent outline-none text-sm placeholder-[#9CA3AF]"
                style={{ color: 'var(--text-primary)' }}
                placeholder="ai, coding..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
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
              className="flex-1 py-3 text-sm font-semibold rounded-xl accent-btn"
            >
              {saving ? 'Ukládám...' : prompt ? 'Uložit změny' : 'Přidat prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
