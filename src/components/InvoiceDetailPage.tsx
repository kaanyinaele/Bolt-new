import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, CheckCircle, QrCode, ExternalLink, Calendar, Wallet } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { Invoice } from '../types/invoice';
import { FloatingBadge } from './FloatingBadge';
import { formatCurrency, formatFiat, generatePaymentURI } from '../utils/crypto';

interface InvoiceDetailPageProps {
  invoice: Invoice;
  onBack: () => void;
}

export const InvoiceDetailPage: React.FC<InvoiceDetailPageProps> = ({ invoice, onBack }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  const shareableLink = `${window.location.origin}${window.location.pathname}#/invoice/${invoice.id}`;
  const paymentUri = generatePaymentURI(invoice.currency, invoice.walletAddress, invoice.amount);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCodeLib.toDataURL(paymentUri, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1E40AF',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [paymentUri]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${type} copied!`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-950 text-gray-300 relative">
      {/* Header */}
      <header className="bg-dark-900/50 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Invoice Details</h1>
              <p className="text-sm text-gray-400">#{String(invoice.id || '').substring(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              invoice.status === 'Funded' || invoice.status === 'Completed'
                ? 'bg-green-500/20 text-green-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {invoice.status === 'Funded' || invoice.status === 'Completed' ? (
                <CheckCircle className="h-4 w-4 mr-1" />
              ) : (
                <Calendar className="h-4 w-4 mr-1" />
              )}
              {invoice.status}
            </span>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Invoice Details */}
          <div className="space-y-6">
            {/* Invoice Info Card */}
            <div className="bg-dark-800/50 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Invoice Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Job Description</label>
                  <p className="text-white font-medium">{invoice.jobDescription}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </p>
                    <p className="text-sm text-gray-400">{formatFiat(invoice.fiatEquivalent)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                    <p className="text-white">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Created</label>
                  <p className="text-white">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>

                {invoice.customNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                    <p className="text-gray-200 bg-dark-900/70 rounded-lg p-3">{invoice.customNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Address Card */}
            <div className="bg-dark-800/50 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Payment Address
              </h2>
              <div className="bg-dark-900/70 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Send {invoice.currency} to:</p>
                <div className="flex items-center justify-between bg-dark-950 rounded-lg p-3 border border-white/10">
                  <p className="font-mono text-sm text-primary-200 break-all mr-2">
                    {invoice.walletAddress}
                  </p>
                  <button
                    onClick={() => copyToClipboard(invoice.walletAddress, 'Wallet address')}
                    className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 p-2 rounded-lg transition-colors flex-shrink-0"
                    title="Copy wallet address"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code & Actions */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="bg-dark-800/50 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Payment QR Code
              </h2>
              <div className="text-center">
                {qrCodeUrl ? (
                  <div className="inline-block p-4 bg-white rounded-xl border-2 border-primary-500/50">
                    <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-700 rounded-xl flex items-center justify-center mx-auto">
                    <QrCode className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-3">
                  Scan with your crypto wallet to pay
                </p>
              </div>
            </div>

            {/* Shareable Link Card */}
            <div className="bg-dark-800/50 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Shareable Payment Link
              </h2>
              <div className="space-y-4">
                <div className="bg-dark-900/70 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Send this link to your client:</p>
                  <div className="flex items-center justify-between bg-dark-950 rounded-lg p-3 border border-white/10">
                    <p className="text-sm text-primary-200 break-all mr-2">
                      {shareableLink}
                    </p>
                    <button
                      onClick={() => copyToClipboard(shareableLink, 'Payment link')}
                      className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 p-2 rounded-lg transition-colors flex-shrink-0"
                      title="Copy payment link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => window.open(shareableLink, '_blank')}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Preview Client View</span>
                </button>
              </div>
            </div>

            {/* Copy Feedback */}
            {copyFeedback && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-300 text-sm font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {copyFeedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingBadge />
    </div>
  );
};