import React from 'react';
import { ViewState } from '../types';
import { Sidebar } from './Sidebar';
import { WalletConnect } from './WalletConnect';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  walletConnected: boolean;
  toggleWallet: () => void;
  walletAddress?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setView, 
  walletConnected, 
  toggleWallet,
  walletAddress
}) => {
  return (
    <div className="min-h-screen bg-science-900 text-slate-100 flex">
      <Sidebar currentView={currentView} setView={setView} />
      
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="h-16 border-b border-science-800 bg-science-900/90 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="md:hidden flex items-center gap-2">
            <span className="font-bold text-science-accent">BioChain</span>
          </div>
          <div className="flex-1"></div> {/* Spacer */}
          <div className="flex items-center gap-4">
            <WalletConnect 
              isConnected={walletConnected} 
              onConnect={toggleWallet} 
              onDisconnect={toggleWallet} 
              address={walletAddress}
            />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};