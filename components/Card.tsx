import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-science-800/40 backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-xl ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-5 pb-2 border-b border-white/5">
          {title && <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
