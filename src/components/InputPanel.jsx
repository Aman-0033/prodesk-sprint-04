import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Tag,
  Briefcase,
  Building2,
  User,
  SlidersHorizontal,
  Plus,
  X,
  FileCode,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import ResumeUploader from './ResumeUploader';

const TONES = [
  {
    id: 'Professional',
    label: 'Professional',
    description: 'Polished, balanced, respectful tone suited for corporate & enterprise roles.',
    badge: 'Standard',
  },
  {
    id: 'Confident',
    label: 'Confident',
    description: 'Assertive, high-energy, results-first narrative highlighting proactive leadership.',
    badge: 'High Impact',
  },
  {
    id: 'Technical',
    label: 'Technical',
    description: 'Architecture-centric, emphasizing stack depth, system design, and code rigor.',
    badge: 'Eng / DevOps',
  },
  {
    id: 'Executive',
    label: 'Executive',
    description: 'Strategic, vision-driven, focusing on cross-functional ROI and leadership.',
    badge: 'Director / C-Suite',
  },
];

const SUGGESTED_SKILLS = [
  'React 19',
  'TypeScript',
  'Node.js',
  'Next.js',
  'Tailwind CSS',
  'Python',
  'AWS Cloud',
  'Docker',
  'GraphQL',
  'System Architecture',
  'Generative AI',
  'CI/CD Pipelines',
];

export default function InputPanel({
  formData,
  setFormData,
  resumeData,
  setResumeData,
  mode,
  isGenerating,
  onGenerate,
  onReset,
  onLoadDemo,
}) {
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim().replace(/,$/, '');
    if (!trimmed) return;

    if (!formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setSkillInput('');
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const isFormValid =
    formData.candidateName.trim() &&
    formData.targetRole.trim() &&
    formData.targetCompany.trim() &&
    formData.skills.length > 0;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md flex flex-col gap-6">
      {/* Top Banner / Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Application Configuration</h2>
            <p className="text-xs text-slate-400">Configure parameters for personalized generation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            className="text-xs font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-700/50 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5"
            title="Populate realistic senior full-stack developer profile"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Try Demo Data</span>
            <span className="sm:hidden">Demo</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5"
            title="Reset all form inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Primary Required Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Candidate Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            Candidate Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Vance"
            value={formData.candidateName}
            onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition outline-none"
          />
        </div>

        {/* Target Job Role */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Target Job Role <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Lead Full-Stack Architect"
            value={formData.targetRole}
            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition outline-none"
          />
        </div>

        {/* Target Company */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Target Company <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Stripe, Linear, or Prodesk IT"
            value={formData.targetCompany}
            onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition outline-none"
          />
        </div>
      </div>

      {/* Tone Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Narrative Tone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TONES.map((t) => {
            const isSelected = formData.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormData({ ...formData, tone: t.id })}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold">{t.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t.badge}
                  </span>
                </div>
                <p className="text-[11px] leading-tight text-slate-400 line-clamp-2">
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Skills - Interactive Tag Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            Key Skills & Competencies <span className="text-rose-400">*</span>
          </label>
          <span className="text-xs text-slate-400">
            {formData.skills.length} {formData.skills.length === 1 ? 'skill' : 'skills'} added
          </span>
        </div>

        {/* Tag Container & Input Box */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg animate-in fade-in zoom-in-95 duration-100"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 hover:bg-rose-500/15 rounded p-0.5 transition"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type skill & press Enter (e.g. Next.js, Kubernetes, System Design)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDownSkill}
              className="flex-1 bg-transparent border-none text-xs text-slate-100 placeholder:text-slate-500 outline-none px-1 py-1"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              disabled={!skillInput.trim()}
              className="text-xs font-medium bg-slate-800 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Quick Skill Suggestions */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
          {SUGGESTED_SKILLS.map((s) => {
            const isAlreadyAdded = formData.skills.some(
              (item) => item.toLowerCase() === s.toLowerCase()
            );
            if (isAlreadyAdded) return null;
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleAddSkill(s)}
                className="text-[11px] text-slate-400 hover:text-indigo-300 bg-slate-800/60 hover:bg-indigo-500/10 border border-slate-700/60 hover:border-indigo-500/30 px-2 py-0.5 rounded-md transition"
              >
                + {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Job Description / Context */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            Job Description / Target Requirements
            <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </label>
          <span className="text-[11px] text-slate-500">
            {formData.jobDescription.length} chars
          </span>
        </div>
        <textarea
          rows={3}
          placeholder="Paste requirements, job spec snippets, or responsibilities from the posting..."
          value={formData.jobDescription}
          onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
          className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 transition outline-none resize-y"
        />
      </div>

      {/* Phase 3 Resume Uploader */}
      <ResumeUploader
        resumeData={resumeData}
        onResumeParsed={setResumeData}
        onResumeCleared={() => setResumeData(null)}
      />

      {/* Submit / Generate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!isFormValid || isGenerating}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg ${
            !isFormValid || isGenerating
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : mode === 'ai'
              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Cover Letter...</span>
            </>
          ) : mode === 'ai' ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Generate AI Cover Letter (Gemini API)</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Generate Instant Cover Letter (Simulation Mode)</span>
            </>
          )}
        </button>

        {!isFormValid && (
          <p className="text-center text-xs text-amber-400/80 mt-2">
            Please fill in Name, Job Role, Company, and at least one Skill to generate.
          </p>
        )}
      </div>
    </div>
  );
}
