'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Category } from '@/types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  totalCount: number;
  isAuthenticated: boolean;
  userEmail?: string;
  onSelectCategory: (id: string | null) => void;
  onAddCategory: () => void;
}

export function Sidebar({
  categories,
  selectedCategory,
  totalCount,
  isAuthenticated,
  userEmail,
  onSelectCategory,
  onAddCategory,
}: SidebarProps) {
  const activeStyle = {
    boxShadow: 'inset 3px 3px 6px #D1D3DA, inset -3px -3px 6px #FFFFFF',
    borderRadius: '12px',
    background: 'var(--bg)',
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col gap-4 sticky top-6 self-start">
      {/* Logo */}
      <div className="neuro-raised px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(145deg, #FF5F55, #FF1A0E)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 3H12M2 7H9M2 11H6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
            prompts
            <span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="neuro-raised px-3 py-4 flex flex-col gap-0.5">
        <button
          onClick={() => onSelectCategory(null)}
          className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium w-full text-left transition-all"
          style={
            selectedCategory === null
              ? { ...activeStyle, color: 'var(--accent)' }
              : { color: 'var(--text-secondary)', borderRadius: '12px' }
          }
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
            <rect x="8" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
            <rect x="1" y="8" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
            <rect x="8" y="8" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.25" />
          </svg>
          <span className="flex-1">All</span>
          <span className="text-xs opacity-60 font-normal">{totalCount}</span>
        </button>

        {categories.length > 0 && (
          <div className="h-px mx-3 my-1.5" style={{ background: 'var(--shadow-dark)' }} />
        )}

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium w-full text-left transition-all"
            style={
              selectedCategory === cat.id
                ? { ...activeStyle, color: 'var(--text-primary)' }
                : { color: 'var(--text-secondary)', borderRadius: '12px' }
            }
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="flex-1 truncate">{cat.name}</span>
            <span className="text-xs opacity-50 font-normal shrink-0">
              {cat._count?.prompts ?? 0}
            </span>
          </button>
        ))}

        {isAuthenticated && (
          <button
            onClick={onAddCategory}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-all mt-0.5"
            style={{ color: '#9CA3AF', borderRadius: '12px' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 2V13M2 7.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add category
          </button>
        )}
      </div>

      {/* User */}
      <div className="neuro-raised px-4 py-3 mt-auto">
        {isAuthenticated ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(145deg, #FF5F55, #FF1A0E)' }}
            >
              {userEmail?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <p className="text-xs font-semibold flex-1 truncate min-w-0" style={{ color: 'var(--text-primary)' }}>
              {userEmail}
            </p>
            <button
              onClick={() => signOut()}
              className="shrink-0 transition-colors"
              style={{ color: '#9CA3AF' }}
              title="Sign out"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M5.5 2H3C2.45 2 2 2.45 2 3V12C2 12.55 2.45 13 3 13H5.5M10 10.5L13.5 7.5L10 4.5M13.5 7.5H6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M5 13H3C2.45 13 2 12.55 2 12V3C2 2.45 2.45 2 3 2H5M10 10.5L13.5 7.5L10 4.5M13.5 7.5H6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign in
          </Link>
        )}
      </div>
    </aside>
  );
}
