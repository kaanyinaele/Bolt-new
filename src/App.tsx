import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DashboardPage } from './components/DashboardPage';
import { CreateInvoicePage } from './components/CreateInvoicePage';
import { InvoiceDetailPage } from './components/InvoiceDetailPage';
import { ConnectWalletPage } from './components/ConnectWalletPage';
import { Invoice } from './types/invoice';

// Define AppState for page navigation
type AppState = 'dashboard' | 'create' | 'detail';

function App() {
  // Web3 state
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  // Application state
  const [currentPage, setCurrentPage] = useState<AppState>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]); // This will be populated from the blockchain
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Connect to the user's wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        const web3Signer = web3Provider.getSigner();
        const userAddress = await web3Signer.getAddress();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(userAddress);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet!');
    }
  };

  // Check for an existing connection and handle account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        // The window.ethereum check is done before this listener is attached
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const web3Signer = web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(accounts[0]);
      } else {
        setAccount(null);
        setSigner(null);
        setProvider(null);
      }
    };

    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            handleAccountsChanged(accounts);
            setCurrentPage('dashboard');
          }
          // Cast to any to access the 'on' method
          (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
        }
      } catch (error) {
        console.error('Error during wallet initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      // Cast to any to access the 'removeListener' method
      if ((window.ethereum as any)?.removeListener) {
        (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // TODO: Add handlers for creating, viewing, and interacting with invoices on the blockchain
  // For now, we'll use placeholder handlers
  const handleCreateNewInvoice = () => {
    setCurrentPage('create');
  };

  const handleSaveInvoice = (newInvoice: Omit<Invoice, 'id' | 'status'>) => {
    console.log('Deploying new invoice contract:', newInvoice);
    // This is where the ethers.js logic to deploy the contract will go.
    // For now, we'll mock it.
    const mockInvoice: Invoice = {
      id: `0x${Date.now().toString(16)}`, // Mock contract address
      ...newInvoice,
      status: 'Created',
    };
    setInvoices(prev => [...prev, mockInvoice]);
    setCurrentPage('dashboard');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setCurrentPage('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  // Main layout container with fixed badge
  const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="relative min-h-screen bg-gray-50">
      {/* Placeholder for a badge, hidden on mobile */}
      <div className="absolute top-6 right-6 z-50 hidden md:block">
        {/* Future badge can go here */}
      </div>
      <main className="flex-grow">{children}</main>
      <footer className="w-full bg-dark-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="https://bolt.new/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>Made with</span>
            <img src="/black_circle_360x360 copy.png" alt="Bolt Logo" className="h-5 w-5" />
            <span>Bolt</span>
          </a>
        </div>
      </footer>
    </div>
  );

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!account) {
    return <ConnectWalletPage onConnect={connectWallet} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            invoices={invoices}
            onCreateInvoice={handleCreateNewInvoice}
            onViewInvoice={handleViewInvoice}
            account={account}
          />
        );
      case 'create':
        return (
          <CreateInvoicePage
            onSave={handleSaveInvoice}
            onBack={handleBackToDashboard}
          />
        );
      case 'detail':
        return currentInvoice ? (
          <InvoiceDetailPage
            invoice={currentInvoice}
            onBack={handleBackToDashboard} 
            // TODO: Pass signer and provider for contract interactions
          />
        ) : null;

      default:
        return (
          <DashboardPage
            invoices={invoices}
            onCreateInvoice={handleCreateNewInvoice}
            onViewInvoice={handleViewInvoice}
            account={account}
          />
        );
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

export default App;