import React, { useState } from 'react';
import { Edit3, History, Landmark, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Modal } from '../common/Modal';
import { AccountForm } from './AccountForm';
import { PoolAuditLog } from './PoolAuditLog';
import { formatCurrency } from '../../utils/formatters';

export function ViewAccountModal({ isOpen, onClose, account, onSaveAccount, onUpdateAccountFunds, currency, locale, symbol }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState('');

  if (!account) return null;

  const parsedAmount = parseFloat(amount) || 0;

  const handleAction = (action) => {
    if (!parsedAmount || parsedAmount <= 0) return;
    if (action === 'withdraw' && account.balance < parsedAmount) return; // Core safety guard
    
    onUpdateAccountFunds({ accountId: account.id, amount: parsedAmount, action });
    setAmount('');
  };

  const handleClose = () => {
    setIsEditing(false);
    setAmount('');
    onClose();
  };

  const hasImage = !!account.imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? "Edit Account" : account.name}>
      {isEditing ? (
        <AccountForm 
          onSaveAccount={onSaveAccount} 
          onClose={() => setIsEditing(false)} 
          symbol={symbol} 
          currency={currency}
          locale={locale}
          editAccount={account} 
        />
      ) : (
        <div className="space-y-6 pt-2">
          {/* Visual Card Display */}
          <div className={`relative w-full h-32 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-end p-5 ${!hasImage ? 'bg-indigo-50 dark:bg-slate-800' : ''}`}>
            {hasImage && (
              <div className="absolute inset-0 z-0">
                <img src={account.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
              </div>
            )}
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className={`text-[9px] font-black uppercase tracking-wider ${hasImage ? 'text-white/70' : 'text-slate-400'}`}>Current Balance</p>
                <h2 className={`text-2xl font-black ${hasImage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {formatCurrency(account.balance, currency, locale)}
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

          {/* Transaction Controls */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Landmark size={12} /> Transaction
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-sm">{symbol}</span>
              <input 
                type="number" 
                step="any"
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleAction('deposit')} 
              disabled={!amount || parsedAmount <= 0} 
              className="bg-indigo-600 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ArrowDownToLine size={14} /> Inject
            </button>
            <button 
              onClick={() => handleAction('withdraw')} 
              disabled={!amount || parsedAmount <= 0 || account.balance < parsedAmount} 
              className="bg-slate-900 dark:bg-slate-700 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ArrowUpFromLine size={14} /> Withdraw
            </button>
          </div>

          {/* History */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h5 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
              <History size={12} /> Transaction History
            </h5>
            <div className="max-h-[200px] overflow-y-auto">
              <PoolAuditLog logs={account.transactionLogs} currency={currency} locale={locale} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}