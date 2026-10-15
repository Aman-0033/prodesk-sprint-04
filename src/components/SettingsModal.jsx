import React, { useState } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function SettingsModal({
  isOpen,
  onClose,
  sessionApiKey,
  setSessionApiKey,
  selectedModel,
  setSelectedModel,
}) {
  const [showKey, setShowKey] = useState(false);
  const [testingStatus, setTestingStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isEnvConfigured = envKey && envKey !== 'your_gemini_api_key_here' && envKey.trim().length > 0;
  const activeKey = (sessionApiKey && sessionApiKey.trim()) || (isEnvConfigured ? envKey : '');

  const handleTestKey = async () => {
    if (!activeKey) {
      setTestingStatus('error');
      setTestMessage('No API key provided to test. Please enter a key or set .env.');
      return;
    }

    setTestingStatus('testing');
    setTestMessage('Verifying connection with Google Gemini API...');

    try {
      const genAI = new GoogleGenerativeAI(activeKey);
      const model = genAI.getGenerativeModel({ model: selectedModel || 'gemini-2.5-flash' });
      const ping = await model.generateContent('Say "OK" in one word.');
      const response = await ping.response;
      const text = response.text();

      if (text) {
        setTestingStatus('success');
        setTestMessage(`Connection verified! Successfully connected to Google Gemini using ${selectedModel}.`);
      } else {
        throw new Error('Received empty response during handshake.');
      }
    } catch (err) {
      console.error('API key verification error:', err);
      setTestingStatus('error');
      setTestMessage(
        err.message || 'Verification failed. Please verify your Gemini API key and permissions.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">API Key & Model Settings</h3>
              <p className="text-xs text-slate-400">Configure your Gemini credentials for QA or production</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Security Notice */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-200 block mb-0.5 font-semibold">
                In-Memory Session Security Protocol
              </strong>
              Session keys entered here reside purely in React memory state and are never committed to Git, logged, or transmitted anywhere except directly to Google's official Gemini endpoint.
            </div>
          </div>

          {/* Environment Status */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                .env Key Status (VITE_GEMINI_API_KEY)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Loaded at startup from root <code>.env</code> file
              </div>
            </div>
            {isEnvConfigured ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active in .env
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5" /> Placeholder in .env
              </span>
            )}
          </div>

          {/* Session API Key Override Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Session API Key Override
              </label>
              {sessionApiKey && (
                <button
                  type="button"
                  onClick={() => setSessionApiKey('')}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  Clear Session Key
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="Paste AI Studio API Key (AIzaSy...)"
                value={sessionApiKey}
                onChange={(e) => {
                  setSessionApiKey(e.target.value);
                  setTestingStatus(null);
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Takes precedence over <code>.env</code> during your active session. Perfect for live evaluator testing.
            </p>
          </div>

          {/* Gemini Model Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Target Gemini Model
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gemini-2.5-flash', label: '2.5 Flash', badge: 'Fastest / Recommended' },
                { id: 'gemini-1.5-flash', label: '1.5 Flash', badge: 'Standard Fallback' },
                { id: 'gemini-1.5-pro', label: '1.5 Pro', badge: 'High Reasoning' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    selectedModel === m.id
                      ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Connection Button & Status */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testingStatus === 'testing' || !activeKey}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-2"
            >
              {testingStatus === 'testing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  Test API Connection & Handshake
                </>
              )}
            </button>

            {testingStatus === 'success' && (
              <div className="mt-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{testMessage}</span>
              </div>
            )}

            {testingStatus === 'error' && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{testMessage}</span>
              </div>
            )}
          </div>

          {/* Get Key Link */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Don't have a Gemini API Key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline"
            >
              Get free key from Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
}
