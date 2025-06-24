import { Invoice, User, RecurringPayment } from '../types/invoice';

const STORAGE_KEYS = {
  LOGGED_IN: 'invoiceFlow_loggedIn',
  USER: 'invoiceFlow_user',
  INVOICES: 'invoiceFlow_invoices',
  RECURRING_PAYMENTS: 'invoiceFlow_recurringPayments'
};

export const storage = {
  // Authentication
  setLoggedIn: (status: boolean) => {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, status.toString());
  },
  
  isLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
  },
  
  // User management
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },
  
  // Invoice management
  saveInvoices: (invoices: Invoice[]) => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },
  
  getInvoices: (): Invoice[] => {
    const invoicesData = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return invoicesData ? JSON.parse(invoicesData) : [];
  },
  
  addInvoice: (invoice: Invoice) => {
    const invoices = storage.getInvoices();
    invoices.push(invoice);
    storage.saveInvoices(invoices);
  },
  
  updateInvoice: (updatedInvoice: Invoice) => {
    const invoices = storage.getInvoices();
    const index = invoices.findIndex(invoice => invoice.id === updatedInvoice.id);
    if (index !== -1) {
      invoices[index] = updatedInvoice;
      storage.saveInvoices(invoices);
    }
  },
  
  getInvoiceById: (id: string): Invoice | null => {
    const invoices = storage.getInvoices();
    return invoices.find(invoice => invoice.id === id) || null;
  },

  // Recurring payment management
  saveRecurringPayments: (recurringPayments: RecurringPayment[]) => {
    localStorage.setItem(STORAGE_KEYS.RECURRING_PAYMENTS, JSON.stringify(recurringPayments));
  },
  
  getRecurringPayments: (): RecurringPayment[] => {
    const recurringData = localStorage.getItem(STORAGE_KEYS.RECURRING_PAYMENTS);
    return recurringData ? JSON.parse(recurringData) : [];
  },
  
  addRecurringPayment: (recurringPayment: RecurringPayment) => {
    const recurringPayments = storage.getRecurringPayments();
    recurringPayments.push(recurringPayment);
    storage.saveRecurringPayments(recurringPayments);
  },
  
  updateRecurringPayment: (updatedRecurringPayment: RecurringPayment) => {
    const recurringPayments = storage.getRecurringPayments();
    const index = recurringPayments.findIndex(rp => rp.id === updatedRecurringPayment.id);
    if (index !== -1) {
      recurringPayments[index] = updatedRecurringPayment;
      storage.saveRecurringPayments(recurringPayments);
    }
  },
  
  getRecurringPaymentById: (id: string): RecurringPayment | null => {
    const recurringPayments = storage.getRecurringPayments();
    return recurringPayments.find(rp => rp.id === id) || null;
  },

  deleteRecurringPayment: (id: string) => {
    const recurringPayments = storage.getRecurringPayments();
    const filtered = recurringPayments.filter(rp => rp.id !== id);
    storage.saveRecurringPayments(filtered);
  },
  
  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};