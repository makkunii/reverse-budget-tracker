import React, { useState } from 'react';
import { 
  History, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, Repeat, 
  Coins, ShieldCheck, PieChart, Landmark, TrendingDown, ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { IncomeFlowModal } from '../dashboard/IncomeFlowModal';

export function DashboardPage({ goals, accounts, onCommitPayday, history, currency, locale, symbol }) {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // New state engine to manage timeframe scope filter
  const [expenseTimeframe, setExpenseTimeframe] = useState('Day'); // 'Day' | 'Week' | 'Month'

  // --- 📊 ANALYTICAL DASHBOARD ENGINE MATH ---
  const totalFluidCash = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalAllocatedToGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const aggregateNetWorth = totalFluidCash + totalAllocatedToGoals;
  
  const totalTargetMilestones = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
  const overallGoalProgress = totalTargetMilestones > 0 
    ? (totalAllocatedToGoals / totalTargetMilestones) * 100 
    : 0;

  // --- 🗓️ DYNAMIC TIMEFRAME EXPENSE ENGINE ---
  const calculateExpensesByTimeframe = () => {
    const now = new Date();
    let totalExpense = 0;

    // Filter and aggregate master history logs or transactions
    history.forEach(item => {
      const itemDate = new Date(item.date);
      if (isNaN(itemDate.getTime())) return;

      const diffTime = Math.abs(now - itemDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Match actions representing net fluid cash decreases or goal outward shifts
      const amountValue = parseFloat(item.allocatedToGoals) || 0;
      const safeToSpendVal = parseFloat(item.safeToSpend) || 0;
      
      let isTargetAction = false;
      let cost = 0;

      if (item.accountName.includes('Withdrew')) {
        isTargetAction = true;
        cost = safeToSpendVal;
      } else if (amountValue < 0) {
        isTargetAction = true;
        cost = Math.abs(amountValue);
      }

      if (isTargetAction) {
        if (expenseTimeframe === 'Day' && diffDays <= 1) {
          totalExpense += cost;
        } else if (expenseTimeframe === 'Week' && diffDays <= 7) {
          totalExpense += cost;
        } else if (expenseTimeframe === 'Month' && diffDays <= 30) {
          totalExpense += cost;
        }
      }
    });

    return totalExpense;
  };

  const currentExpenseVolume = calculateExpensesByTimeframe();

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getLedgerIcon = (item) => {
    if (item.totalIncome > 0) return <ArrowDownLeft size={14} className="text-emerald-500" />;
    if (item.accountName.startsWith('→')) return <ArrowDownLeft size={14} className="text-indigo-500" />;
    if (item.accountName.startsWith('←')) return <ArrowUpRight size={14} className="text-amber-500" />;
    return <Repeat size={14} className="text-slate-400" />;
  };

  return (
    <div className="space-y-5">
      {/* Primary Action Header Block */}
      <DashboardHeader 
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
        currency={currency}
        locale={locale}
        symbol={symbol}
      />

      {/* --- ⚡ ULTRA-COMPACT METRICS GRID (3 COLUMNS ON MOBILE, 5 ON DESKTOP) --- */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2.5 px-0.5">

        {/* --- 🌟 DYNAMIC EXPENSE TRACKER CARD WITH TIMEFRAME TOGGLE --- */}
        <div className="col-span-3 lg:col-span-1 bg-white dark:bg-slate-900 border border-rose-100/60 dark:border-rose-950/40 rounded-2xl p-3 shadow-sm flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-2">
          <div className="flex flex-col justify-between min-w-0 flex-1 lg:flex-none">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[9px] font-black uppercase text-rose-500 dark:text-rose-400 tracking-wider">
                {expenseTimeframe === 'Day' ? 'Today' : expenseTimeframe === 'Week' ? 'This Week' : 'This Month'}
              </span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <ArrowDownRight size={14} className="text-rose-500 shrink-0" />
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono truncate">
                {formatCurrency(currentExpenseVolume, currency, locale)}
              </h3>
            </div>
          </div>

          {/* Micro Toggle Selector Controls */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-0.5 rounded-lg flex gap-0.5 shrink-0 self-center lg:self-auto">
            {['Day', 'Week', 'Month'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setExpenseTimeframe(t)}
                className={`text-[8px] font-black px-2 py-1 rounded-md transition-all uppercase tracking-tight ${
                  expenseTimeframe === t
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        {/* Metric 1: Aggregate Net Worth */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider truncate">Net Worth</span>
            <div className="p-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md shrink-0">
              <Coins size={11} />
            </div>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm lg:text-base font-black text-slate-900 dark:text-white font-mono truncate">
              {formatCurrency(aggregateNetWorth, currency, locale)}
            </h3>
            <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 truncate">Liquid + milestones</p>
          </div>
        </div>

        {/* Metric 2: Available Fluid Cash */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider truncate">Fluid Cash</span>
            <div className="p-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md shrink-0">
              <Landmark size={11} />
            </div>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm lg:text-base font-black text-slate-900 dark:text-white font-mono truncate">
              {formatCurrency(totalFluidCash, currency, locale)}
            </h3>
            <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
              {aggregateNetWorth > 0 ? ((totalFluidCash / aggregateNetWorth) * 100).toFixed(0) : 0}% Fluid
            </p>
          </div>
        </div>

        {/* Metric 3: Total Vaulted Milestone Allocations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider truncate">Vaulted</span>
            <div className="p-1 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-md shrink-0">
              <ShieldCheck size={11} />
            </div>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm lg:text-base font-black text-slate-900 dark:text-white font-mono truncate">
              {formatCurrency(totalAllocatedToGoals, currency, locale)}
            </h3>
            <p className="text-[8px] font-bold text-pink-600 dark:text-pink-400 truncate">
              {aggregateNetWorth > 0 ? ((totalAllocatedToGoals / aggregateNetWorth) * 100).toFixed(0) : 0}% Vault
            </p>
          </div>
        </div>

        {/* Metric 4: System Progress Index */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider truncate">Progress</span>
            <div className="p-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-md shrink-0">
              <PieChart size={11} />
            </div>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm lg:text-base font-black text-slate-900 dark:text-white font-mono truncate">
              {overallGoalProgress.toFixed(1)}%
            </h3>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, overallGoalProgress)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- 🧾 COMPACT HIGH-DENSITY HISTORICAL LEDGER LIST --- */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest flex items-center gap-2">
            <History size={14} /> Historical Records ({history.length})
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">No records found.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {paginatedHistory.map(item => {
                const isPayday = item.totalIncome > 0;

                return (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                    
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                        {getLedgerIcon(item)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate tracking-tight">
                          {item.accountName}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                          {item.date} • {isPayday ? 'Payday' : item.allocatedToGoals !== 0 ? 'Goal Shift' : 'Pool'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isPayday ? (
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                            +{formatCurrency(item.totalIncome, currency, locale)}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500">
                            Pool +{formatCurrency(item.safeToSpend, currency, locale)}
                          </span>
                        </div>
                      ) : (
                        <span className={`font-mono text-xs font-black ${
                          item.allocatedToGoals > 0 || item.totalIncome > 0 || item.accountName.includes('Injected')
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {item.allocatedToGoals !== 0 
                            ? (item.allocatedToGoals > 0 ? `+` : ``) + formatCurrency(item.allocatedToGoals, currency, locale)
                            : (item.safeToSpend > 0 ? (item.accountName.includes('Withdrew') ? `-` : `+`) : ``) + formatCurrency(item.safeToSpend, currency, locale)
                          }
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dense Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-1 text-slate-900 dark:text-slate-200">
            <button 
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider">PAGE {currentPage} / {totalPages}</span>
            <button 
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

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