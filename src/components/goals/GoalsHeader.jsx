import React from 'react';
import { Target, Plus, FolderKanban } from 'lucide-react';

export function GoalsHeader({ goalCount, onOpenAddGoal, onOpenCategoryManager }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
      {/* Left Side: Branding & Stats */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
          <Target size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Active System Targets</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            You have {goalCount} active objectives currently being funded.
          </p>
        </div>
      </div>
      
      {/* Right Side: Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <button 
          onClick={onOpenCategoryManager}
          className="w-full sm:w-auto border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FolderKanban size={14} /> Categories
        </button>
        
        <button 
          onClick={onOpenAddGoal}
          className="w-full sm:w-auto bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={14} /> Create Target
        </button>
      </div>
    </div>
  );
}