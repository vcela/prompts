'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="neuro-inset flex items-center gap-3 px-4 py-3">
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="shrink-0">
        <circle cx="7.5" cy="7.5" r="5" stroke="#9CA3AF" strokeWidth="1.5" />
        <path d="M11.5 11.5L15 15" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hledat prompty — název, obsah, tag..."
        className="bg-transparent outline-none text-sm flex-1 placeholder-[#9CA3AF] font-medium"
        style={{ color: 'var(--text-primary)' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
