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
export type NetworkFeeEstimate = {
  asset: string; // e.g. 'MATIC', 'ETH'
  fee: number;   // in asset
  usd: number;   // in USD
};

/**
 * Fetches the current network fee estimate for Polygon (MATIC, USDT, USDC) or Ethereum (ETH).
 * - For Polygon: Uses Polygon Gas Station and CoinGecko for MATIC/USD.
 * - For Ethereum: Uses Etherscan and CoinGecko for ETH/USD.
 *
 * @param currency 'MATIC' | 'USDT' | 'USDC' | 'ETH'
 * @param network 'polygon' | 'ethereum'
 * @returns { asset, fee, usd } or null if error
 */
/**
 * Fetch the current USD price for a given crypto (BTC, ETH, USDT, USDC, MATIC) using CoinGecko.
 * @param currency Symbol (e.g. 'BTC', 'ETH', 'USDT', 'USDC', 'MATIC')
 * @returns price in USD as a number
 */
export const fetchCryptoUsdPrice = async (currency: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'MATIC'): Promise<number | null> => {
  try {
    const idMap: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      USDT: 'tether',
      USDC: 'usd-coin',
      MATIC: 'matic-network',
    };
    const id = idMap[currency];
    if (!id) return null;
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.[id]?.usd ?? null;
  } catch (err) {
    console.error('Failed to fetch crypto USD price:', err);
    return null;
  }
};

export const fetchNetworkFeeEstimate = async (
  currency: 'MATIC' | 'USDT' | 'USDC' | 'ETH',
  network: 'polygon' | 'ethereum' = 'polygon'
): Promise<NetworkFeeEstimate | null> => {
  try {
    if (network === 'polygon') {
      // 1. Fetch gas price from Polygon Gas Station (gwei)
      const gasRes = await fetch('https://gasstation.polygon.technology/v2');
      const gasData = await gasRes.json();
      // Use 'standard' gas price (gwei)
      const gasPriceGwei = gasData?.standard?.maxFee;
      if (!gasPriceGwei || isNaN(gasPriceGwei)) throw new Error('Invalid Polygon gas price');
      // 2. Fetch MATIC/USD price
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
      const priceData = await priceRes.json();
      const maticUsd = priceData?.['matic-network']?.usd;
      if (!maticUsd) throw new Error('Invalid MATIC/USD price');
      // 3. Gas limit: 21,000 for MATIC, 60,000 for USDT/USDC
      const gasLimit = currency === 'MATIC' ? 21000 : 60000;
      const feeMatic = (gasPriceGwei * gasLimit) / 1e9; // gwei to MATIC
      const feeUsd = feeMatic * maticUsd;
      return { asset: 'MATIC', fee: feeMatic, usd: feeUsd };
    } else if (network === 'ethereum') {
      // ETH/ERC-20 on Ethereum (legacy fallback)
      const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
      if (!apiKey) throw new Error('Missing VITE_ETHERSCAN_API_KEY');
      const gasRes = await fetch(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`
      );
      const gasData = await gasRes.json();
      const gasPriceGwei = parseFloat(gasData?.result?.ProposeGasPrice);
      if (isNaN(gasPriceGwei)) throw new Error('Invalid gas price');
      const priceRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const priceData = await priceRes.json();
      const ethUsd = priceData?.ethereum?.usd;
      if (!ethUsd) throw new Error('Invalid ETH/USD price');
      const gasLimit = currency === 'ETH' ? 21000 : 60000;
      const feeEth = (gasPriceGwei * gasLimit) / 1e9;
      const feeUsd = feeEth * ethUsd;
      return { asset: 'ETH', fee: feeEth, usd: feeUsd };
    }
    return null;
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