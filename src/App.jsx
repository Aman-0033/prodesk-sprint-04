import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import PreviewStudio from './components/PreviewStudio';
import SettingsModal from './components/SettingsModal';
import { generateSimulatedLetter } from './utils/templateSimulator';
import { generateCoverLetterWithGemini, getEffectiveApiKey } from './services/geminiService';
import { Sparkles, Shield, Cpu, FileCheck } from 'lucide-react';

const INITIAL_FORM_DATA = {
  candidateName: '',
  targetRole: '',
  targetCompany: '',
  skills: [],
  jobDescription: '',
  tone: 'Professional',
};

const DEMO_PROFILE = {
  candidateName: 'Samantha Reed',
  targetRole: 'Lead Full-Stack Engineer',
  targetCompany: 'Vercel',
  skills: [
    'React 19',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'GraphQL',
    'Distributed Systems',
  ],
  jobDescription:
    'Seeking an experienced Lead Full-Stack Engineer to scale our serverless web infrastructure, build developer tools, and architect high-concurrency real-time collaboration features.',
  tone: 'Confident',
  sampleResume: {
    fileName: 'Samantha_Reed_Resume.pdf',
    fileSizeKB: '84.2',
    pageCount: 2,
    wordCount: 420,
    charCount: 2750,
    text: `Samantha Reed — Senior Full-Stack Engineer & Tech Lead
Experience:
- Senior Staff Software Engineer at Acme Cloud Platforms (2021 - Present): Led 9 engineers in modernizing cloud deployment interfaces. Reduced 99th percentile UI latency by 42% through optimized caching, server components, and streaming SSR.
- Full-Stack Developer at NextGen Technologies (2018 - 2021): Designed and deployed resilient Node.js microservices handling 25,000 requests per minute with 99.99% uptime.
Education:
- B.S. in Computer Science, University of California, Berkeley (3.9 GPA).
Technical Stack: React, TypeScript, Next.js, Node.js, PostgreSQL, Docker, AWS, GraphQL, CI/CD.`,
  },
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [resumeData, setResumeData] = useState(null);
  const [mode, setMode] = useState('ai'); // 'ai' | 'simulation'
  const [sessionApiKey, setSessionApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Studio / Output State
  const [letterContent, setLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressState, setProgressState] = useState({ step: 1, label: '', progress: 0 });
  const [generationError, setGenerationError] = useState(null);

  // Determine if effective API key is present
  const hasApiKey = Boolean(getEffectiveApiKey(sessionApiKey));

  const handleGenerate = async () => {
    setGenerationError(null);
    setIsGenerating(true);

    const payload = {
      name: formData.candidateName,
      role: formData.targetRole,
      company: formData.targetCompany,
      skills: formData.skills,
      jobDescription: formData.jobDescription,
      tone: formData.tone,
      resumeContext: resumeData ? resumeData.text : '',
    };

    if (mode === 'simulation') {
      try {
        // Quick visual polish step
        setProgressState({ step: 1, label: 'Compiling P0 template parameters...', progress: 50 });
        await new Promise((r) => setTimeout(r, 350));
        const result = generateSimulatedLetter(payload);
        setLetterContent(result);
        setProgressState({ step: 4, label: 'Complete!', progress: 100 });
      } catch (err) {
        setGenerationError(`Simulation error: ${err.message}`);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // AI Mode via Gemini API
    try {
      const result = await generateCoverLetterWithGemini(payload, {
        sessionKey: sessionApiKey,
        preferredModel: selectedModel,
        onProgress: (state) => setProgressState(state),
      });
      setLetterContent(result);
    } catch (err) {
      console.error('Cover letter generation failed:', err);
      setGenerationError(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setResumeData(null);
    setLetterContent('');
    setGenerationError(null);
  };

  const handleLoadDemo = () => {
    setFormData({
      candidateName: DEMO_PROFILE.candidateName,
      targetRole: DEMO_PROFILE.targetRole,
      targetCompany: DEMO_PROFILE.targetCompany,
      skills: DEMO_PROFILE.skills,
      jobDescription: DEMO_PROFILE.jobDescription,
      tone: DEMO_PROFILE.tone,
    });
    setResumeData(DEMO_PROFILE.sampleResume);
    setGenerationError(null);
  };

  const handleSwitchToSimulation = () => {
    setMode('simulation');
    setGenerationError(null);
    // Automatically trigger simulation generation
    setTimeout(() => {
      const payload = {
        name: formData.candidateName || 'Candidate',
        role: formData.targetRole || 'Software Engineer',
        company: formData.targetCompany || 'Target Organization',
        skills: formData.skills.length > 0 ? formData.skills : ['Modern Web Tech', 'Full-Stack Architecture'],
        jobDescription: formData.jobDescription,
        tone: formData.tone,
        resumeContext: resumeData ? resumeData.text : '',
      };
      const result = generateSimulatedLetter(payload);
      setLetterContent(result);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Global SaaS Header */}
      <Header
        mode={mode}
        setMode={setMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main SaaS Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-6">
        {/* Sprint Overview Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Sprint 4 Production Architecture
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Phases 1, 2 & 3 Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                P0 Base MVP Simulation • P1 Gemini LLM Engine • P2 Client-Side PDF Resume Context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              .env Guarded
            </span>
            <span className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              {selectedModel}
            </span>
          </div>
        </div>

        {/* Two-Column SaaS Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Configuration Panel (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <InputPanel
              formData={formData}
              setFormData={setFormData}
              resumeData={resumeData}
              setResumeData={setResumeData}
              mode={mode}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              onReset={handleReset}
              onLoadDemo={handleLoadDemo}
            />
          </div>

          {/* Right Column: Live Document Studio & Sheet Preview (7 cols) */}
          <div className="lg:col-span-7 w-full h-full min-h-[600px]">
            <PreviewStudio
              letterContent={letterContent}
              isGenerating={isGenerating}
              progressState={progressState}
              generationError={generationError}
              mode={mode}
              onSwitchToSimulation={handleSwitchToSimulation}
              onRegenerate={handleGenerate}
            />
          </div>
        </div>
      </main>

      {/* Settings Modal for In-Memory API Key & Model Configuration */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sessionApiKey={sessionApiKey}
        setSessionApiKey={setSessionApiKey}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500 no-print">
        <p>
          Prodesk IT — Sprint 4: The AI Cover Letter Generator • Production Release • All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
