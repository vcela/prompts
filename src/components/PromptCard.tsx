'use client';
import { useState } from 'react';
import { Prompt } from '@/types';

interface PromptCardProps {
  prompt: Prompt;
  isAuthenticated: boolean;
  onCopy: (text: string) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, isAuthenticated, onCopy, onEdit, onDelete }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = prompt.content.length > 160;

  return (
    <div className="neuro-raised p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-[10px_10px_20px_#D1D3DA,_-10px_-10px_20px_#FFFFFF]">
      {prompt.category && (
        <span
          className="self-start text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
          style={{ backgroundColor: prompt.category.color }}
        >
          {prompt.category.name}
        </span>
      )}

      <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
        {prompt.title}
      </h3>

      <div>
        <p
          className="text-xs leading-relaxed"
          style={{
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: expanded ? 'unset' : 3,
            overflow: 'hidden',
          }}
        >
          {prompt.content}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold mt-1 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {expanded ? 'Less ↑' : 'More ↓'}
          </button>
        )}
      </div>

      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#E0E2EA', color: '#6B7280' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-xs" style={{ color: '#9CA3AF' }}>
          {new Date(prompt.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <button
                onClick={() => onEdit(prompt)}
                className="neuro-circle w-8 h-8 flex items-center justify-center"
                style={{ color: '#9CA3AF' }}
                title="Edit"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M10 2L12 4L4.5 11.5H2.5V9.5L10 2Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                className="neuro-circle w-8 h-8 flex items-center justify-center hover:text-red-500 transition-colors"
                style={{ color: '#9CA3AF' }}
                title="Delete"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 3.5H12M5 3.5V2.5H9V3.5M5.5 6V10M8.5 6V10M3 3.5L3.5 11.5H10.5L11 3.5H3Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={() => onCopy(prompt.content)}
            className="accent-btn w-9 h-9 flex items-center justify-center rounded-full"
            title="Copy"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1.5" y="4.5" width="8" height="9" rx="1.5" stroke="white" strokeWidth="1.3" />
              <path
                d="M4.5 4.5V3C4.5 2.17 5.17 1.5 6 1.5H12C12.83 1.5 13.5 2.17 13.5 3V9C13.5 9.83 12.83 10.5 12 10.5H10.5"
                stroke="white"
                strokeWidth="1.3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
