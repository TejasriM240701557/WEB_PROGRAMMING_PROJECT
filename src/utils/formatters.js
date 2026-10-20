import { CURRENCIES } from './constants';

export const formatCurrency = (amount, currencyCode = 'INR', hideDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  
  const options = {
    minimumFractionDigits: hideDecimals ? 0 : 2,
    maximumFractionDigits: hideDecimals ? 0 : 2,
  };

  const formattedNum = Math.abs(amount).toLocaleString('en-IN', options);
  const sign = amount < 0 ? '-' : '';
  return `${sign}${curr.symbol}${formattedNum}`;
};

export const formatCompactINR = (amount, currencyCode = 'INR') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  // Indian Crores (1 Cr = 1,00,00,000 = 10,000,000)
  if (abs >= 10_000_000) {
    return `${sign}${curr.symbol}${(abs / 10_000_000).toFixed(2)} Cr`;
  }
  // Indian Lakhs (1 Lakh = 1,00,000 = 100,000)
  if (abs >= 100_000) {
    return `${sign}${curr.symbol}${(abs / 100_000).toFixed(1)} L`;
  }
  // Thousands (1k)
  if (abs >= 1_000) {
    return `${sign}${curr.symbol}${(abs / 1_000).toFixed(0)}k`;
  }
  return `${sign}${curr.symbol}${abs.toFixed(0)}`;
};

export const formatShortCurrency = (amount, currencyCode = 'INR') => {
  return formatCompactINR(amount, currencyCode);
};

export const formatDate = (dateString, formatType = 'standard') => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  if (formatType === 'short') {
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }
  if (formatType === 'monthYear') {
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }
  if (formatType === 'quarter') {
    const q = Math.floor(d.getMonth() / 3) + 1;
    return `Q${q} ${d.getFullYear()}`;
  }
  if (formatType === 'full') {
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatPercent = (value, showSign = true) => {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const formatMonthsRunway = (months) => {
  if (months === Infinity || months > 120) return '>10 Years';
  if (months <= 0) return 'Depleted';
  return `${months.toFixed(1)} Months`;
};
