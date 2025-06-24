import React from 'react';

export const FloatingBadge: React.FC = () => {
  return (
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
        className="w-32 h-32 rounded-full"
      />
    </a>
  );
};
