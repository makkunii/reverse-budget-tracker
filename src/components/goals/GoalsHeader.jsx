import React from 'react';
import { Target, Plus, FolderKanban } from 'lucide-react';

export function GoalsHeader({ goalCount, onOpenAddGoal, onOpenCategoryManager }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
      {/* Left Side: Branding & Stats */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <Target size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">Active System Targets</h2>
          <p className="text-xs text-slate-400 font-medium">
            You have {goalCount} active objectives currently being funded.
          </p>
        </div>
      </div>
      
      {/* Right Side: Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
        <button 
          onClick={onOpenCategoryManager}
          className="w-full sm:w-auto border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <FolderKanban size={14} /> Categories
        </button>
        
        <button 
          onClick={onOpenAddGoal}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={14} /> Create Target
        </button>
      </div>
    </div>
  );
}