import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { TransactionsHeader } from '../transactions/TransactionsHeader';

export function TransactionsPage({ transactions = [], currency, locale, onOpenLogTransaction }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const txDate = new Date(t.date);
      if (period === 'daily') return txDate.toDateString() === new Date().toDateString();
      if (period === 'monthly') return txDate.getMonth() === month && txDate.getFullYear() === year;
      if (period === 'yearly') return txDate.getFullYear() === year;
      if (period === 'custom') return txDate.toDateString() === new Date(selectedDate).toDateString();
      return true;
    });
  }, [transactions, period, selectedDate, month, year]);

  const stats = useMemo(() => {
    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const count = filtered.length || 1;
    return { income, expense, net: income - expense, avgIncome: income / count, avgExpense: expense / count };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <TransactionsHeader 
        onOpenLogTransaction={onOpenLogTransaction}
        stats={stats}
        period={period} setPeriod={setPeriod}
        selectedDate={selectedDate} setSelectedDate={setSelectedDate}
        month={month} setMonth={setMonth}
        year={year} setYear={setYear}
        isExpanded={isExpanded} setIsExpanded={setIsExpanded}
      />

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm font-bold">No transactions found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{tx.description}</span>
                  <span className="text-[10px] uppercase font-black text-slate-400">{tx.date} • {tx.accountName}</span>
                </div>
                <span className={`font-mono font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency, locale)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}