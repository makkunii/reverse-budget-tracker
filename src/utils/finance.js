export const calculateInterest = (balance, rate, frequency) => {
  if (!rate || rate === 0) return 0;
  
  // Convert percentage to decimal
  const r = rate / 100;
  
  // Periods per year
  const n = { 'Daily': 365, 'Monthly': 12, 'Quarterly': 4, 'Yearly': 1 }[frequency] || 1;
  
  // Formula: A = P(1 + r/n)^(nt) - P (The interest portion only for 1 year)
  // Simple Annual Compound Interest: P * (1 + r/n)^n - P
  const annualAmount = balance * Math.pow((1 + r / n), n);
  return annualAmount - balance;
};