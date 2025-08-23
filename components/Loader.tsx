
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      <p className="mt-4 text-lg font-semibold text-content-100 animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;
