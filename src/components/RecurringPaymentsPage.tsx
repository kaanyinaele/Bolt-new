import React from 'react';
import { ArrowLeft, Plus, Eye, Play, Pause, Trash2, Calendar, User, Repeat } from 'lucide-react';
import { RecurringPayment } from '../types/invoice';
import { FloatingBadge } from './FloatingBadge';
import { formatCurrency, formatFiat, getFrequencyLabel } from '../utils/crypto';

interface RecurringPaymentsPageProps {
  recurringPayments: RecurringPayment[];
  onBack: () => void;
  onCreateRecurring: () => void;
  onViewRecurring: (recurringPayment: RecurringPayment) => void;
  onToggleStatus: (id: string) => void;
  onDeleteRecurring: (id: string) => void;
  onGenerateInvoice: (id: string) => void;
}

export const RecurringPaymentsPage: React.FC<RecurringPaymentsPageProps> = ({
  recurringPayments,
  onBack,
  onCreateRecurring,
  onViewRecurring,
  onToggleStatus,
  onDeleteRecurring,
  onGenerateInvoice
}) => {
  const activePayments = recurringPayments.filter(rp => rp.status === 'Active').length;
  const totalValue = recurringPayments.reduce((sum, rp) => sum + rp.fiatEquivalent, 0);
  const totalInvoices = recurringPayments.reduce((sum, rp) => sum + rp.totalInvoicesGenerated, 0);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Repeat className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Recurring Payments</h1>
            </div>
          </div>
          <button
            onClick={onCreateRecurring}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Recurring Payment</span>
          </button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                <p className="text-2xl font-bold text-green-600">{activePayments}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Repeat className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-600">{formatFiat(totalValue)}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Invoices Generated</p>
                <p className="text-2xl font-bold text-purple-600">{totalInvoices}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recurring Payment Subscriptions</h2>
          </div>
          
          {recurringPayments.length === 0 ? (
            <div className="text-center py-12">
              <Repeat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring payments yet</h3>
              <p className="text-gray-600 mb-6">Set up automatic invoice generation for your regular clients</p>
              <button
                onClick={onCreateRecurring}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Create Recurring Payment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Client</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Service</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Frequency</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Next Invoice</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recurringPayments.map((recurringPayment) => (
                    <tr key={recurringPayment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{recurringPayment.clientName}</div>
                        <div className="text-sm text-gray-600">{recurringPayment.clientEmail}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{recurringPayment.jobDescription}</div>
                        <div className="text-sm text-gray-600">{recurringPayment.totalInvoicesGenerated} invoices generated</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(recurringPayment.amount, recurringPayment.currency)}
                        </div>
                        <div className="text-sm text-gray-600">{formatFiat(recurringPayment.fiatEquivalent)}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {getFrequencyLabel(recurringPayment.frequency)}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(recurringPayment.nextInvoiceDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          recurringPayment.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : recurringPayment.status === 'Paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {recurringPayment.status === 'Active' && <Play className="h-3 w-3 mr-1" />}
                          {recurringPayment.status === 'Paused' && <Pause className="h-3 w-3 mr-1" />}
                          {recurringPayment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onViewRecurring(recurringPayment)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onGenerateInvoice(recurringPayment.id)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                            title="Generate Invoice Now"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onToggleStatus(recurringPayment.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              recurringPayment.status === 'Active'
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                            title={recurringPayment.status === 'Active' ? 'Pause' : 'Resume'}
                          >
                            {recurringPayment.status === 'Active' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteRecurring(recurringPayment.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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