import React from 'react';
import { ViewState } from '../types';
import { DashboardIcon, PlusIcon, BeakerIcon } from './Icons';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { label: 'Dashboard', value: 'DASHBOARD' as ViewState, icon: DashboardIcon },
    { label: 'New Job', value: 'UPLOAD' as ViewState, icon: PlusIcon },
  ];

  return (
    <aside className="w-64 bg-science-950/50 border-r border-science-800 h-screen fixed left-0 top-0 flex flex-col z-20 hidden md:flex backdrop-blur-xl">
      <div className="p-6 border-b border-science-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-science-500/20 text-science-400 border border-science-500/30 flex items-center justify-center">
          <BeakerIcon className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">BioChain</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setView(item.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
              currentView === item.value 
                ? 'bg-science-800 text-white shadow-inner shadow-black/20' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-science-800/50'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${currentView === item.value ? 'text-science-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-science-800">
        <div className="rounded-lg p-3 text-xs text-slate-400 space-y-2 border border-science-800/50 bg-science-900/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            <span className="font-medium text-slate-300">Operational</span>
          </div>
          <p className="text-slate-500">Solana Devnet</p>
          <p className="text-slate-500">Gemini 2.5 Flash</p>
        </div>
      </div>
    </aside>
  );
};
