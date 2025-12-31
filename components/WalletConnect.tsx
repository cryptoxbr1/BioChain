import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { WalletIcon } from './Icons';

interface WalletConnectProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ isConnected, onConnect, onDisconnect }) => {
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (isConnected) {
      // Mock address generation
      setAddress('8xRt...j9Lq');
    }
  }, [isConnected]);

  if (isConnected) {
    return (
      <div className="flex items-center gap-1 bg-science-950 rounded-lg p-1 border border-white/10 shadow-sm">
        <div className="flex items-center gap-2 px-3">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
           <span className="text-xs font-mono text-slate-300">{address}</span>
        </div>
        <button 
            onClick={onDisconnect}
            className="px-2 py-1 text-[10px] uppercase font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <Button variant="solana" onClick={onConnect} className="!py-1.5 !px-3 !text-xs !font-semibold">
      <WalletIcon className="w-3 h-3" /> Connect Wallet
    </Button>
  );
};
