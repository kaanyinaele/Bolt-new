import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-dark-900 to-dark-950 flex flex-col items-center justify-center z-50">
      <div className="animate-pulse">
        <img src="/logo.png" alt="Loading Logo" className="h-24 w-auto rounded-2xl" />
      </div>
      
    </div>
  );
};
