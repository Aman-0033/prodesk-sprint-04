import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { parseResumeFile } from '../utils/pdfParser';

export default function ResumeUploader({ resumeData, onResumeParsed, onResumeCleared }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    setError(null);
    setIsParsing(true);

    try {
      const parsedData = await parseResumeFile(file);
      onResumeParsed(parsedData);
    } catch (err) {
      console.error('File parsing failed:', err);
      setError(err.message || 'Failed to parse resume file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
    setShowPreview(false);
    onResumeCleared();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-400" />
          Resume Context (PDF or TXT)
          <span className="text-xs font-normal text-slate-400 ml-1">(Phase 3 P2 Feature)</span>
        </label>
        {resumeData && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Resume Loaded
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.md"
        onChange={handleInputChange}
        className="hidden"
        id="resume-file-input"
      />

      {!resumeData ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-slate-900'
          } ${isParsing ? 'pointer-events-none opacity-80' : ''}`}
        >
          {isParsing ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
              <p className="text-sm font-medium text-slate-200">
                Extracting text with client-side PDF.js...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Zero server latency • Runs 100% inside your browser
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                <span className="text-indigo-400 font-semibold hover:underline">
                  Click to upload
                </span>{' '}
                or drag and drop your resume
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supported formats: <strong className="text-slate-300">.PDF</strong> or{' '}
                <strong className="text-slate-300">.TXT</strong> (Max 10MB)
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Gemini will dynamically cite your real projects & metrics
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Loaded File Metadata Card */
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-4 shadow-lg shadow-indigo-950/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-100 truncate">
                  {resumeData.fileName}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-0.5">
                  <span>{resumeData.fileSizeKB} KB</span>
                  <span>•</span>
                  <span>{resumeData.pageCount} {resumeData.pageCount === 1 ? 'Page' : 'Pages'}</span>
                  <span>•</span>
                  <span>{resumeData.wordCount.toLocaleString()} Words</span>
                  <span>•</span>
                  <span>{resumeData.charCount.toLocaleString()} Chars</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1"
                title="Toggle Extracted Text"
              >
                {showPreview ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" /> Hide Text
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" /> View Text
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition"
                title="Remove resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible Extracted Text Preview */}
          {showPreview && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-semibold text-slate-300">Extracted Text Preview:</span>
                <span className="text-[11px] text-indigo-400">Directly injected into LLM Prompt</span>
              </div>
              <div className="max-h-40 overflow-y-auto p-3 bg-slate-950/80 rounded-lg text-xs font-mono text-slate-300 leading-relaxed border border-slate-800 select-text whitespace-pre-wrap">
                {resumeData.text || 'No text content extracted.'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
