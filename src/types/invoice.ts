// Represents the status of an invoice, aligned with the smart contract enum.
export type InvoiceStatus = 'Created' | 'Funded' | 'Completed' | 'Cancelled';

export interface Invoice {
  id: string; // Corresponds to the smart contract address
  clientName: string;
  clientEmail: string;
  jobDescription: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  walletAddress: string; // The recipient's wallet address
  dueDate: string;
  customNotes: string;
  status: InvoiceStatus;
  createdAt: string;
  fiatEquivalent: number;
}