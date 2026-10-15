/**
 * Prodesk IT - Sprint 4: The AI Cover Letter Generator
 * Phase 2 (P1) Gemini LLM Integration Service
 *
 * Interacts with Google Gemini API via @google/generative-ai SDK.
 * Features prompt engineering, dynamic variable injection, resume context integration,
 * multi-model fallback (gemini-2.5-flash -> gemini-1.5-flash), and robust error classification.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Returns the effective API key from session state or Vite env.
 * @param {string} [sessionKey] - Optional user override key from settings modal
 * @returns {string} The API key or empty string
 */
export function getEffectiveApiKey(sessionKey = '') {
  if (sessionKey && sessionKey.trim().length > 0) {
    return sessionKey.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== 'your_gemini_api_key_here' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  return '';
}

/**
 * Generates the system prompt and payload instructions for Gemini.
 */
export function constructCoverLetterPrompt(payload) {
  const {
    name = '',
    role = '',
    company = '',
    skills = [],
    jobDescription = '',
    tone = 'Professional',
    resumeContext = '',
  } = payload;

  const skillsString = Array.isArray(skills) ? skills.join(', ') : skills;
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const prompt = `You are an Elite Executive Career Coach & Principal Technical Recruiter at Prodesk IT.
Your mission is to generate a world-class, high-conversion cover letter tailored specifically for the candidate and the target role.

### CANDIDATE AND TARGET DETAILS:
- Candidate Full Name: ${name}
- Target Job Role: ${role}
- Target Organization: ${company}
- Core Skills & Competencies: ${skillsString || 'Software Engineering, Full-Stack Architecture, Team Collaboration'}
- Desired Writing Tone: ${tone}
- Current Date: ${currentDate}

${jobDescription ? `### TARGET JOB DESCRIPTION / REQUIREMENTS:\n${jobDescription}\n` : ''}

${resumeContext ? `### CANDIDATE RESUME CONTEXT (EXTRACTED VIA PDF/TEXT):\n${resumeContext.slice(0, 4000)}\n` : ''}

### MANDATORY WRITING & FORMATTING RULES:
1. TONE ENFORCEMENT (${tone}):
   - If "Professional": Polished, courteous, balanced, and articulate.
   - If "Confident": Bold, high-conviction, energetic, highlighting proactive leadership and results.
   - If "Technical": Precise, system-architecture focused, emphasizing code quality, stack depth, and engineering principles.
   - If "Executive": Visionary, strategic, emphasizing business value, team empowerment, and cross-functional ROI.

2. STRUCTURE & FORMAT:
   - Output purely valid, clean Markdown with no meta-announcements (e.g. DO NOT say "Here is your cover letter:").
   - Include a crisp header with Candidate Name, target role, contact note, and the current date.
   - Address the Hiring Manager / Engineering Team at "${company}".
   - Write a compelling opening hook showing genuine knowledge of ${company}'s domain.
   - Include 2-3 body paragraphs detailing relevant achievements and technical fit.
   - If candidate resume context is provided above, extract real projects, frameworks, or accomplishments from it!
   - Highlight 3 bullet points with bold headers (e.g. "**Technical Scalability:** ...") focusing on tangible outcomes.
   - Conclude with a strong, confident call to action and a formal professional sign-off.

3. ZERO PLACEHOLDER GUARANTEE:
   - NEVER output brackets like [Your Name], [Company Name], [Skill], or [Date].
   - Strictly use "${name}", "${company}", and the actual skills provided.`;

  return prompt;
}

/**
 * Calls Google Gemini API with staged status updates and model fallback.
 * @param {Object} payload - Candidate and form data
 * @param {Object} options - API options (apiKey, model, onProgress callback)
 * @returns {Promise<string>} Generated markdown string
 */
export async function generateCoverLetterWithGemini(payload, options = {}) {
  const { sessionKey = '', onProgress = () => {}, preferredModel = 'gemini-2.5-flash' } = options;
  const apiKey = getEffectiveApiKey(sessionKey);

  if (!apiKey) {
    throw new Error(
      'MISSING_API_KEY: No Gemini API Key was found in your .env or session settings. Please provide a valid Gemini API Key or switch to Simulation Mode (P0 Template).'
    );
  }

  // Progress Stage 1: Parsing input & resume signals
  onProgress({
    step: 1,
    label: 'Parsing candidate context & extracted resume signals...',
    progress: 25,
  });

  const prompt = constructCoverLetterPrompt(payload);

  // Quick simulated delay for smooth UX transition
  await new Promise((r) => setTimeout(r, 400));

  // Progress Stage 2: Cross-referencing competencies
  onProgress({
    step: 2,
    label: `Aligning key skills with ${payload.company || 'target organization'} requirements...`,
    progress: 50,
  });

  const genAI = new GoogleGenerativeAI(apiKey);

  // Model cascade: try preferred model (e.g. gemini-2.5-flash), fall back to gemini-1.5-flash
  const modelsToTry = [preferredModel, 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'].filter(
    (item, index, self) => self.indexOf(item) === index
  );

  let lastError = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModelName = modelsToTry[i];
    try {
      // Progress Stage 3: Contacting Gemini LLM
      onProgress({
        step: 3,
        label: `Synthesizing ${payload.tone || 'Professional'} narrative via ${currentModelName}...`,
        progress: 75,
      });

      const model = genAI.getGenerativeModel({
        model: currentModelName,
        generationConfig: {
          temperature: payload.tone === 'Technical' ? 0.4 : payload.tone === 'Confident' ? 0.8 : 0.6,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Received an empty response from Gemini API.');
      }

      // Progress Stage 4: Formatting & Finalizing
      onProgress({
        step: 4,
        label: 'Polishing typography and finalizing document structure...',
        progress: 100,
      });

      return text.trim();
    } catch (err) {
      console.warn(`Model ${currentModelName} failed:`, err);
      lastError = err;

      // If it's an API key error, don't retry other models—fail fast
      const errMsg = err?.message || '';
      if (
        errMsg.includes('API_KEY_INVALID') ||
        errMsg.includes('API key not valid') ||
        errMsg.includes('403 Forbidden') ||
        errMsg.includes('400 Bad Request') && errMsg.includes('key')
      ) {
        throw new Error(
          'INVALID_API_KEY: The provided Google Gemini API Key is invalid or expired. Check your key in Settings or switch to Simulation Mode.'
        );
      }

      // If rate limit (429), try next model or report
      if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('429')) {
        if (i < modelsToTry.length - 1) {
          continue; // Try next model in list
        }
        throw new Error(
          'RATE_LIMIT: Gemini API rate limit reached. Please wait a moment, use a different API key, or switch to Simulation Mode.'
        );
      }
    }
  }

  // If all models failed
  throw new Error(
    `API_CALL_FAILED: Unable to generate cover letter with Gemini API (${lastError?.message || 'Network error'}). You can switch to Simulation Mode to generate an instant cover letter.`
  );
}
