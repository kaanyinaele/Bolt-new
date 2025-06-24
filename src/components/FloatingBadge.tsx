import React from 'react';

export const FloatingBadge: React.FC = () => {
  return (
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
          className="w-16 h-16 md:w-32 md:h-32 rounded-full"
        />
      </a>
    </div>
  );
};
