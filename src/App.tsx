import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { DashboardPage } from './components/DashboardPage';
import { CreateInvoicePage } from './components/CreateInvoicePage';
import { InvoiceDetailPage } from './components/InvoiceDetailPage';
import { ClientInvoicePage } from './components/ClientInvoicePage';
import { RecurringPaymentsPage } from './components/RecurringPaymentsPage';
import { CreateRecurringPage } from './components/CreateRecurringPage';
import { RecurringDetailPage } from './components/RecurringDetailPage';
import { Invoice, RecurringPayment } from './types/invoice';
import { storage } from './utils/storage';
import { generateInvoiceId, getMockFiatEquivalent, calculateNextInvoiceDate, shouldGenerateInvoice } from './utils/crypto';

type AppState = 'login' | 'register' | 'dashboard' | 'create' | 'detail' | 'client' | 'recurring' | 'createRecurring' | 'recurringDetail';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<AppState>('login');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [currentRecurringPayment, setCurrentRecurringPayment] = useState<RecurringPayment | null>(null);

  // Initialize app state
  useEffect(() => {
    const loggedIn = storage.isLoggedIn();
    setIsLoggedIn(loggedIn);
    
    // Check for client invoice route
    const hash = window.location.hash;
    if (hash.startsWith('#/invoice/')) {
      const invoiceId = hash.replace('#/invoice/', '');
      const invoice = storage.getInvoiceById(invoiceId);
      setCurrentInvoice(invoice);
      setCurrentPage('client');
      return;
    }
    
    if (loggedIn) {
      setInvoices(storage.getInvoices());
      setRecurringPayments(storage.getRecurringPayments());
      setCurrentPage('dashboard');
      
      // Check for pending recurring payments that need invoices generated
      checkAndGenerateRecurringInvoices();
    } else {
      setCurrentPage('login');
    }
  }, []);

  // Handle route changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/invoice/')) {
        const invoiceId = hash.replace('#/invoice/', '');
        const invoice = storage.getInvoiceById(invoiceId);
        setCurrentInvoice(invoice);
        setCurrentPage('client');
      } else if (isLoggedIn && currentPage === 'client') {
        setCurrentPage('dashboard');
        setCurrentInvoice(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn, currentPage]);

  const checkAndGenerateRecurringInvoices = () => {
    const recurringPayments = storage.getRecurringPayments();
    let invoicesGenerated = false;

    recurringPayments.forEach(recurringPayment => {
      if (shouldGenerateInvoice(recurringPayment)) {
        generateRecurringInvoice(recurringPayment.id);
        invoicesGenerated = true;
      }
    });

    if (invoicesGenerated) {
      setInvoices(storage.getInvoices());
      setRecurringPayments(storage.getRecurringPayments());
    }
  };

  const generateRecurringInvoice = (recurringId: string) => {
    const recurringPayment = storage.getRecurringPaymentById(recurringId);
    if (!recurringPayment || recurringPayment.status !== 'Active') return;

    // Create new invoice from recurring payment
    const invoice: Invoice = {
      id: generateInvoiceId(),
      amount: recurringPayment.amount,
      currency: recurringPayment.currency,
      jobDescription: recurringPayment.jobDescription,
      walletAddress: recurringPayment.walletAddress,
      dueDate: calculateNextInvoiceDate('monthly', new Date().toISOString().split('T')[0]), // Due in 1 month
      customNotes: recurringPayment.customNotes,
      status: 'Pending Payment',
      createdAt: new Date().toISOString(),
      fiatEquivalent: recurringPayment.fiatEquivalent,
      recurringId: recurringPayment.id,
      isRecurring: true
    };

    // Save the invoice
    storage.addInvoice(invoice);

    // Update recurring payment
    const updatedRecurringPayment = {
      ...recurringPayment,
      lastInvoiceDate: new Date().toISOString().split('T')[0],
      nextInvoiceDate: calculateNextInvoiceDate(recurringPayment.frequency, new Date().toISOString().split('T')[0]),
      totalInvoicesGenerated: recurringPayment.totalInvoicesGenerated + 1
    };

    storage.updateRecurringPayment(updatedRecurringPayment);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setInvoices(storage.getInvoices());
    setRecurringPayments(storage.getRecurringPayments());
    setCurrentPage('dashboard');
    window.location.hash = '';
    checkAndGenerateRecurringInvoices();
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    setInvoices(storage.getInvoices());
    setRecurringPayments(storage.getRecurringPayments());
    setCurrentPage('dashboard');
    window.location.hash = '';
  };

  const handleLogout = () => {
    storage.clearAll();
    setIsLoggedIn(false);
    setInvoices([]);
    setRecurringPayments([]);
    setCurrentInvoice(null);
    setCurrentRecurringPayment(null);
    setCurrentPage('login');
    window.location.hash = '';
  };

  const handleCreateInvoice = () => {
    setCurrentPage('create');
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    storage.addInvoice(invoice);
    setInvoices(storage.getInvoices());
    setCurrentPage('dashboard');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setCurrentPage('detail');
  };

  const handleSimulatePayment = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      const updatedInvoice = { ...invoice, status: 'Paid' as const };
      storage.updateInvoice(updatedInvoice);
      setInvoices(storage.getInvoices());
      
      // Update current invoice if it's being viewed
      if (currentInvoice?.id === invoiceId) {
        setCurrentInvoice(updatedInvoice);
      }
    }
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setCurrentInvoice(null);
    setCurrentRecurringPayment(null);
  };

  const handleViewRecurringPayments = () => {
    setCurrentPage('recurring');
  };

  const handleCreateRecurring = () => {
    setCurrentPage('createRecurring');
  };

  const handleSaveRecurringPayment = (recurringPayment: RecurringPayment) => {
    storage.addRecurringPayment(recurringPayment);
    setRecurringPayments(storage.getRecurringPayments());
    setCurrentPage('recurring');
  };

  const handleViewRecurring = (recurringPayment: RecurringPayment) => {
    setCurrentRecurringPayment(recurringPayment);
    setCurrentPage('recurringDetail');
  };

  const handleToggleRecurringStatus = (id: string) => {
    const recurringPayment = recurringPayments.find(rp => rp.id === id);
    if (recurringPayment) {
      const newStatus = recurringPayment.status === 'Active' ? 'Paused' : 'Active';
      const updatedRecurringPayment = { ...recurringPayment, status: newStatus as any };
      storage.updateRecurringPayment(updatedRecurringPayment);
      setRecurringPayments(storage.getRecurringPayments());
      
      // Update current recurring payment if it's being viewed
      if (currentRecurringPayment?.id === id) {
        setCurrentRecurringPayment(updatedRecurringPayment);
      }
    }
  };

  const handleDeleteRecurring = (id: string) => {
    storage.deleteRecurringPayment(id);
    setRecurringPayments(storage.getRecurringPayments());
    
    // If we're viewing the deleted recurring payment, go back
    if (currentRecurringPayment?.id === id) {
      setCurrentPage('recurring');
      setCurrentRecurringPayment(null);
    }
  };

  const handleGenerateInvoiceFromRecurring = (id: string) => {
    generateRecurringInvoice(id);
    setInvoices(storage.getInvoices());
    setRecurringPayments(storage.getRecurringPayments());
  };

  // Render client view
  if (currentPage === 'client') {
    return <ClientInvoicePage invoice={currentInvoice} />;
  }

  // Render authentication pages
  if (!isLoggedIn) {
    if (currentPage === 'register') {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      );
    }
    
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage('register')}
      />
    );
  }

  // Render authenticated pages
  switch (currentPage) {
    case 'create':
      return (
        <CreateInvoicePage
          onBack={handleBackToDashboard}
          onSave={handleSaveInvoice}
        />
      );
    
    case 'detail':
      return currentInvoice ? (
        <InvoiceDetailPage
          invoice={currentInvoice}
          onBack={handleBackToDashboard}
        />
      ) : (
        <DashboardPage
          invoices={invoices}
          onCreateInvoice={handleCreateInvoice}
          onViewInvoice={handleViewInvoice}
          onSimulatePayment={handleSimulatePayment}
          onLogout={handleLogout}
          onViewRecurringPayments={handleViewRecurringPayments}
        />
      );

    case 'recurring':
      return (
        <RecurringPaymentsPage
          recurringPayments={recurringPayments}
          onBack={handleBackToDashboard}
          onCreateRecurring={handleCreateRecurring}
          onViewRecurring={handleViewRecurring}
          onToggleStatus={handleToggleRecurringStatus}
          onDeleteRecurring={handleDeleteRecurring}
          onGenerateInvoice={handleGenerateInvoiceFromRecurring}
        />
      );

    case 'createRecurring':
      return (
        <CreateRecurringPage
          onBack={() => setCurrentPage('recurring')}
          onSave={handleSaveRecurringPayment}
        />
      );

    case 'recurringDetail':
      return currentRecurringPayment ? (
        <RecurringDetailPage
          recurringPayment={currentRecurringPayment}
          onBack={() => setCurrentPage('recurring')}
          onToggleStatus={handleToggleRecurringStatus}
          onDeleteRecurring={handleDeleteRecurring}
          onGenerateInvoice={handleGenerateInvoiceFromRecurring}
        />
      ) : (
        <RecurringPaymentsPage
          recurringPayments={recurringPayments}
          onBack={handleBackToDashboard}
          onCreateRecurring={handleCreateRecurring}
          onViewRecurring={handleViewRecurring}
          onToggleStatus={handleToggleRecurringStatus}
          onDeleteRecurring={handleDeleteRecurring}
          onGenerateInvoice={handleGenerateInvoiceFromRecurring}
        />
      );
    
    default:
      return (
        <DashboardPage
          invoices={invoices}
          onCreateInvoice={handleCreateInvoice}
          onViewInvoice={handleViewInvoice}
          onSimulatePayment={handleSimulatePayment}
          onLogout={handleLogout}
          onViewRecurringPayments={handleViewRecurringPayments}
        />
      );
  }
}

export default App;