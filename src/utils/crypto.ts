export const generateInvoiceId = (): string => {
  return 'inv_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const generateRecurringId = (): string => {
  return 'rec_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const generatePaymentURI = (currency: string, address: string, amount: number): string => {
  switch (currency.toLowerCase()) {
    case 'btc':
      return `bitcoin:${address}?amount=${amount}`;
    case 'eth':
      return `ethereum:${address}?value=${amount}`;
    case 'usdt':
    case 'usdc':
      return `ethereum:${address}?value=${amount}`;
    default:
      return `${currency.toLowerCase()}:${address}?amount=${amount}`;
  }
};

export const getMockFiatEquivalent = (currency: string, amount: number): number => {
  // Mock exchange rates for demonstration
  const rates = {
    BTC: 43000,
    ETH: 2400,
    USDT: 1,
    USDC: 1
  };
  
  return amount * (rates[currency as keyof typeof rates] || 1);
};

export const formatCurrency = (amount: number, currency: string): string => {
  if (currency === 'BTC') {
    return `${amount.toFixed(8)} BTC`;
  }
  if (currency === 'ETH') {
    return `${amount.toFixed(6)} ETH`;
  }
  return `${amount.toFixed(2)} ${currency}`;
};

export const formatFiat = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Fetches the current Ethereum gas price (in gwei) from Etherscan and ETH/USD price from CoinGecko.
 * Returns an estimate of the network fee for a standard ETH transfer (21,000 gas) in ETH and USD.
 */
export const fetchNetworkFeeEstimate = async (): Promise<{ eth: number; usd: number } | null> => {
  try {
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
    if (!apiKey) throw new Error('Missing VITE_ETHERSCAN_API_KEY');

    // 1. Fetch current gas price from Etherscan (returns in wei)
    const gasRes = await fetch(
      `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`
    );
    const gasData = await gasRes.json();
    const gasPriceGwei = parseFloat(gasData?.result?.ProposeGasPrice);
    if (isNaN(gasPriceGwei)) throw new Error('Invalid gas price');

    // 2. Fetch current ETH/USD price from CoinGecko
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const priceData = await priceRes.json();
    const ethUsd = priceData?.ethereum?.usd;
    if (!ethUsd) throw new Error('Invalid ETH/USD price');

    // 3. Estimate fee: gasPrice (gwei) * gasLimit (21,000) = total gwei
    const gasLimit = 21000;
    const feeEth = (gasPriceGwei * gasLimit) / 1e9; // gwei to ETH
    const feeUsd = feeEth * ethUsd;
    return { eth: feeEth, usd: feeUsd };
  } catch (err) {
    console.error('Failed to fetch network fee estimate:', err);
    return null;
  }
};

export const calculateNextInvoiceDate = (frequency: string, lastDate: string): string => {
  const date = new Date(lastDate);
  
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  
  return date.toISOString().split('T')[0];
};

export const getFrequencyLabel = (frequency: string): string => {
  const labels = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly'
  };
  return labels[frequency as keyof typeof labels] || 'Monthly';
};

export const shouldGenerateInvoice = (recurringPayment: any): boolean => {
  if (recurringPayment.status !== 'Active') return false;
  
  const today = new Date().toISOString().split('T')[0];
  return recurringPayment.nextInvoiceDate <= today;
};