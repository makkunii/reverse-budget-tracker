import React from 'react';
import { LayoutDashboard, Landmark, Target } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'Accounts', icon: Landmark },
  { id: 'goals', label: 'Goals', icon: Target }
];

export function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="flex items-center bg-white border border-slate-200 p-1.5 rounded-2xl max-w-sm shadow-sm">
      <div className="flex gap-1 w-full">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id} 
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-1.5 flex-1 font-bold text-xs py-2 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}