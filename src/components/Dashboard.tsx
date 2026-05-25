'use client';
import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Prompt, Category } from '@/types';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { PromptCard } from './PromptCard';
import { Toast } from './Toast';
import { PromptModal } from './PromptModal';
import { CategoryModal } from './CategoryModal';

interface DashboardProps {
  initialPrompts: Prompt[];
  initialCategories: Category[];
  isAuthenticated: boolean;
  userEmail?: string;
}

export function Dashboard({ initialPrompts, initialCategories, isAuthenticated, userEmail }: DashboardProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>(undefined);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    prompts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    let result = prompts;

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) => selectedTags.some((tag) => p.tags.includes(tag)));
    }

    if (searchQuery.trim()) {
      const fuse = new Fuse(result, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'content', weight: 1 },
          { name: 'tags', weight: 1.5 },
        ],
        threshold: 0.4,
        includeScore: true,
      });
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    return result;
  }, [prompts, selectedCategory, selectedTags, searchQuery]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    showToast('Zkopírováno do schránky');
  }, [showToast]);

  const handleAddPrompt = async (data: { title: string; content: string; tags: string[]; categoryId: string | null }) => {
    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    const newPrompt: Prompt = await res.json();
    setPrompts((prev) => [newPrompt, ...prev]);
    setShowPromptModal(false);
    if (newPrompt.categoryId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === newPrompt.categoryId
            ? { ...c, _count: { prompts: (c._count?.prompts ?? 0) + 1 } }
            : c
        )
      );
    }
  };

  const handleEditPrompt = async (data: { title: string; content: string; tags: string[]; categoryId: string | null }) => {
    if (!editingPrompt) return;
    const prevCatId = editingPrompt.categoryId;
    const res = await fetch(`/api/prompts/${editingPrompt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    const updated: Prompt = await res.json();
    setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (prevCatId !== updated.categoryId) {
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === prevCatId) return { ...c, _count: { prompts: Math.max(0, (c._count?.prompts ?? 0) - 1) } };
          if (c.id === updated.categoryId) return { ...c, _count: { prompts: (c._count?.prompts ?? 0) + 1 } };
          return c;
        })
      );
    }
    setEditingPrompt(undefined);
    setShowPromptModal(false);
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Opravdu smazat tento prompt?')) return;
    const deleted = prompts.find((p) => p.id === id);
    const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
    if (!res.ok) return;
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    if (deleted?.categoryId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === deleted.categoryId
            ? { ...c, _count: { prompts: Math.max(0, (c._count?.prompts ?? 0) - 1) } }
            : c
        )
      );
    }
  };

  const handleAddCategory = async (data: { name: string; color: string }) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    const newCat: Category = await res.json();
    setCategories((prev) => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
    setShowCategoryModal(false);
  };

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const promptCount = (n: number) => {
    if (n === 1) return '1 prompt';
    if (n < 5) return `${n} prompty`;
    return `${n} promptů`;
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  return (
    <div className="min-h-screen p-5 md:p-6 flex gap-5 md:gap-6" style={{ background: 'var(--bg)' }}>
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        totalCount={prompts.length}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onSelectCategory={(id) => { setSelectedCategory(id); setSelectedTags([]); setSearchQuery(''); }}
        onAddCategory={() => setShowCategoryModal(true)}
      />

      <main className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          {isAuthenticated && (
            <button
              onClick={() => { setEditingPrompt(undefined); setShowPromptModal(true); }}
              className="accent-btn flex items-center gap-2 px-5 py-3 text-sm font-semibold shrink-0"
              style={{ borderRadius: '12px' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1V12M1 6.5H12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Nový prompt
            </button>
          )}
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-150"
                style={
                  selectedTags.includes(tag)
                    ? {
                        background: 'linear-gradient(145deg, #FF5F55, #FF1A0E)',
                        color: '#fff',
                        boxShadow: '3px 3px 8px rgba(255,59,48,0.4)',
                      }
                    : {
                        background: 'var(--bg)',
                        color: 'var(--text-secondary)',
                        boxShadow: '3px 3px 6px var(--shadow-dark), -3px -3px 6px var(--shadow-light)',
                      }
                }
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Count + clear */}
        <div className="flex items-center justify-between -mt-1">
          <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
            {promptCount(filteredPrompts.length)}
            {selectedCategory &&
              ` · ${categories.find((c) => c.id === selectedCategory)?.name ?? ''}`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedTags([]); }}
              className="text-xs font-semibold transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Vymazat filtry ×
            </button>
          )}
        </div>

        {/* Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isAuthenticated={isAuthenticated}
                onCopy={handleCopy}
                onEdit={(p) => { setEditingPrompt(p); setShowPromptModal(true); }}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="neuro-raised p-12 text-center flex flex-col items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--bg)', boxShadow: 'inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light)' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4 8H24M4 14H18M4 20H14" stroke="#D1D3DA" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {hasActiveFilters ? 'Žádné výsledky' : 'Zatím žádné prompty'}
                </p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  {hasActiveFilters
                    ? 'Zkuste jiný výraz nebo filtr'
                    : 'Přidejte první prompt a začněte sbírat'}
                </p>
              </div>
              {isAuthenticated && !hasActiveFilters && (
                <button
                  onClick={() => { setEditingPrompt(undefined); setShowPromptModal(true); }}
                  className="accent-btn px-5 py-2.5 text-sm font-semibold"
                  style={{ borderRadius: '10px' }}
                >
                  Přidat první prompt
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {showPromptModal && (
        <PromptModal
          prompt={editingPrompt}
          categories={categories}
          onSave={editingPrompt ? handleEditPrompt : handleAddPrompt}
          onClose={() => { setShowPromptModal(false); setEditingPrompt(undefined); }}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onSave={handleAddCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
