import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { ArrowDownLeft, ArrowUpRight, Settings } from 'lucide-react';

export function PoolAuditLog({ logs = [], currency, locale }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-400">No independent adjustments recorded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log, index) => {
        const isDeposit = log.type === 'deposit';
        const isUpdate = log.type === 'update';

        return (
          <div key={log.id || index} className="flex items-center justify-between bg-white p-3 border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Status Icon */}
              <div className={`p-1.5 rounded-lg ${
                isUpdate ? 'bg-slate-100 text-slate-500' : 
                isDeposit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {isUpdate ? <Settings size={12} /> : isDeposit ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
              </div>
              
              {/* Details */}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-700 truncate">{log.description}</span>
                <span className="text-[9px] font-medium text-slate-400">{log.date}</span>
              </div>
            </div>

            {/* Amount / System Label */}
            {isUpdate ? (
              <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">System</span>
            ) : (
              <span className={`font-mono font-black text-xs shrink-0 ${isDeposit ? 'text-emerald-600' : 'text-slate-900'}`}>
                {isDeposit ? '+' : '-'}{formatCurrency(log.amount, currency, locale)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}