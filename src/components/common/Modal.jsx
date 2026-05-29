import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, size = "max-w-md" }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm">
      <div className={`bg-white dark:bg-slate-900 w-full ${size} rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}