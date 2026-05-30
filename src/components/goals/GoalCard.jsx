import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Trash2, History } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export function GoalCard({ goal, category, currency, locale, onSelect, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100) || 0, 100);
  const hasImage = !!goal.imageUrl;

  // Fallback styling for Category Badge color stability
  const badgeColor = category?.color || '#6366f1';

  // Close menu dynamically when clicking outside anywhere on the window layout
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      onClick={() => onSelect(goal)}
      className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col min-h-[160px] cursor-pointer group"
    >
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <img src={goal.imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        </div>
      )}

      <div className="relative z-10 p-4 flex flex-col justify-between h-full flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            {/* High Contrast / High Readability Category Tag Layout */}
            <span 
              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border truncate inline-block ${
                hasImage 
                  ? 'bg-slate-900/80 border-slate-700 text-white shadow-sm' 
                  : 'shadow-sm'
              }`}
              style={!hasImage ? { 
                backgroundColor: `${badgeColor}15`, 
                borderColor: `${badgeColor}30`, 
                color: badgeColor 
              } : undefined}
            >
              {category?.name || 'General'}
            </span>
            <h4 className={`text-sm font-black mt-2 truncate ${hasImage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              {goal.title}
            </h4>
          </div>
          
          {/* Action Context Menu Dropdown Trigger */}
          <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-1 rounded-lg transition-colors ${hasImage ? 'text-white/70 hover:bg-white/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <MoreVertical size={16} />
            </button>

            {/* Local Context Option Dropdown Panel */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <button 
                  onClick={() => { onSelect(goal); setShowMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <History size={14} />View Details
                </button>
                {/* <button 
                  onClick={() => { onEdit(goal); setShowMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <Edit3 size={14} /> Edit
                </button> */}
                <button 
                  onClick={() => { onDelete(goal); setShowMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5 mt-4">
          <div className="flex justify-between items-baseline gap-1">
            <p className={`text-xs font-black font-mono truncate ${hasImage ? 'text-white/90' : 'text-slate-900 dark:text-white'}`}>
              {formatCurrency(goal.currentAmount, currency, locale)}
            </p>
            <span className={`text-[10px] font-bold ${hasImage ? 'text-white/60' : 'text-slate-400'}`}>
              / {formatCurrency(goal.targetAmount, currency, locale)}
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${hasImage ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${pct}%`, backgroundColor: badgeColor }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}