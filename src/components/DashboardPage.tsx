import React, { useState } from 'react';
import { Plus, Eye, CheckCircle, Clock, Coins, Search, ArrowUpRight, Copy, ExternalLink, ChevronDown, FileText as DocumentText } from 'lucide-react';
import { Invoice } from '../types/invoice';
import { formatFiat } from '../utils/crypto';
import { FloatingBadge } from './FloatingBadge';

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    Created: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Funded: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    Cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status}
    </span>
  );
};

interface DashboardPageProps {
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  account: string | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  invoices,
  onCreateInvoice,
  onViewInvoice,
  account
}) => {
  const totalFunded = invoices.filter(inv => inv.status === 'Funded').length;
  const totalCompleted = invoices.filter(inv => inv.status === 'Completed').length;
  const totalValue = invoices.reduce((sum, inv) => sum + inv.fiatEquivalent, 0);

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchQuery === '' || 
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && invoice.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent animate-spin-slow" />
      </div>

      {/* Floating badge - hidden on mobile */}
      <div className="fixed bottom-6 left-6 z-50 hidden md:block">
        <FloatingBadge />
      </div>

      {/* Header */}
      <header className="bg-dark-800/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl p-2 shadow-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  InvoyBox
                </h1>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-xs text-gray-400">
                    {account ? truncateAddress(account) : 'Not connected'}
                    <button 
                      onClick={() => account && navigator.clipboard.writeText(account)}
                      className="ml-1 text-gray-500 hover:text-gray-300 transition-colors"
                      title="Copy address"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-dark-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button
                onClick={onCreateInvoice}
                className="group relative overflow-hidden px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-500 hover:to-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 transition-all duration-200 transform-gpu hover:shadow-glow"
              >
                <span className="relative z-10 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Clock}
            title="Total Invoices"
            value={invoices.length}
            color="blue"
            onClick={() => setActiveTab('all')}
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={totalFunded}
            color="yellow"
            onClick={() => setActiveTab('funded')}
          />
          <StatCard
            icon={CheckCircle}
            title="Completed"
            value={totalCompleted}
            color="green"
            onClick={() => setActiveTab('completed')}
          />
          <StatCard
            icon={Coins}
            title="Total Value"
            value={formatFiat(totalValue)}
            color="purple"
            onClick={() => {}}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['All', 'Created', 'Funded', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                }`}
              >
                {tab}
                {tab === 'All' && (
                  <span className="ml-2 bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded-full">
                    {invoices.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Invoices Table */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-2xl overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-dark-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      ID
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-800/30 divide-y divide-white/5">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} onViewInvoice={onViewInvoice} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <DocumentText className="h-12 w-12 text-gray-600" />
                        <p className="text-sm">No invoices found</p>
                        <button
                          onClick={onCreateInvoice}
                          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Create your first invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// StatCard Component
interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color: 'yellow' | 'green' | 'blue' | 'purple';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, onClick }) => {
  const colorMap = {
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/20',
    green: 'from-green-500/20 to-green-600/20 border-green-500/20',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/20',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/20',
  };

  const iconColorMap = {
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color]} p-5 cursor-pointer transition-all duration-300 hover:shadow-glow hover:border-opacity-40`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/5 rounded-full"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/5 ${iconColorMap[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-400">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          <span>View all</span>
        </div>
      </div>
    </div>
  );
};

// InvoiceRow Component
interface InvoiceRowProps {
  invoice: Invoice;
  onViewInvoice: (invoice: Invoice) => void;
}

const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice, onViewInvoice }) => {
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewInvoice(invoice);
  };

  return (
    <tr 
      className="group hover:bg-white/5 transition-colors duration-150 cursor-pointer border-b border-white/5 last:border-0"
      onClick={() => onViewInvoice(invoice)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center mr-3">
            <DocumentText className="h-4 w-4 text-primary-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {invoice?.id ? `INV-${String(invoice.id).substring(0, 8).toUpperCase()}` : 'INV-UNKNOWN'}
            </div>
            <div className="text-xs text-gray-400">{new Date(invoice.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-white">{invoice.clientName || 'Unnamed Client'}</div>
        <div className="text-xs text-gray-400">{invoice.clientEmail || 'No email'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-white">{formatFiat(invoice.fiatEquivalent)}</div>
        <div className="text-xs text-gray-400">{invoice.cryptoAmount} {invoice.cryptoCurrency}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">
          {new Date(invoice.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
        <div className={`text-xs ${
          new Date(invoice.dueDate) < new Date() && invoice.status !== 'Completed' && invoice.status !== 'Cancelled'
            ? 'text-red-400' 
            : 'text-gray-400'
        }`}>
          {new Date(invoice.dueDate) < new Date() && invoice.status !== 'Completed' && invoice.status !== 'Cancelled'
            ? 'Overdue' 
            : 'Due'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={invoice.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={handleViewClick}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-150"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/invoices/${invoice.id}`, '_blank');
            }}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-150"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};