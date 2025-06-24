// Represents the status of an invoice, aligned with the smart contract enum.
export type InvoiceStatus = 'Created' | 'Funded' | 'Completed' | 'Cancelled';

export interface Invoice {
  id: string; // Corresponds to the smart contract address
  clientName: string;
  clientEmail: string;
  jobDescription: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  cryptoAmount: string; // The amount in the selected cryptocurrency
  cryptoCurrency: string; // The selected cryptocurrency symbol (e.g., 'ETH', 'USDC')
  walletAddress: string; // The recipient's wallet address
  dueDate: string;
  customNotes: string;
  status: InvoiceStatus;
  createdAt: string;
  fiatEquivalent: number;
  updatedAt?: string;
  paidAt?: string;
  transactionHash?: string; // Blockchain transaction hash
}