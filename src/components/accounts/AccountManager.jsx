import React, { useState } from 'react';
import { Trash2, AlertTriangle, MoreVertical, History } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ViewAccountModal } from './ViewAccountModal';
import { AccountHeader } from './AccountHeader';
import { Modal } from '../common/Modal';
import { AccountForm } from './AccountForm';

export function AccountManager({ accounts = [], onSaveAccount, onDeleteAccount, onUpdateAccountFunds, currency, locale, symbol, onOpenTransfer }) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeAccountId, setActiveAccountId] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const liveActiveAccount = accounts.find(acc => acc.id === activeAccountId);

  return (
    <div className="space-y-6">
      <AccountHeader 
        accountCount={accounts.length} 
        onAddAccount={() => setIsCreateModalOpen(true)}
        onOpenTransfer={onOpenTransfer}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {accounts.map(acc => {
          const hasImage = !!acc.imageUrl;
          return (
            <div 
              key={acc.id} 
              onClick={() => { 
                setActiveAccountId(acc.id); 
                setIsViewModalOpen(true); 
                setOpenMenuId(null); // Clear any open 3-dot menus right here
              }}
              className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col min-h-[160px] cursor-pointer"
            >
              {hasImage && (
                <div className="absolute inset-0 z-0">
                  <img src={acc.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                </div>
              )}

              <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <span 
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border 
                      ${hasImage 
                        ? 'bg-slate-900/80 border-slate-700 text-white shadow-sm' 
                        : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {acc.type}
                    </span>
                  
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === acc.id ? null : acc.id)}
                      className={`p-1 rounded-lg transition-colors ${hasImage ? 'text-white/70 hover:bg-white/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === acc.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                        <button 
                          onClick={() => { setActiveAccountId(acc.id); setIsViewModalOpen(true); setOpenMenuId(null); }} 
                          className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          <History size={14} /> View Details
                        </button>
                        <button onClick={() => { setDeleteTarget(acc); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className={`text-sm font-black truncate ${hasImage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{acc.name}</h3>
                  <p className={`text-xs font-black font-mono ${hasImage ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {formatCurrency(acc.balance, currency, locale)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center border border-slate-100 dark:border-slate-800">
            <div className="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Account?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">Permanently remove "{deleteTarget.name}"? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-3 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={() => { onDeleteAccount(deleteTarget.id); setDeleteTarget(null); }} 
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consolidated View/Edit Modal */}
      <ViewAccountModal 
        isOpen={isViewModalOpen} 
        onClose={() => { setIsViewModalOpen(false); setActiveAccountId(null); }} 
        account={liveActiveAccount}
        onSaveAccount={onSaveAccount}
        onUpdateAccountFunds={onUpdateAccountFunds}
        currency={currency}
        locale={locale}
        symbol={symbol}
      />

      {/* New Account Creation Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Link Capital Account">
        <AccountForm onSaveAccount={onSaveAccount} onClose={() => setIsCreateModalOpen(false)} symbol={symbol} />
      </Modal>
    </div>
  );
}