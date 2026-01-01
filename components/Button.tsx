import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'solana' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  disabled,
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-science-900";
  
  const variants = {
    primary: "bg-science-500 hover:bg-science-400 text-white shadow-lg shadow-science-500/10 focus:ring-science-500",
    secondary: "bg-science-800 hover:bg-science-700 text-slate-200 border border-science-700 hover:border-science-600 focus:ring-science-600",
    // Phantom Purple Style
    solana: "bg-[#AB9FF2] text-science-950 hover:bg-[#9a8ee0] shadow-lg shadow-purple-500/20 focus:ring-purple-500",
    danger: "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/10",
    ghost: "bg-transparent hover:bg-science-800/50 text-slate-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};