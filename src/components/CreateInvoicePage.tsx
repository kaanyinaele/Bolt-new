import React, { useState } from 'react';
import { ArrowLeft, Save, Wallet, FileText, Clock, AlertCircle, Check, X, ArrowRight } from 'lucide-react';
import { Invoice } from '../types/invoice';
import { FloatingBadge } from './FloatingBadge';
import { formatFiat, fetchNetworkFeeEstimate } from '../utils/crypto';

interface CreateInvoicePageProps {
  onBack: () => void;
  onSave: (invoice: Omit<Invoice, 'id' | 'status' | 'createdAt'>) => void;
}

export const CreateInvoicePage: React.FC<CreateInvoicePageProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ETH' as 'BTC' | 'ETH' | 'USDT' | 'USDC',
    jobDescription: '',
    walletAddress: '',
    dueDate: '',
    customNotes: ''
  });
  // Network fee state
  const [networkFee, setNetworkFee] = useState<import('../utils/crypto').NetworkFeeEstimate | null>(null);
  const [feeLoading, setFeeLoading] = useState<boolean>(true);
  const [feeError, setFeeError] = useState<string | null>(null);

  // USD price state for fiat equivalent
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [usdPriceLoading, setUsdPriceLoading] = useState<boolean>(true);
  const [usdPriceError, setUsdPriceError] = useState<string | null>(null);

  // Fetch USD price for selected currency
  React.useEffect(() => {
    let mounted = true;
    setUsdPriceLoading(true);
    setUsdPriceError(null);
    import('../utils/crypto').then(utils => {
      utils.fetchCryptoUsdPrice(formData.currency as 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'MATIC')
        .then(price => {
          if (mounted) {
            setUsdPrice(price);
            setUsdPriceLoading(false);
          }
        })
        .catch(() => {
          if (mounted) {
            setUsdPriceError('Failed to fetch USD price');
            setUsdPriceLoading(false);
          }
        });
    });
    return () => { mounted = false; };
  }, [formData.currency]);

  // Fetch network fee estimate when currency changes
  React.useEffect(() => {
    let mounted = true;
    setFeeLoading(true);
    fetchNetworkFeeEstimate(formData.currency as 'MATIC' | 'USDT' | 'USDC' | 'ETH', 'polygon')
      .then(fee => {
        if (mounted) {
          setNetworkFee(fee);
          setFeeLoading(false);
          setFeeError(null);
        }
      })
      .catch(err => {
        console.error('Failed to fetch network fee:', err);
        if (mounted) {
          setFeeError('Could not fetch network fee');
          setFeeLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [formData.currency]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }
    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const invoice: Omit<Invoice, 'id' | 'status' | 'createdAt'> = {
      clientName: 'Mock Client', // Placeholder
      clientEmail: 'mock@example.com', // Placeholder
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      cryptoAmount: formData.amount, // Assuming crypto amount is same as fiat for now
      cryptoCurrency: formData.currency,
      jobDescription: formData.jobDescription,
      walletAddress: formData.walletAddress,
      dueDate: formData.dueDate,
      customNotes: formData.customNotes,
      fiatEquivalent: usdPrice ? parseFloat(formData.amount) : 0, // Use fetched USD price
    };

    onSave(invoice);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-radial-gradient from-primary-500/10 via-transparent to-transparent animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-radial-gradient from-secondary-500/10 via-transparent to-transparent animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="relative bg-gray-800/50 backdrop-blur-md border-b border-gray-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Create New Invoice
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Connected</span>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
          <div className="p-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30">
            <div className="bg-gray-900/80 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">New Invoice</h2>
                    <p className="text-sm text-gray-400">Fill in the details below</p>
                  </div>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
                  Draft
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6"> {/* FORM STARTS HERE */}
                {/* Amount and Currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      Amount <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className={`w-full px-4 pl-12 py-3.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400 ${
                          errors.amount ? 'border-red-400/50' : 'border-gray-600/50 hover:border-blue-400/50'
                        }`}
                        placeholder="0.00"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        $
                      </div>
                    </div>
                    {errors.amount && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.amount}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-gray-400">
                      {usdPriceLoading && 'Loading USD price...'}
                      {usdPriceError && <span className="text-red-400">{usdPriceError}</span>}
                      {!usdPriceLoading && !usdPriceError && (
                        <>
                          ≈ {formData.amount && usdPrice !== null
                            ? formatFiat(parseFloat(formData.amount) * usdPrice)
                            : '$0.00'}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full appearance-none px-4 py-3.5 pl-12 pr-10 bg-gray-700/50 border border-gray-600/50 hover:border-blue-400/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white"
                      >
                        <option value="BTC" className="bg-gray-800">Bitcoin (BTC)</option>
                        <option value="ETH" className="bg-gray-800">Ethereum (ETH)</option>
                        <option value="USDT" className="bg-gray-800">Tether (USDT)</option>
                        <option value="USDC" className="bg-gray-800">USD Coin (USDC)</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-400">
                            {formData.currency === 'BTC' ? '₿' : 
                            formData.currency === 'ETH' ? 'Ξ' : 
                            formData.currency === 'USDT' ? '₮' : 'Ⓢ'}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Select your preferred cryptocurrency
                    </div>
                  </div>
                </div> {/* End of Amount and Currency grid */}
                
                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    Job Description <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.jobDescription}
                      onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                      className={`w-full px-4 py-3.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400 ${errors.jobDescription ? 'border-red-400/50' : 'border-gray-600/50 hover:border-blue-400/50'}`}
                      placeholder="e.g., Web3 Development, Smart Contract Audit, UI/UX Design"
                    />
                    {errors.jobDescription && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.jobDescription}
                      </p>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    A clear description helps clients understand the work completed
                  </div>
                </div>

                {/* Wallet Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    Your Wallet Address <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.walletAddress}
                      onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white font-mono text-sm placeholder-gray-500 ${
                        errors.walletAddress ? 'border-red-400/50' : 'border-gray-600/50 hover:border-blue-400/50'
                      }`}
                      placeholder="0x... or bc1..."
                    />
                    {formData.walletAddress && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-400" />
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.walletAddress ? (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.walletAddress}
                    </p>
                  ) : (
                    <div className="mt-2 text-xs text-gray-400 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/50 mr-1.5 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      </div>
                      {`Connected to ${formData.walletAddress ? `${formData.walletAddress.substring(0, 6)}...${formData.walletAddress.substring(38)}` : ''} on Ethereum Mainnet`}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    Due Date <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white ${
                        errors.dueDate ? 'border-red-400/50' : 'border-gray-600/50 hover:border-blue-400/50'
                      }`}
                    />
                  </div>
                  {errors.dueDate ? (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.dueDate}
                    </p>
                  ) : (
                    <div className="mt-2 text-xs text-gray-400">
                      When do you expect to be paid by?
                    </div>
                  )}
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Notes (Optional)
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.customNotes}
                      onChange={(e) => handleInputChange('customNotes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3.5 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-500 resize-none"
                      placeholder="Add any additional notes or payment instructions for the client..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {formData.customNotes.length}/500
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Add any special instructions or terms for this invoice
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700/50 my-6"></div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <span>Auto-saved</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span>Connected to Web3</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onBack}
                      className="px-6 py-3.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-gray-500 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto group"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-300"></div>
                        <Save className="h-4 w-4 relative" />
                      </div>
                      <span className="font-medium">Create Invoice</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
                
                {/* Network Fee Estimate */}
                <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">Estimated Network Fee</div>
                    <div className="font-mono text-blue-400">
                      {feeLoading && 'Loading...'}
                      {feeError && <span className="text-red-400">{feeError}</span>}
                      {!feeLoading && !feeError && networkFee && (
                        <>
                          {networkFee.fee.toFixed(6)} {networkFee.asset} (~{formatFiat(networkFee.usd)})
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    This is an estimate and may vary based on network conditions
                  </div>
                </div>
              </form> {/* FORM ENDS HERE */}
            </div> {/* This closes the bg-gray-900/80 p-6 div */}
          </div> {/* This closes the p-1 div */}
        </div> {/* This closes the bg-gray-800/50 div */}
      </div> {/* This closes the max-w-4xl div */}
      
      {/* Floating Badge - hidden on mobile */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <FloatingBadge />
      </div>
    </div>
  );
};
