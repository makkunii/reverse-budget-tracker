import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import currencies from './data/currencies.json';

import { DashboardPage } from './components/Pages/DashboardPage';
import { AccountManager } from './components/accounts/AccountManager';
import { GoalsPage } from './components/Pages/GoalsPage';
import { TransactionsPage } from './components/pages/TransactionsPage';
import { Navigation } from './components/common/Navigation';
import { Modal } from './components/common/Modal';
import { GoalFormModal } from './components/goals/GoalFormModal';
import { CategoryManagerModal } from './components/goals/CategoryManagerModal';
import { TransactionFormModal } from './components/transactions/TransactionFormModal';
import { TransferModal } from './components/accounts/TransferModal';
import { WhatsNewModal } from './components/dashboard/WhatsNewModal';
import { Header } from './components/common/Header';

import { Wallet } from 'lucide-react';

const INITIAL_APP_STATE = {
  settings: { currency: 'PHP', locale: 'en-PH', lastSeenVersion: '0.0.0' },
  accounts: [],
  categories: [
    { id: 'cat-1', name: 'Emergency Fund', color: '#f43f5e' },
    { id: 'cat-2', name: 'Investments', color: '#6366f1' },
    { id: 'cat-3', name: 'Big Purchases', color: '#f59e0b' }
  ],
  goals: [],
  history: [],
  transactions: [],
};

export default function App() {
  const [appState, setAppState] = useLocalStorage('reverse_budget_v5_data', INITIAL_APP_STATE);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isLogTransactionOpen, setIsLogTransactionOpen] = useState(false);
  
  // Modal layout states
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const currentCurrency = appState.settings.currency;
  const currentLocale = appState.settings.locale;
  const activeCurrencyMeta = currencies.find(c => c.code === currentCurrency) || currencies[0];

  const handleAddCategory = (catData) => {
    const newCat = { id: crypto.randomUUID(), ...catData };
    setAppState(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
  };

  const handleDeleteCategory = (id) => {
    setAppState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
      goals: prev.goals.map(g => g.categoryId === id ? { ...g, categoryId: '' } : g)
    }));
  };

  const handleOpenAddGoal = () => {
    setGoalToEdit(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (goalData) => {
      if (goalData.id) {
        setAppState(prev => ({
          ...prev,
          goals: prev.goals.map(g => g.id === goalData.id ? { ...g, ...goalData } : g)
        }));
      } else {
        // Ensure that even if a goal somehow lacks an ID, we force one here
        const newGoal = { 
          id: crypto.randomUUID(), 
          currentAmount: 0, 
          transactionLogs: [], 
          ...goalData 
        };
        setAppState(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
      }
  };

  const handleDeleteGoal = (id) => {
    if (!id) return;
    setAppState(prev => ({ 
      ...prev, 
      goals: prev.goals.filter(g => g.id && g.id !== id) 
    }));
  };

 const handleAddAccount = (accData) => {
  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  setAppState(prev => {
    const existingAccount = prev.accounts.find(a => a.id === accData.id);

    if (existingAccount) {
      let changes = [];
      if (existingAccount.balance !== accData.balance) {
        changes.push(`Balance: ${existingAccount.balance} → ${accData.balance}`);
      }
      if (existingAccount.name !== accData.name) {
        changes.push(`Name: "${existingAccount.name}" → "${accData.name}"`);
      }

      const updateLog = {
        id: crypto.randomUUID(),
        date: timestamp,
        type: 'update',
        amount: 0,
        description: changes.length > 0 ? changes.join(', ') : 'Account Metadata Updated'
      };

      return {
        ...prev,
        accounts: prev.accounts.map(a => 
          a.id === accData.id 
            ? { ...a, ...accData, transactionLogs: [updateLog, ...(a.transactionLogs || [])] }
            : a
        )
      };
    } else {
      const newAccount = { id: crypto.randomUUID(), ...accData, transactionLogs: [] };
      return { ...prev, accounts: [...prev.accounts, newAccount] };
    }
  });
};

  const handleDeleteAccount = (id) => {
    if (!id) return;
    setAppState(prev => ({ 
      ...prev, 
      accounts: prev.accounts.filter(a => a.id && a.id !== id) 
    }));
  };

  const handleCommitPayday = ({ accountId, income, allocations, safeToSpend }) => {
    const timestamp = new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });

    const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    setAppState(prev => {
      const updatedGoals = prev.goals.map(goal => {
        const amt = parseFloat(allocations[goal.id]) || 0;
        if (amt <= 0) return goal;
        return { 
          ...goal, 
          currentAmount: goal.currentAmount + amt,
          transactionLogs: [{ id: crypto.randomUUID(), date: timestamp, type: 'deposit', amount: amt, description: 'Payday Allocation' }, ...goal.transactionLogs]
        };
      });

      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === accountId) {
          return { 
            ...acc, 
            balance: acc.balance + income - totalAllocated,
            transactionLogs: [{ id: crypto.randomUUID(), date: timestamp, type: 'deposit', amount: income, description: 'Payday Income Received' }, ...(acc.transactionLogs || [])]
          };
        }
        return acc;
      });

      return {
        ...prev,
        accounts: updatedAccounts,
        goals: updatedGoals,
        history: [{ id: crypto.randomUUID(), date: timestamp, totalIncome: income, allocatedToGoals: totalAllocated, safeToSpend, accountName: prev.accounts.find(a => a.id === accountId)?.name || 'Payday' }, ...prev.history]
      };
    });
  };

  const handleUpdateGoalFunds = ({ goalId, accountId, amount, action }) => {
  setAppState(prev => {
    // 1. Find the target account
    const targetAccount = prev.accounts.find(a => a.id === accountId);
    if (!targetAccount) return prev;

    // 2. Find the target goal safely (matching by ID OR fallback temporary array index string)
    const targetGoal = prev.goals.find((g, idx) => {
      const fallbackId = `temp-goal-key-${idx}`;
      return g.id === goalId || fallbackId === goalId;
    });

    if (!targetGoal) return prev;

    const timestamp = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // 3. Construct the card log entry
    const goalTransactionLogEntry = {
      id: crypto.randomUUID(),
      date: timestamp,
      type: action,
      amount: amount,
      accountName: targetAccount.name
    };

    // 4. Update the goals collection mapping references correctly
    const updatedGoals = prev.goals.map((g, idx) => {
      const fallbackId = `temp-goal-key-${idx}`;
      if (g.id === goalId || fallbackId === goalId) {
        const structuralAdjustment = action === 'deposit' ? amount : -amount;
        return { 
          ...g, 
          currentAmount: Math.max(0, g.currentAmount + structuralAdjustment),
          transactionLogs: [goalTransactionLogEntry, ...(g.transactionLogs || [])]
        };
      }
      return g;
    });

    // 5. Update the asset balances
    const updatedAccounts = prev.accounts.map(acc => {
      if (acc.id !== accountId) return acc;
      const structuralAdjustment = action === 'deposit' ? -amount : amount;
      return { ...acc, balance: acc.balance + structuralAdjustment };
    });

    // 6. Build systemic historical tracker logs
    const adjustmentLog = {
      id: crypto.randomUUID(),
      date: timestamp,
      totalIncome: 0,
      allocatedToGoals: action === 'deposit' ? amount : -amount,
      safeToSpend: 0,
      accountName: action === 'deposit' 
        ? `→ ${targetGoal.title} (${targetAccount.name})`
        : `← ${targetGoal.title} (${targetAccount.name})`
    };

    return {
      ...prev,
      goals: updatedGoals,
      accounts: updatedAccounts,
      history: [adjustmentLog, ...prev.history]
    };
  });
  };

  const handleUpdateAccountFunds = ({ accountId, amount, action }) => {
    setAppState(prev => {
      const targetAccount = prev.accounts.find(a => a.id === accountId);
      if (!targetAccount) return prev;

      // Validate if pulling out more than available pool balance
      if (action === 'withdraw' && targetAccount.balance < amount) return prev;

      const timestamp = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // 1. Create specialized local account transaction entry
      const localLogEntry = {
        id: crypto.randomUUID(),
        date: timestamp,
        type: action, // 'deposit' or 'withdraw'
        amount: amount,
        description: action === 'deposit' ? 'Manual Inject' : 'Manual Withdrawal'
      };

      // 2. Map and update account base state with nested array history tracking
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === accountId) {
          const adjustment = action === 'deposit' ? amount : -amount;
          return {
            ...acc,
            balance: Math.max(0, acc.balance + adjustment),
            transactionLogs: [localLogEntry, ...(acc.transactionLogs || [])]
          };
        }
        return acc;
      });

      // 3. Keep systemic historical tracker logs updated
      const adjustmentLog = {
        id: crypto.randomUUID(),
        date: timestamp,
        totalIncome: action === 'deposit' ? amount : 0,
        allocatedToGoals: 0,
        safeToSpend: action === 'withdraw' ? amount : 0,
        accountName: action === 'deposit' 
          ? `↓ Injected into Pool (${targetAccount.name})`
          : `↑ Withdrew from Pool (${targetAccount.name})`
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        history: [adjustmentLog, ...prev.history]
      };
    });
  };

  const totalNetWorth = appState.accounts.reduce((sum, a) => sum + a.balance, 0);

  const handleCurrencyChange = (newCurrencyCode) => {
    const target = currencies.find(c => c.code === newCurrencyCode);
    if (target) {
      setAppState(prev => ({ 
        ...prev, 
        settings: { currency: target.code, locale: target.locale } 
      }));
    }
  };

  const handleLogTransaction = (txData) => {
    const timestamp = new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });

    setAppState(prev => {
      const targetAccount = prev.accounts.find(a => a.id === txData.accountId);
      if (!targetAccount) return prev;

      const newTransaction = {
        id: crypto.randomUUID(),
        date: timestamp,
        ...txData,
        accountName: targetAccount.name,
        amount: parseFloat(txData.amount)
      };

      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === txData.accountId) {
          const adjustment = txData.type === 'income' ? txData.amount : -txData.amount;
          return { 
            ...acc, 
            balance: acc.balance + adjustment,
            transactionLogs: [{ 
              id: newTransaction.id, 
              date: timestamp, 
              type: txData.type === 'income' ? 'deposit' : 'withdraw', 
              amount: txData.amount, 
              description: txData.description 
            }, ...acc.transactionLogs]
          };
        }
        return acc;
      });

      return { 
        ...prev, 
        accounts: updatedAccounts, 
        transactions: [newTransaction, ...prev.transactions] 
      };
    });
  };

  const handleTransferFunds = ({ sourceAccountId, targetAccountId, amount }) => {
    setAppState(prev => {
      const sourceAcc = prev.accounts.find(a => a.id === sourceAccountId);
      const targetAcc = prev.accounts.find(a => a.id === targetAccountId);
      if (!sourceAcc || !targetAcc || sourceAcc.balance < amount) return prev;

      const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === sourceAccountId) return { ...acc, balance: acc.balance - amount, transactionLogs: [{ id: crypto.randomUUID(), date: timestamp, type: 'withdraw', amount, description: `Transfer to ${targetAcc.name}` }, ...acc.transactionLogs] };
        if (acc.id === targetAccountId) return { ...acc, balance: acc.balance + amount, transactionLogs: [{ id: crypto.randomUUID(), date: timestamp, type: 'deposit', amount, description: `Transfer from ${sourceAcc.name}` }, ...acc.transactionLogs] };
        return acc;
      });

      return { ...prev, accounts: updatedAccounts };
    });
  };

  useEffect(() => {
    const now = new Date();
    let hasChanges = false;

    const updatedAccounts = appState.accounts.map(acc => {
      if (acc.type !== 'High-Yield Savings' || !acc.interestRate) return acc;

      // Check logs for recent payout
      const lastInterestLog = acc.transactionLogs
        ?.filter(log => log.description === 'Automatic Interest Payout')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      const lastDate = lastInterestLog ? new Date(lastInterestLog.date) : null;
      
      // Determine if payout is needed based on frequency
      const needsPayout = !lastDate || (
        (acc.frequency === 'Daily' && now.toDateString() !== lastDate.toDateString()) ||
        (acc.frequency === 'Monthly' && (now.getMonth() !== lastDate.getMonth() || now.getFullYear() !== lastDate.getFullYear())) ||
        (acc.frequency === 'Quarterly' && (Math.floor(now.getMonth() / 3) !== Math.floor(lastDate.getMonth() / 3) || now.getFullYear() !== lastDate.getFullYear())) ||
        (acc.frequency === 'Yearly' && now.getFullYear() !== lastDate.getFullYear())
      );

      if (needsPayout) {
        hasChanges = true;
        const payout = acc.balance * (acc.interestRate / 100);
        const payoutLog = {
          id: crypto.randomUUID(),
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'deposit',
          amount: payout,
          description: 'Automatic Interest Payout'
        };

        return {
          ...acc,
          balance: acc.balance + payout,
          transactionLogs: [payoutLog, ...(acc.transactionLogs || [])]
        };
      }
      return acc;
    });

    if (hasChanges) {
      setAppState(prev => ({ ...prev, accounts: updatedAccounts }));
    }
  },[]);

  const handleUpdateVersion = (version) => {
    setAppState(prev => ({
      ...prev,
      settings: { ...prev.settings, lastSeenVersion: version }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block Section */}
        <Header 
          totalNetWorth={totalNetWorth}
          currentCurrency={currentCurrency}
          currentLocale={currentLocale}
          currencies={currencies}
          onCurrencyChange={handleCurrencyChange}
        />

        {/* Global Navigation Component */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* View Switch Workspace Layer */}
        <main className="pt-1">
          {activeTab === 'dashboard' && (
            <DashboardPage 
              goals={appState.goals} accounts={appState.accounts} onCommitPayday={handleCommitPayday} history={appState.history}
              currency={currentCurrency} locale={currentLocale} symbol={activeCurrencyMeta.symbol}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountManager 
              accounts={appState.accounts} 
              onSaveAccount={handleAddAccount}
              onDeleteAccount={handleDeleteAccount}
              onUpdateAccountFunds={handleUpdateAccountFunds}
              onOpenTransfer={() => setIsTransferModalOpen(true)}
              currency={currentCurrency} 
              locale={currentLocale} 
              symbol={activeCurrencyMeta.symbol}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsPage 
              goals={appState.goals} categories={appState.categories} accounts={appState.accounts}
              currency={currentCurrency} locale={currentLocale} symbol={activeCurrencyMeta.symbol}
              onOpenAddGoal={handleOpenAddGoal} onOpenEditGoal={handleOpenEditGoal} onDeleteGoal={handleDeleteGoal}
              onUpdateGoalFunds={handleUpdateGoalFunds}
              onOpenCategoryManager={() => setIsCatModalOpen(true)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsPage 
              transactions={appState.transactions}
              accounts={appState.accounts}
              currency={currentCurrency}
              locale={currentLocale}
              symbol={activeCurrencyMeta.symbol}
              onOpenLogTransaction={() => setIsLogTransactionOpen(true)}
            />
          )}
        </main>

        {/* Target Form Management Modal */}
        <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={goalToEdit ? "Modify Target Parameters" : "Launch Target Milestone Asset"}>
          <GoalFormModal 
            isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onSave={handleSaveGoal}
            categories={appState.categories} symbol={activeCurrencyMeta.symbol} editGoal={goalToEdit}
          />
        </Modal>

        {/* Category Setup Modal Window */}
        <Modal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title="Manage System Expense Categories">
          <CategoryManagerModal 
            categories={appState.categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </Modal>

        <TransferModal 
          isOpen={isTransferModalOpen} 
          onClose={() => setIsTransferModalOpen(false)} 
          onTransfer={handleTransferFunds}
          accounts={appState.accounts}
          symbol={activeCurrencyMeta.symbol}
        />

        <TransactionFormModal 
          isOpen={isLogTransactionOpen} 
          onClose={() => setIsLogTransactionOpen(false)} 
          onSave={handleLogTransaction}
          accounts={appState.accounts}
          symbol={activeCurrencyMeta.symbol}
        />

        <WhatsNewModal 
          currentVersion="1.0.6" 
          lastSeenVersion={appState.settings.lastSeenVersion}
          onUpdateVersion={handleUpdateVersion}
        />
      </div>
    </div>
  );
}