import React, { useState } from 'react';
import { Edit3, Trash2, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { GoalsHeader } from '../goals/GoalsHeader';
import { FundMovementPanel } from '../goals/FundMovementPanel';
import { formatCurrency } from '../../utils/formatters';

export function GoalsPage({ 
  goals = [], categories = [], accounts = [], currency, locale, symbol,
  onOpenAddGoal, onOpenEditGoal, onDeleteGoal, onUpdateGoalFunds, onOpenCategoryManager 
}) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [txAccounts, setTxAccounts] = useState({});
  const [txAmounts, setTxAmounts] = useState({});

  const handleFundMovement = (goalId, actionType) => {
    const amount = parseFloat(txAmounts[goalId]) || 0;
    const accountId = txAccounts[goalId] || accounts[0]?.id;
    if (amount <= 0 || !accountId) return;
    onUpdateGoalFunds({ goalId, accountId, amount, action: actionType });
    setTxAmounts(prev => ({ ...prev, [goalId]: '' }));
    setSelectedGoal(null);
  };

  return (
    <div className="space-y-6">
      <GoalsHeader 
        goalCount={goals.length}
        onOpenAddGoal={onOpenAddGoal}
        onOpenCategoryManager={onOpenCategoryManager}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal, index) => {
          const secureId = goal.id || `temp-${index}`;
          const cat = categories.find(c => c.id === goal.categoryId);
          const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100) || 0, 100);

          return (
            <div key={secureId} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border" 
                        style={{ color: cat?.color, borderColor: `${cat?.color}40`, backgroundColor: `${cat?.color}10` }}>
                    {cat?.name || 'General'}
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-2 truncate">{goal.title}</h4>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setSelectedGoal(goal)} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg">
                    <ArrowUpDown size={14} />
                  </button>
                  <button onClick={() => onOpenEditGoal(goal)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit3 size={14} /></button>
                  <button onClick={() => setGoalToDelete(goal)} className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current Progress</span>
                  <span className="text-sm font-black text-slate-900">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: cat?.color || '#6366f1' }} />
                </div>
                <div className="flex justify-between items-center pt-1 font-mono">
                  <span className="text-[11px] font-black text-slate-900">{formatCurrency(goal.currentAmount, currency, locale)}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Target: {formatCurrency(goal.targetAmount, currency, locale)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fund Movement Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 mb-4">Move Funds: {selectedGoal.title}</h3>
            <FundMovementPanel 
              goal={selectedGoal} 
              accounts={accounts} 
              currency={currency} 
              locale={locale} 
              symbol={symbol}
              currentAccount={txAccounts[selectedGoal.id] || accounts[0]?.id}
              txAmount={txAmounts[selectedGoal.id] || ''}
              onAccountChange={(id) => setTxAccounts(prev => ({ ...prev, [selectedGoal.id]: id }))}
              onAmountChange={(val) => setTxAmounts(prev => ({ ...prev, [selectedGoal.id]: val }))}
              onMoveFunds={(action) => handleFundMovement(selectedGoal.id, action)}
            />
            <button 
              onClick={() => setSelectedGoal(null)} 
              className="mt-4 w-full text-slate-400 text-xs font-bold py-2 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in-95 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Target?</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">Are you sure you want to delete "{goalToDelete.title}"? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setGoalToDelete(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl">Cancel</button>
              <button 
                onClick={() => { onDeleteGoal(goalToDelete.id); setGoalToDelete(null); }} 
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl"
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