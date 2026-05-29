import React from 'react';
import { LayoutDashboard, Landmark, Target, Receipt } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'Accounts', icon: Landmark },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'transactions', label: 'Ledger', icon: Receipt }
];

export function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl max-w-sm w-full mx-auto shadow-sm">
      <div className="flex gap-0.5 w-full">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id} 
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-1 flex-1 font-bold text-[10px] sm:text-xs py-2 px-1 sm:px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={12} className="sm:mr-0.5" /> 
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}