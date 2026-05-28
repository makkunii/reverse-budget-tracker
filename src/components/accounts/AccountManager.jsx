import React, { useState } from 'react';
import { Trash2, Edit3, History, AlertTriangle, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { AccountForm } from './AccountForm';
import { Modal } from '../common/Modal';
import { HistoryModal } from './HistoryModal';
import { AccountHeader } from './AccountHeader';

export function AccountManager({ accounts = [], onSaveAccount, onDeleteAccount, onUpdateAccountFunds, currency, locale, symbol, onOpenTransfer }) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div className="space-y-6">
      <AccountHeader 
        accountCount={accounts.length} 
        onAddAccount={() => { setActiveAccount(null); setIsFormModalOpen(true); }}
        onOpenTransfer={onOpenTransfer}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <div 
            key={acc.id} 
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {acc.type}
                </span>
                <button 
                  onClick={() => { setActiveAccount(acc); setIsHistoryModalOpen(true); }} 
                  className="text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  <History size={16} />
                </button>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-3 truncate">{acc.name}</h3>
            </div>

            <div>
              <p className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                {formatCurrency(acc.balance, currency, locale)}
              </p>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => { setActiveAccount(acc); setIsFormModalOpen(true); }} 
                  className="flex-1 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 py-2 rounded-xl transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setDeleteTarget(acc)} 
                  className="flex-1 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 py-2 rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Account?</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">Permanently remove "{deleteTarget.name}"? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl">Cancel</button>
              <button 
                onClick={() => { onDeleteAccount(deleteTarget.id); setDeleteTarget(null); }} 
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <HistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        onUpdateAccountFunds={onUpdateAccountFunds}
        account={activeAccount}
        currency={currency}
        locale={locale}
        symbol={symbol}
      />

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={activeAccount ? "Modify Asset Parameters" : "Link Capital Account"}>
        <AccountForm onSaveAccount={onSaveAccount} onClose={() => setIsFormModalOpen(false)} symbol={symbol} editAccount={activeAccount} />
      </Modal>
    </div>
  );
}