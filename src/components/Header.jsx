import React from 'react';
import {
  Sparkles,
  Zap,
  Key,
  Settings,
  Shield,
  FileCheck2,
} from 'lucide-react';

export default function Header({
  mode,
  setMode,
  onOpenSettings,
  hasApiKey,
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Sprint Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 text-white font-bold text-lg">
            <span>P</span>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                Prodesk IT
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Sprint 4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              The AI Cover Letter Generator • P0 / P1 / P2 Unified Studio
            </p>
          </div>
        </div>

        {/* Center: Mode Switching Control (AI Mode vs Simulation Mode) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner">
          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === 'ai'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Use Google Gemini API for dynamic generation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Mode (Gemini API)</span>
            <span className="sm:hidden">AI Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === 'simulation'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Use deterministic P0 template simulation"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Simulation Mode (P0)</span>
            <span className="sm:hidden">P0 Mode</span>
          </button>
        </div>

        {/* Right: API Settings & Security Badge */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSettings}
            className={`relative flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
              hasApiKey
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-indigo-500'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Configure Session Key & Model"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">API Settings</span>
            {hasApiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Key Ready" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Key Missing" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
