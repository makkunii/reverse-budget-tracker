import React, { useState, useEffect } from 'react';
import { Edit3, History, Target, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Modal } from '../common/Modal';
import { GoalFormModal } from './GoalFormModal';
import { FundMovementPanel } from './FundMovementPanel';
import { formatCurrency } from '../../utils/formatters';

export function ViewGoalModal({ 
  isOpen, onClose, goal, category, onSave, onUpdateGoalFunds, 
  accounts, currency, locale, symbol, categories 
 }) {
  const [isEditing, setIsEditing] = useState(false);
  // Default state to empty string, fallback handled safely downstream
  const [txAccountId, setTxAccountId] = useState('');
  const [txAmount, setTxAmount] = useState('');

  // Clean Reset Effect: When the modal opens or the goal changes, reset tracking states safely
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      setTxAmount('');
      if (accounts.length > 0) {
        setTxAccountId(accounts[0].id);
      }
    }
  }, [isOpen, goal, accounts]);

  if (!goal) return null;

  const handleMoveFunds = (action) => {
    const amount = parseFloat(txAmount);
    // Use the active state or fallback to the first account safely
    const activeAccountId = txAccountId || accounts[0]?.id;
    
    if (amount <= 0 || !activeAccountId) return;
    
    onUpdateGoalFunds({ goalId: goal.id, accountId: activeAccountId, amount, action });
    setTxAmount('');
  };

  const handleSaveModifiedData = (updatedData) => {
    onSave(updatedData);
    setIsEditing(false); 
  };

  const handleClose = () => {
    setIsEditing(false);
    setTxAmount('');
    onClose();
  };

  const hasImage = !!goal.imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Edit Milestone" : goal.title}>
      {isEditing ? (
        <GoalFormModal 
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveModifiedData}
          categories={categories}
          symbol={symbol}
          editGoal={goal}
        />
      ) : (
        <div className="space-y-6 pt-2">
          {/* Visual Header Card Display */}
          <div className={`relative w-full h-32 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-end p-5 ${!hasImage ? 'bg-indigo-50 dark:bg-slate-800' : ''}`}>
            {hasImage && (
              <div className="absolute inset-0 z-0">
                <img src={goal.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
              </div>
            )}
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className={`text-[9px] font-black uppercase tracking-wider ${hasImage ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>Current Progress</p>
                <h2 className={`text-2xl font-black ${hasImage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {formatCurrency(goal.currentAmount, currency, locale)}
                </h2>
              </div>
              <button 
                onClick={() => setIsEditing(true)} 
                className={`p-2 rounded-xl transition-colors ${hasImage ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>

          {/* Unified Transaction Interaction Panel */}
          <FundMovementPanel 
            goal={goal} 
            accounts={accounts} 
            currency={currency} 
            locale={locale} 
            symbol={symbol}
            currentAccount={txAccountId || accounts[0]?.id || ''} // Fallback execution safely in UI layout
            txAmount={txAmount}
            onAccountChange={setTxAccountId}
            onAmountChange={setTxAmount}
            onMoveFunds={handleMoveFunds}
          />
        </div>
      )}
    </Modal>
  );
}