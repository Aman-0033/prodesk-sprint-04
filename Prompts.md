# Prodesk IT — Sprint 4: Prompts & AI Engineering Architecture

> **Document Type:** Production AI Engineering Specification & Prompt Architecture  
> **Sprint:** 4 — The AI Cover Letter Generator  
> **Author:** Principal Full-Stack AI Engineer & UI/UX Architect  
> **LLM Target:** Google Gemini API (`gemini-2.5-flash`, fallback: `gemini-1.5-flash`)

---

## 1. System Prompt Architecture

The system prompt is engineered to transform the Google Gemini LLM into an elite Career Strategist and Principal Technical Recruiter. Rather than outputting generic prose, the prompt enforces a metrics-driven, role-tailored structure designed for ATS parsing and executive review.

### 1.1 Master Prompt Template

```markdown
You are an Elite Executive Career Coach & Principal Technical Recruiter at Prodesk IT.
Your mission is to generate a world-class, high-conversion cover letter tailored specifically for the candidate and the target role.

### CANDIDATE AND TARGET DETAILS:
- Candidate Full Name: ${name}
- Target Job Role: ${role}
- Target Organization: ${company}
- Core Skills & Competencies: ${skillsString}
- Desired Writing Tone: ${tone}
- Current Date: ${currentDate}

### TARGET JOB DESCRIPTION / REQUIREMENTS:
${jobDescription}

### CANDIDATE RESUME CONTEXT (EXTRACTED VIA PDF/TEXT):
${resumeContext.slice(0, 4000)}

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
   - Strictly use "${name}", "${company}", and the actual skills provided.
```

---

## 2. Dynamic Variable & Resume Injection Workflow

```
+-------------------------------------------------------------+
|                     React Form State                        |
|  - Candidate Name: "Samantha Reed"                          |
|  - Target Role: "Lead Full-Stack Engineer"                  |
|  - Target Company: "Vercel"                                 |
|  - Skills Array: ["React 19", "Next.js", "TypeScript", ...] |
|  - Tone: "Confident" | "Technical" | "Executive"            |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|              Client-Side PDF Extraction (pdfjs-dist)        |
|  - Browser ArrayBuffer -> Worker Text Token Extraction       |
|  - Token normalization & line break preservation            |
|  - Character slice safety: resumeContext.slice(0, 4000)     |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|             Gemini Prompt Assembly & Sanitization           |
|  - constructCoverLetterPrompt(payload)                      |
|  - Zero-bracket enforcement filter                          |
|  - Temperature & TopP tuning based on selected tone         |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|               Google Gemini API SDK Pipeline                |
|  - Primary: gemini-2.5-flash                                |
|  - Fallback: gemini-1.5-flash / gemini-1.5-pro              |
|  - Latency Progress Dispatcher (Steps 1 to 4)               |
+-------------------------------------------------------------+
```

### 2.1 Resume Context Truncation & Token Budgeting
To optimize context window usage and prevent prompt flooding while preserving high-signal achievements, the client-side parser extracts raw text tokens and passes the top 4,000 characters of dense resume context. This includes:
- Work history bullet points containing metrics (e.g., `42% latency reduction`, `25k RPM`).
- Technical stacks, certifications, and educational credentials.
- Project architectural roles.

---

## 3. Client-Side PDF Parsing Architecture (`pdfjs-dist`)

### 3.1 Zero-Backend CDN Worker Pattern
To eliminate the requirement of a dedicated Node.js/Python backend server for document processing, `src/utils/pdfParser.js` utilizes `pdfjs-dist` directly within the browser runtime:

1. **Worker Initialization:**
   ```javascript
   import * as pdfjsLib from 'pdfjs-dist';

   const version = pdfjsLib.version || '4.10.38';
   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
   ```
2. **Asynchronous Page Traversal:**
   The document is loaded from an `ArrayBuffer` generated by `file.arrayBuffer()`. Each page is loaded asynchronously, its text content stream inspected for positioning (`transform[5]` coordinate checks), and words concatenated with natural line wrapping.
3. **Password & Fault Tolerance:**
   Protected PDFs trigger a `PasswordException` which is gracefully captured and converted to a user-facing notice prompting an unlocked file.

---

## 4. Security Protocols & Guardrails

| Threat / Vulnerability | Mitigation Mechanism | Implementation Location |
| :--- | :--- | :--- |
| **API Key Exposure to Git** | Explicit `.gitignore` entries for `.env`, `.env.local`, `.env.*` | `/.gitignore:13-17` |
| **Source Code Leaks** | Strict usage of `import.meta.env.VITE_GEMINI_API_KEY`, zero hardcoded tokens | `src/services/geminiService.js` |
| **Ephemeral QA Testing** | In-memory React state Session Key Override (never written to storage or disk) | `src/components/SettingsModal.jsx` |
| **Rate Limit / Outage Crash** | Automatic Fallback to P0 Template Simulation Mode | `src/components/PreviewStudio.jsx` |
| **Prompt Injection in Resume** | Strict delimiter isolation via `### CANDIDATE RESUME CONTEXT` markdown blocks | `src/services/geminiService.js` |

---

## 5. Tone Temperature Tuning Matrix

| Tone Option | Recommended Temperature | Top-P | Focus / Vocabulary |
| :--- | :---: | :---: | :--- |
| **Technical** | `0.4` | `0.90` | High determinism, precise technical nomenclature, system architecture focus. |
| **Professional** | `0.6` | `0.95` | Balanced cadence, formal corporate tone, standard business vocabulary. |
| **Executive** | `0.6` | `0.95` | Strategic impact, cross-functional ROI, roadmap governance, visionary leadership. |
| **Confident** | `0.8` | `0.95` | High conviction, active voice verbs, bold outcomes, proactive delivery narrative. |
