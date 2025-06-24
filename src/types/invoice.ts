export interface Invoice {
  id: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  jobDescription: string;
  walletAddress: string;
  dueDate: string;
  customNotes: string;
  status: 'Pending Payment' | 'Paid';
  createdAt: string;
  fiatEquivalent: number;
  recurringId?: string; // Links to recurring payment if applicable
  isRecurring?: boolean;
}

export interface RecurringPayment {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC';
  jobDescription: string;
  walletAddress: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string; // Optional end date
  customNotes: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  createdAt: string;
  lastInvoiceDate?: string;
  nextInvoiceDate: string;
  totalInvoicesGenerated: number;
  fiatEquivalent: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}