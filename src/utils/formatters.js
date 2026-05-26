// src/utils/formatters.js
export const formatCurrency = (value, currency = 'PHP', locale = 'en-PH') => {
  if (value === null || value === undefined || isNaN(value)) return '';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      currencyDisplay: 'symbol', 
    }).format(value);
  } catch (error) {
    console.error(`Formatting failed for currency: ${currency}`, error);
    return `${currency.toUpperCase()} ${Number(value).toFixed(2)}`;
  }
};