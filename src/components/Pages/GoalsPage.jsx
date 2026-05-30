import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { GoalsHeader } from '../goals/GoalsHeader';
import { GoalCard } from '../goals/GoalCard';
import { ViewGoalModal } from '../goals/ViewGoalModal';

export function GoalsPage({ 
  goals = [], categories = [], accounts = [], currency, locale, symbol,
  onOpenAddGoal, onSaveGoal, onDeleteGoal, onUpdateGoalFunds, onOpenCategoryManager 
}) {
  const [activeGoalId, setActiveGoalId] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Dynamically extract the fresh goal details from live state array
  const liveActiveGoal = goals.find(g => g.id === activeGoalId);

  return (
    <div className="space-y-6">
      <GoalsHeader 
        goalCount={goals.length}
        onOpenAddGoal={onOpenAddGoal}
        onOpenCategoryManager={onOpenCategoryManager}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {goals.map((goal, index) => (
          <GoalCard 
            key={goal.id || `temp-${index}`}
            goal={goal}
            category={categories.find(c => c.id === goal.categoryId)}
            currency={currency}
            locale={locale}
            menuId={openMenuId}
            onMenuToggle={(id) => setOpenMenuId(id)}
            onSelect={(g) => {
              setActiveGoalId(g.id);
              setOpenMenuId(null); // Close active options list on selection click
            }}
            onEdit={(g) => {
              setActiveGoalId(g.id); // Open the unified view modal
              setOpenMenuId(null);   // Close the dropdown cleanly
            }}
            onDelete={(g) => {
              setGoalToDelete(g);
              setOpenMenuId(null);   // Close the dropdown cleanly
            }}
          />
        ))}
      </div>

      {/* Unified View / Edit / Fund Movement Modal */}
      <ViewGoalModal 
        isOpen={!!activeGoalId}
        onClose={() => setActiveGoalId(null)}
        goal={liveActiveGoal}
        category={categories.find(c => c?.id === liveActiveGoal?.categoryId)}
        accounts={accounts}
        currency={currency}
        locale={locale}
        symbol={symbol}
        categories={categories}
        onSave={onSaveGoal}
        onUpdateGoalFunds={onUpdateGoalFunds}
      />

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in-95 text-center border border-slate-200 dark:border-slate-800">
            <div className="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Target?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">Are you sure you want to delete "{goalToDelete.title}"? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setGoalToDelete(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-3 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={() => { onDeleteGoal(goalToDelete.id); setGoalToDelete(null); }} 
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}