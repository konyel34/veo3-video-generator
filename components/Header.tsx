import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">

        <div className="flex flex-col items-center gap-2">
          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="AI Akademi Logo" 
            className="h-12 w-12" // Atur tinggi dan lebar logo di sini
          />

          {/* Headline */}
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-light to-white text-transparent bg-clip-text text-center">
            AI Akademi unlimited generator
          </h1>
        </div>

      </div>
    </header>
  );
};

export default Header;