import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-12 border-t border-base-300">
      <div className="container mx-auto px-4 md:px-8 flex flex-col items-center gap-4">
        <a
          href="https://saweria.co/aiakademi"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs text-center py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 bg-green-500 text-white hover:bg-green-600 hover:shadow-xl hover:scale-105 transform"
        >
          Support via Saweria 💸
        </a>
        <p className="text-sm text-content-200">
          QRIS, E-Wallet, and other payment methods available.
        </p>
      </div>
    </footer>
  );
};

export default Footer;