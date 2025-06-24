import React from 'react';
import { ArrowLeft, User, Mail, Calendar, Repeat, Play, Pause, Trash2, Plus } from 'lucide-react';
import { RecurringPayment } from '../types/invoice';
import { FloatingBadge } from './FloatingBadge';
import { formatCurrency, formatFiat, getFrequencyLabel } from '../utils/crypto';

interface RecurringDetailPageProps {
  recurringPayment: RecurringPayment;
  onBack: () => void;
  onToggleStatus: (id: string) => void;
  onDeleteRecurring: (id: string) => void;
  onGenerateInvoice: (id: string) => void;
}

export const RecurringDetailPage: React.FC<RecurringDetailPageProps> = ({
  recurringPayment,
  onBack,
  onToggleStatus,
  onDeleteRecurring,
  onGenerateInvoice
}) => {
  const isActive = recurringPayment.status === 'Active';

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
            <div>
              <h1 className="text-xl font-bold text-gray-900">Recurring Payment Details</h1>
              <p className="text-sm text-gray-600">{recurringPayment.clientName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : recurringPayment.status === 'Paused'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
              {recurringPayment.status}
            </span>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Client & Payment Details */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Client Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Client Name</label>
                  <p className="text-gray-900 font-medium">{recurringPayment.clientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{recurringPayment.clientEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Service Description</label>
                  <p className="text-gray-900 font-medium">{recurringPayment.jobDescription}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(recurringPayment.amount, recurringPayment.currency)}
                    </p>
                    <p className="text-sm text-gray-600">{formatFiat(recurringPayment.fiatEquivalent)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Frequency</label>
                    <p className="text-gray-900 font-medium">{getFrequencyLabel(recurringPayment.frequency)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Wallet Address</label>
                  <p className="font-mono text-sm text-gray-900 bg-gray-50 rounded-lg p-3 break-all">
                    {recurringPayment.walletAddress}
                  </p>
                </div>

                {recurringPayment.customNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                    <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{recurringPayment.customNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Schedule & Actions */}
          <div className="space-y-6">
            {/* Schedule Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Schedule Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                    <p className="text-gray-900">{new Date(recurringPayment.startDate).toLocaleDateString()}</p>
                  </div>
                  {recurringPayment.endDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                      <p className="text-gray-900">{new Date(recurringPayment.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Next Invoice Date</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {new Date(recurringPayment.nextInvoiceDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
                  <p className="text-gray-900">{new Date(recurringPayment.createdAt).toLocaleDateString()}</p>
                </div>

                {recurringPayment.lastInvoiceDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Invoice</label>
                    <p className="text-gray-900">{new Date(recurringPayment.lastInvoiceDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Repeat className="h-5 w-5 mr-2 text-purple-600" />
                Statistics
              </h2>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">Total Invoices Generated</p>
                  <p className="text-2xl font-bold text-purple-900">{recurringPayment.totalInvoicesGenerated}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatFiat(recurringPayment.fiatEquivalent * recurringPayment.totalInvoicesGenerated)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => onGenerateInvoice(recurringPayment.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Generate Invoice Now</span>
                </button>
                
                <button
                  onClick={() => onToggleStatus(recurringPayment.id)}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    isActive
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                      : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}
                >
                  {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  <span>{isActive ? 'Pause Recurring Payment' : 'Resume Recurring Payment'}</span>
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this recurring payment? This action cannot be undone.')) {
                      onDeleteRecurring(recurringPayment.id);
                    }
                  }}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Recurring Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingBadge />
    </div>
  );
};