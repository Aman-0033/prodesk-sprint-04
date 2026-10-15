import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Zap,
  AlertTriangle,
  FileText,
  Code2,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function PreviewStudio({
  letterContent,
  isGenerating,
  progressState,
  generationError,
  mode,
  onSwitchToSimulation,
  onRegenerate,
}) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' | 'raw'

  const handleCopy = async () => {
    if (!letterContent) return;
    try {
      await navigator.clipboard.writeText(letterContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleDownload = (format = 'md') => {
    if (!letterContent) return;
    const extension = format === 'txt' ? 'txt' : 'md';
    const mimeType = format === 'txt' ? 'text/plain;charset=utf-8' : 'text/markdown;charset=utf-8';
    const blob = new Blob([letterContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${new Date().toISOString().slice(0, 10)}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Word and character stats
  const wordCount = letterContent ? letterContent.split(/\s+/).filter(Boolean).length : 0;
  const charCount = letterContent ? letterContent.length : 0;

  return (
    <div className="flex flex-col h-full bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
      {/* Studio Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-900/90 no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Live Document Studio</h3>
              {mode === 'ai' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  Gemini LLM
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  <Zap className="w-2.5 h-2.5 text-amber-300" />
                  P0 Simulation
                </span>
              )}
            </div>
            {letterContent && !isGenerating && (
              <p className="text-[11px] text-slate-400">
                {wordCount} words • {charCount} characters • ATS-Optimized
              </p>
            )}
          </div>
        </div>

        {/* View Toggle and Actions */}
        <div className="flex items-center gap-2">
          {letterContent && !isGenerating && (
            <>
              {/* Formatted vs Raw Markdown Toggle */}
              <div className="bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 flex items-center">
                <button
                  type="button"
                  onClick={() => setViewMode('formatted')}
                  className={`text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                    viewMode === 'formatted'
                      ? 'bg-indigo-600 text-white font-medium shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Formatted Document View"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  className={`text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                    viewMode === 'raw'
                      ? 'bg-indigo-600 text-white font-medium shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Raw Markdown View"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Markdown</span>
                </button>
              </div>

              {/* Copy Button with 2s Green Feedback */}
              <button
                type="button"
                onClick={handleCopy}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 border shadow-sm ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
                }`}
                title="Copy letter to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Download Dropdown / Buttons */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => handleDownload('md')}
                  className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                  title="Download as Markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 hidden group-hover:block z-20">
                  <button
                    type="button"
                    onClick={() => handleDownload('md')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition"
                  >
                    As Markdown (.md)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('txt')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition"
                  >
                    As Plain Text (.txt)
                  </button>
                </div>
              </div>

              {/* Print / Save PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Print / PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-[500px] flex justify-center items-start">
        {/* Loading Multi-step Skeleton State */}
        {isGenerating ? (
          <div className="w-full max-w-2xl bg-slate-950/70 border border-indigo-500/20 rounded-2xl p-6 md:p-8 shadow-2xl animate-pulse">
            {/* Staged progress banner */}
            <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  Synthesis in Progress
                </span>
                <span className="text-xs font-mono font-semibold text-indigo-300">
                  Step {progressState.step || 1} of 4 • {progressState.progress || 25}%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {progressState.label || 'Analyzing candidate credentials...'}
              </p>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressState.progress || 25}%` }}
                />
              </div>
            </div>

            {/* Skeleton document lines */}
            <div className="space-y-4">
              <div className="h-7 w-2/5 bg-slate-800 rounded-lg" />
              <div className="h-4 w-1/3 bg-slate-800/80 rounded" />
              <div className="h-px bg-slate-800 my-4" />
              <div className="h-4 w-1/4 bg-slate-800 rounded" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-slate-800/60 rounded" />
                <div className="h-4 w-11/12 bg-slate-800/60 rounded" />
                <div className="h-4 w-4/5 bg-slate-800/60 rounded" />
              </div>
              <div className="space-y-2 pt-3">
                <div className="h-4 w-full bg-slate-800/60 rounded" />
                <div className="h-4 w-10/12 bg-slate-800/60 rounded" />
                <div className="h-4 w-5/6 bg-slate-800/60 rounded" />
              </div>
              <div className="space-y-2 pt-3">
                <div className="h-4 w-3/4 bg-slate-800/50 rounded" />
                <div className="h-4 w-2/3 bg-slate-800/50 rounded" />
                <div className="h-4 w-1/2 bg-slate-800/50 rounded" />
              </div>
            </div>
          </div>
        ) : generationError ? (
          /* Error State with Graceful Fallback CTA */
          <div className="w-full max-w-xl my-auto p-6 md:p-8 bg-slate-950 border border-rose-500/30 rounded-2xl shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Generation Encountered an Issue</h3>
            <p className="text-xs text-rose-300 font-mono bg-rose-950/40 p-3 rounded-lg border border-rose-900/50 mb-5 text-left leading-relaxed">
              {generationError}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onSwitchToSimulation}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                Switch to Simulation Mode (P0)
              </button>
              <button
                type="button"
                onClick={onRegenerate}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          </div>
        ) : letterContent ? (
          /* Rendered A4 Sheet / Output Studio */
          <div className="w-full flex justify-center">
            {viewMode === 'raw' ? (
              <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap select-text">
                {letterContent}
              </div>
            ) : (
              /* A4 Paper Document Styling */
              <div
                id="printable-a4-sheet"
                className="a4-sheet w-full max-w-[760px] min-h-[960px] bg-white text-slate-900 p-8 sm:p-12 md:p-16 rounded-xl shadow-2xl border border-slate-200/80 font-sans leading-relaxed select-text transition-all duration-300"
              >
                {/* Printable Header Bar */}
                <div className="hidden print:block text-right text-[10px] text-slate-400 mb-4">
                  Generated with Prodesk IT AI Cover Letter Studio
                </div>

                {/* Rendered Semantic Markdown */}
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-2 border-b-2 border-slate-900 pb-2"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3 tracking-tight"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-base font-bold text-slate-900 mt-4 mb-2 tracking-tight"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="text-[14.5px] leading-relaxed text-slate-800 mb-4 font-normal"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="my-3 space-y-2 pl-5 list-disc text-[14.5px] text-slate-800"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="leading-relaxed pl-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-slate-950" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="border-t border-slate-200 my-4" {...props} />
                    ),
                  }}
                >
                  {letterContent}
                </ReactMarkdown>

                {/* Professional Sheet Footer */}
                <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between no-print">
                  <span>Prodesk IT Career Studio • Sprint 4</span>
                  <span>CONFIDENTIAL CANDIDATE DOSSIER</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Initial Placeholder State */
          <div className="my-auto text-center max-w-sm p-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1.5">No Letter Generated Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Configure your candidate details on the left, select your tone, optionally attach your resume, and click Generate.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supports Gemini 2.5 Flash & P0 Simulation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
