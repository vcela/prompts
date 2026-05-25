'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 z-50 animate-toast" style={{ transform: 'translateX(-50%)' }}>
      <div
        className="px-6 py-3 rounded-full text-white font-semibold text-sm flex items-center gap-2.5 whitespace-nowrap"
        style={{
          background: 'linear-gradient(145deg, #FF5F55, #FF1A0E)',
          boxShadow: '0 8px 24px rgba(255,59,48,0.45)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {message}
      </div>
    </div>
  );
}
