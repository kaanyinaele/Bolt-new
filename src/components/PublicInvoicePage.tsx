import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, QrCode, Wallet, Zap } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { Invoice } from '../types/invoice';
import { FloatingBadge } from './FloatingBadge';
import { formatCurrency, formatFiat, generatePaymentURI } from '../utils/crypto';

interface PublicInvoicePageProps {
  invoice: Invoice;
}

export const PublicInvoicePage: React.FC<PublicInvoicePageProps> = ({ invoice }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  const paymentUri = generatePaymentURI(invoice.currency, invoice.walletAddress, invoice.amount);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCodeLib.toDataURL(paymentUri, {
          width: 256,
          margin: 2,
          color: {
            dark: '#FFFFFF',
            light: '#111827' // dark-900
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
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-10">
            <img src="/logo.png" alt="Logo" className="h-20 w-auto rounded-2xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Invoice from InvoyBox</h1>
            <p className="text-gray-400">You've received an invoice. Please review and pay.</p>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-md border border-white/10 rounded-xl p-8 space-y-6">
          {/* Top Section: Amount and Due Date */}
          <div className="text-center">
            <p className="text-sm text-gray-400">Amount Due</p>
            <p className="text-4xl font-bold text-white">{formatCurrency(invoice.amount, invoice.currency)}</p>
            <p className="text-md text-gray-400">{formatFiat(invoice.fiatEquivalent)}</p>
            <p className="text-sm text-amber-400 mt-1">Due by {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            {qrCodeUrl ? (
              <div className="inline-block p-4 bg-white rounded-xl border-2 border-primary-500/50">
                <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48" />
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-700 rounded-xl flex items-center justify-center mx-auto">
                <QrCode className="h-12 w-12 text-gray-500" />
              </div>
            )}
          </div>

          {/* Wallet Address */}
          <div className="bg-dark-900/70 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2 flex items-center"><Wallet className="h-4 w-4 mr-2"/>Send {invoice.currency} to:</p>
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

          {/* Pay Button */}
          <button
            onClick={() => window.open(paymentUri, '_blank')}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>Pay with Wallet</span>
          </button>

          {/* Copy Feedback */}
          {copyFeedback && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-300 text-sm font-medium flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {copyFeedback}
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Powered by InvoyBox | Secure Blockchain Invoicing</p>
        </div>
      </div>
      <FloatingBadge />
    </div>
  );
};
