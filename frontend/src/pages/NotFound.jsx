import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-body p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none radial-dots z-0 opacity-20"></div>
      
      <div className="relative z-10 text-center max-w-md bg-slate-950/80 backdrop-blur-xl p-10 border border-slate-800 rounded-[2.5rem] shadow-2xl">
        <span className="material-symbols-outlined text-6xl text-rose-500/80 mb-6 block animate-pulse">
          error
        </span>
        <h2 className="text-3xl font-black text-white tracking-tight mb-3">404 - Not Found</h2>
        <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed">
          The requested URL was not found on this server. That’s all we know.
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
