import React, { useState, useEffect } from 'react';
import { CheckCircle, Copy, QrCode, Wallet, Calendar, FileText } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { Invoice } from '../types/invoice';
import { FloatingBadge } from './FloatingBadge';
import { formatCurrency, formatFiat, generatePaymentURI } from '../utils/crypto';

interface ClientInvoicePageProps {
  invoice: Invoice | null;
}

export const ClientInvoicePage: React.FC<ClientInvoicePageProps> = ({ invoice }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  useEffect(() => {
    if (!invoice) return;

    const generateQR = async () => {
      try {
        const paymentUri = generatePaymentURI(invoice.currency, invoice.walletAddress, invoice.amount);
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
  }, [invoice]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${type} copied!`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center relative">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600">The requested invoice could not be found.</p>
        </div>

        {/* Floating Bolt.new Badge */}
        <div className="fixed bottom-6 right-6 z-50">
          <a 
            href="https://bolt.new/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
            title="Built with Bolt.new"
          >
            <img 
              src="/black_circle_360x360 copy.png" 
              alt="Built with Bolt.new" 
              className="w-16 h-16 rounded-full"
            />
          </a>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === 'Paid';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Request</h1>
          <p className="text-gray-600">Invoice #{invoice.id.slice(-8)}</p>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {isPaid && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-green-900">Payment Received!</h2>
                <p className="text-green-700">This invoice has been marked as paid.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Invoice Details */}
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Service Description</label>
                  <p className="text-lg text-gray-900 font-medium">{invoice.jobDescription}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Amount Due</label>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </p>
                      <p className="text-sm text-blue-700">{formatFiat(invoice.fiatEquivalent)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Due Date</label>
                    <div className="bg-amber-50 rounded-lg p-4 flex items-center">
                      <Calendar className="h-5 w-5 text-amber-600 mr-2" />
                      <p className="text-amber-900 font-medium">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {invoice.customNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Additional Notes</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900">{invoice.customNotes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isPaid ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-1" />
                    )}
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Information */}
          <div className="space-y-6">
            {!isPaid && (
              <>
                {/* QR Code */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <QrCode className="h-6 w-6 mr-2 text-blue-600" />
                    Scan to Pay
                  </h2>
                  
                  <div className="text-center">
                    {qrCodeUrl ? (
                      <div className="inline-block p-6 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
                        <img src={qrCodeUrl} alt="Payment QR Code" className="w-56 h-56" />
                      </div>
                    ) : (
                      <div className="w-56 h-56 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mt-4">
                      Open your crypto wallet and scan this code to pay
                    </p>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Wallet className="h-6 w-6 mr-2 text-blue-600" />
                    Manual Payment
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Send {formatCurrency(invoice.amount, invoice.currency)} to:
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm text-gray-900 break-all mr-2">
                            {invoice.walletAddress}
                          </p>
                          <button
                            onClick={() => copyToClipboard(invoice.walletAddress, 'Wallet address')}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors flex-shrink-0"
                            title="Copy wallet address"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-amber-800 text-sm">
                        <strong>Important:</strong> Please ensure you send the exact amount to the correct address. 
                        Payments sent to incorrect addresses cannot be recovered.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Copy Feedback */}
            {copyFeedback && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {copyFeedback}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Powered by <span className="font-semibold text-blue-600">InvoiceFlow</span>
          </p>
        </div>
      </div>

      <FloatingBadge />
    </div>
  );
};