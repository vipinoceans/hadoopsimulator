import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-auto p-2 min-w-[100px] bg-black text-white text-xs rounded shadow-lg z-50 text-center whitespace-nowrap">
        {text}
        <div className="absolute top-100 left-1/2 -ml-1 mt-[-1px] border-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
};
