import React, { useState } from 'react';
import { FolderKanban, Trash2, Plus, Palette } from 'lucide-react';

export function CategoryManagerModal({ categories = [], onAddCategory, onDeleteCategory }) {
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#6366f1');

  const handleCatSubmit = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    onAddCategory({ name: catName.trim(), color: catColor });
    setCatName('');
  };

  return (
    <div className="space-y-8">
      {/* Category Creation Form */}
      <form onSubmit={handleCatSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <FolderKanban size={12} /> Category Name
          </label>
          <input 
            type="text"
            placeholder="e.g., Tech Supplies, Travel"
            value={catName}
            onChange={e => setCatName(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-end gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Palette size={12} /> Theme
            </label>
            <input 
              type="color" 
              value={catColor} 
              onChange={e => setCatColor(e.target.value)}
              className="w-12 h-12 rounded-2xl cursor-pointer border-2 border-white dark:border-slate-700 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-1 bg-transparent"
            />
          </div>
          <button 
            type="submit" 
            className="flex-1 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Create Category
          </button>
        </div>
      </form>

      {/* Category List */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          Active Workspace Categories ({categories.length})
        </h4>
        
        {categories.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">No categories defined yet.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl flex justify-between items-center shadow-sm hover:border-slate-200 dark:hover:border-slate-600 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-bold text-slate-800 dark:text-white truncate">{cat.name}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => onDeleteCategory(cat.id)} 
                  className="text-slate-300 dark:text-slate-600 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}