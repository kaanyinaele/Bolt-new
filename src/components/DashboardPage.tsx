import React from 'react';
import { Plus, Eye, CheckCircle, Clock, Coins } from 'lucide-react';
import { Invoice } from '../types/invoice';
import { formatCurrency, formatFiat } from '../utils/crypto';
import { FloatingBadge } from './FloatingBadge';

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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="fixed bottom-6 left-6 z-50">
        <FloatingBadge />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InvoiceFlow</h1>
              <p className="text-sm text-gray-600">Connected: {truncateAddress(account || '')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Clock} title="Funded Invoices" value={totalFunded} color="yellow" />
          <StatCard icon={CheckCircle} title="Completed Invoices" value={totalCompleted} color="green" />
          <StatCard icon={Coins} title="Total Value" value={formatFiat(totalValue)} color="blue" />
        </div>

        {/* Invoices Section */}
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>
            <button
              onClick={onCreateInvoice}
              className="flex items-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Invoice</span>
            </button>
          </div>
          
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.slice(0, 5).map(invoice => (
                    <InvoiceRow 
                      key={invoice.id} 
                      invoice={invoice} 
                      onViewInvoice={onViewInvoice} 
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new invoice.</p>
              <div className="mt-6">
                <button
                  onClick={onCreateInvoice}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  New Invoice
                </button>
              </div>
            </div>
          )}
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
  const colors = {
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  const cursorClass = onClick ? 'cursor-pointer hover:shadow-lg' : '';

  return (
    <div className={`bg-white shadow-md rounded-lg p-5 flex items-center space-x-4 transition-shadow ${cursorClass}`} onClick={onClick}>
      <div className={`rounded-full p-3 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
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
  const statusClasses: { [key: string]: string } = {
    'Created': 'bg-gray-100 text-gray-800',
    'Funded': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
        <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCurrency(invoice.amount, invoice.currency)}</div>
        <div className="text-sm text-gray-500">{formatFiat(invoice.fiatEquivalent)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
          {invoice.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onViewInvoice(invoice)} className="text-blue-600 hover:text-blue-900 mr-4">
          <Eye className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};