import React from 'react';
import { Coins } from 'lucide-react';

interface ConnectWalletPageProps {
  onConnect: () => Promise<void>;
}

export const ConnectWalletPage: React.FC<ConnectWalletPageProps> = ({ onConnect }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50">
      {/* Badge in top-right corner */}
      <div className="absolute top-6 right-6 z-50">
        <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer">
          <img 
            src="/black_circle_360x360 copy.png" 
            alt="Built with Bolt.new" 
            className="h-36 w-36 hover:scale-110 transition-transform duration-200"
          />
        </a>
      </div>
      <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-md w-full">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 mb-6">
          <Coins className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to RubikconInvoice</h1>
        <p className="text-gray-600 mb-8">The decentralized solution for trustless invoicing. Connect your wallet to begin.</p>
        <button
          onClick={onConnect}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};
