import React, { useState } from 'react';
import { Coins, Wallet, ArrowRight, Zap, Shield } from 'lucide-react';

interface ConnectWalletPageProps {
  onConnect: () => Promise<void>;
}

export const ConnectWalletPage: React.FC<ConnectWalletPageProps> = ({ onConnect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [providerFound, setProviderFound] = useState<boolean | null>(null);

  React.useEffect(() => {
    // Use a timeout to ensure wallet-injected scripts have loaded
    const timer = setTimeout(() => {
      setProviderFound(typeof window.ethereum !== 'undefined');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await onConnect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent animate-spin-slow" />
        <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-500/10 via-transparent to-transparent animate-spin-slow animation-delay-3000" />
      </div>

      {/* Badge in top-right corner - hidden on mobile */}
      <div className="absolute top-6 right-6 z-50 hidden md:block">
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-200 hover:shadow-glow"
        >
          <img 
            src="/black_circle_360x360 copy.png" 
            alt="Built with Bolt.new" 
            className="h-36 w-36"
          />
        </a>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 mb-6 shadow-lg">
                <Coins className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent mb-3">
                RubikconInvoice
              </h1>
              <p className="text-gray-300 text-sm">
                The decentralized solution for trustless invoicing on the blockchain
              </p>
            </div>

            {/* Features */}
            <div className="px-8 pb-8 space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <Shield className="h-5 w-5 text-accent-400" />
                </div>
                <p className="text-sm text-gray-300">
                  Secure, non-custodial transactions powered by blockchain
                </p>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <Zap className="h-5 w-5 text-accent-400" />
                </div>
                <p className="text-sm text-gray-300">
                  Fast and low-cost transactions with Web3 technology
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <div className="px-8 pb-8">
              <button
                onClick={handleConnect}
                disabled={isLoading || providerFound === false}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  w-full group relative overflow-hidden rounded-xl px-6 py-4 font-medium text-white
                  bg-gradient-to-r from-primary-600 to-secondary-600
                  hover:from-primary-500 hover:to-secondary-500
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800
                  transition-all duration-300 transform-gpu
                  ${isHovered ? 'shadow-glow-lg' : 'shadow-lg'}
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <Wallet className={`h-5 w-5 ${isLoading && providerFound ? 'animate-pulse' : ''}`} />
                  <span>
                    {isLoading && providerFound ? 'Connecting...' : 
                     providerFound === false ? 'Wallet Not Found' : 'Connect Wallet'}
                  </span>
                  <ArrowRight 
                    className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                  />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                {providerFound === false && (
                  <span className="text-red-400 block mb-2">Please install a Web3 wallet like MetaMask or use a dApp browser.</span>
                )}
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 py-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400">
                New to Web3?{' '}
                <a 
                  href="https://ethereum.org/en/wallets/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:text-primary-200 font-medium transition-colors"
                >
                  Learn about wallets
                </a>
              </p>
            </div>
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
        </div>
      </div>
    </div>
  );
};
