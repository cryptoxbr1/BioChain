import React, { useState } from 'react';
import { PlayIcon, PauseIcon, CubeIcon } from './Icons';

export const MoleculeViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'ribbon' | 'surface' | 'ball-stick'>('ribbon');
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-black to-science-950 rounded-xl overflow-hidden border border-white/10 group shadow-2xl">
      {/* Simulation of a 3D view using a placeholder image */}
      <img 
        src="https://picsum.photos/800/400?grayscale&blur=2" 
        alt="Molecular Structure" 
        className={`w-full h-full object-cover opacity-40 mix-blend-screen transition-transform duration-[20s] ease-linear ${isRotating ? 'scale-110' : 'scale-100'}`}
      />
      
      {/* Overlay UI for the molecule */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-64 border border-science-500/20 rounded-full animate-[spin_10s_linear_infinite]">
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-science-400 rounded-full shadow-[0_0_15px_#60a5fa]"></div>
            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399]"></div>
        </div>
        <div className="absolute text-center flex flex-col items-center">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-full mb-3 border border-white/10">
                <CubeIcon className="w-8 h-8 text-science-400 opacity-80" />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-[0.2em] uppercase opacity-80">Interactive View</h3>
            <p className="text-[10px] text-science-300 font-mono mt-2 bg-black/40 px-2 py-1 rounded border border-white/5">
                LEU-84 • ASP-112
            </p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="flex gap-1 bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
          <button 
            onClick={() => setViewMode('ribbon')}
            className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded transition-colors ${viewMode === 'ribbon' ? 'bg-science-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Ribbon
          </button>
          <button 
            onClick={() => setViewMode('surface')}
            className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded transition-colors ${viewMode === 'surface' ? 'bg-science-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Surface
          </button>
          <button 
            onClick={() => setViewMode('ball-stick')}
            className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded transition-colors ${viewMode === 'ball-stick' ? 'bg-science-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            Ball & Stick
          </button>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => setIsRotating(!isRotating)}
             className="p-2 bg-science-600/80 backdrop-blur text-white rounded-lg hover:bg-science-500 transition-colors shadow-lg"
             title="Toggle Rotation"
           >
             {isRotating ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
           </button>
        </div>
      </div>
      
      {/* Legend overlay */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wide">Oxygen</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wide">Nitrogen</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]"></div>
              <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wide">Carbon</span>
          </div>
      </div>
    </div>
  );
};
