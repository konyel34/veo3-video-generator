
import React from 'react';

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6.47V17.53c0 .89.64 1.65 1.5 1.72v.28h13v-.28c.86-.07 1.5-.83 1.5-1.72V6.47c0-.89-.64-1.65-1.5-1.72V4.5h-13v.25C4.64 4.82 4 5.58 4 6.47zM6 6.5h2v2H6v-2zm0 3.5h2v2H6v-2zm0 3.5h2v2H6v-2zm10 0h2v2h-2v-2zm0-3.5h2v2h-2v-2zm0-3.5h2v2h-2v-2z"></path>
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <FilmIcon className="w-8 h-8 mr-3 text-brand-light" />
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-light to-white text-transparent bg-clip-text">
          VEO 3 Video Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;
