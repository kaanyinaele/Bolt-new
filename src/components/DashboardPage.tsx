import React from 'react';
import { Plus, Eye, CheckCircle, Clock, Coins, LogOut, Repeat, Calendar } from 'lucide-react';
import { Invoice } from '../types/invoice';
import { FloatingBadge } from './FloatingBadge';
import { storage } from '../utils/storage';
import { formatCurrency, formatFiat } from '../utils/crypto';

interface DashboardPageProps {
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onSimulatePayment: (invoiceId: string) => void;
  onLogout: () => void;
  onViewRecurringPayments: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  invoices,
  onCreateInvoice,
  onViewInvoice,
  onSimulatePayment,
  onLogout,
  onViewRecurringPayments
}) => {
  const user = storage.getUser();
  const recurringPayments = storage.getRecurringPayments();
  
  const totalPending = invoices.filter(inv => inv.status === 'Pending Payment').length;
  const totalPaid = invoices.filter(inv => inv.status === 'Paid').length;
  const totalValue = invoices.reduce((sum, inv) => sum + inv.fiatEquivalent, 0);
  const activeRecurring = recurringPayments.filter(rp => rp.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InvoiceFlow</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Payment</p>
                <p className="text-2xl font-bold text-amber-600">{totalPending}</p>
              </div>
              <div className="bg-amber-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{formatFiat(totalValue)}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Recurring</p>
                <p className="text-2xl font-bold text-purple-600">{activeRecurring}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Repeat className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={onCreateInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Invoice</span>
          </button>
          
          <button
            onClick={onViewRecurringPayments}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Repeat className="h-5 w-5" />
            <span>Recurring Payments</span>
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          </div>
          
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
              <p className="text-gray-600 mb-6">Create your first crypto invoice to get started</p>
              <button
                onClick={onCreateInvoice}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Create Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Job Description</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Due Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{invoice.jobDescription}</div>
                        <div className="text-sm text-gray-600">Invoice #{invoice.id.slice(-8)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </div>
                        <div className="text-sm text-gray-600">{formatFiat(invoice.fiatEquivalent)}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {invoice.status === 'Paid' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {invoice.isRecurring ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Repeat className="h-3 w-3 mr-1" />
                            Recurring
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            One-time
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onViewInvoice(invoice)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                            title="View Invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {invoice.status === 'Pending Payment' && (
                            <button
                              onClick={() => onSimulatePayment(invoice.id)}
                              className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                              title="Simulate Payment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FloatingBadge />
    </div>
  );
};