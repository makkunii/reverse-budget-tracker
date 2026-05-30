import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Wallet, Landmark } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { AuditLog } from './AuditLog';

export function FundMovementPanel({ 
  goal, accounts, currency, locale, symbol, 
  currentAccount, txAmount, onAccountChange, onAmountChange, onMoveFunds 
}) {
  // Find the live selected account object to check its balance restrictions
  const activeAccountObj = accounts.find(a => a.id === currentAccount) || accounts[0];
  const parsedTxAmount = parseFloat(txAmount) || 0;

  // Safety Overdraft Checks
  const isOverdrawingAccount = activeAccountObj ? activeAccountObj.balance < parsedTxAmount : true;
  const isOverdrawingGoal = goal.currentAmount < parsedTxAmount;

  return (
    <div className="space-y-6">
      {/* Transaction Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Wallet size={12} /> Source Account
          </label>
          <select 
            value={currentAccount} 
            onChange={(e) => onAccountChange(e.target.value)} 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
          >
            {accounts.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} — {formatCurrency(a.balance, currency, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Landmark size={12} /> Transaction Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-sm">{symbol}</span>
            <input 
              type="number" 
              step="any"
              placeholder="0.00" 
              value={txAmount} 
              onChange={(e) => onAmountChange(e.target.value)} 
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-black font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Shift In (Deposit to Goal, Withdraw from Account) */}
        <button 
          type="button"
          onClick={() => onMoveFunds('deposit')} 
          disabled={parsedTxAmount <= 0 || isOverdrawingAccount} 
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <ArrowDownToLine size={14} /> Shift In
        </button>

        {/* Pull Out (Withdraw from Goal, Deposit to Account) */}
        <button 
          type="button"
          onClick={() => onMoveFunds('withdraw')} 
          disabled={parsedTxAmount <= 0 || isOverdrawingGoal} 
          className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10"
        >
          <ArrowUpFromLine size={14} /> Pull Out
        </button>
      </div>

      {/* Audit Log */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <h5 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-3">Transaction History</h5>
        <div className="max-h-40 overflow-y-auto">
          <AuditLog logs={goal.transactionLogs} currency={currency} locale={locale} />
        </div>
      </div>
    </div>
  );
}