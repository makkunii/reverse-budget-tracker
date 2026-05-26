import React, { useState } from 'react';
import { History, ChevronLeft, ChevronRight, ArrowDownLeft } from 'lucide-react'; // Added History & ArrowDownLeft
import { formatCurrency } from '../../utils/formatters';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { IncomeFlowModal } from '../dashboard/IncomeFlowModal';

export function DashboardPage({ goals, accounts, onCommitPayday, history, currency, locale, symbol }) {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
        currency={currency}
        locale={locale}
        symbol={symbol}
      />

      {/* Ledger Section Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <History size={14} /> Historical Ledger Records ({history.length})
        </h3>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl">
          <p className="text-slate-400 text-xs font-bold">No system entries found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedHistory.map(item => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:border-indigo-100 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                      <ArrowDownLeft size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.accountName}</p>
                      <p className="text-[9px] font-bold text-slate-400">{item.date}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Total Income</span>
                    <span className="font-black text-slate-900 font-mono">+{formatCurrency(item.totalIncome, currency, locale)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Allocated</span>
                    <span className="font-black text-slate-900 font-mono">{formatCurrency(item.allocatedToGoals, currency, locale)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-emerald-600">Vaulted</span>
                    <span className="font-black text-emerald-600 font-mono text-sm">{formatCurrency(item.safeToSpend, currency, locale)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-black text-slate-400 px-2">PAGE {currentPage} / {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <IncomeFlowModal 
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        accounts={accounts}
        goals={goals}
        onCommitPayday={onCommitPayday}
        currency={currency}
        locale={locale}
        symbol={symbol}
      />
    </div>
  );
}