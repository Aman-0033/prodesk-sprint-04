# Prodesk IT — Sprint 4: Application Walkthrough & QA Guide

> **Document:** Comprehensive Feature & Testing Walkthrough  
> **Project:** Prodesk IT — Sprint 4: The AI Cover Letter Generator  
> **Target Audience:** QA Engineers, Technical Evaluators, and Developers  

---

## ⚡ 60-Second Rapid Evaluation Walkthrough

Follow these simple steps to verify the entire application in under a minute without needing an API key:

1. **Launch the App:** Open [http://localhost:5173/](http://localhost:5173/) in your browser.
2. **Select Mode:** In the top header bar, click **"Simulation Mode (P0)"**.
3. **Populate Profile:** In the configuration panel (left column), click **"Try Demo Data"**.
   - Notice how Candidate Name, Target Role, Target Company, Key Skills tags, Job Description, and a sample 2-page resume are instantly populated.
4. **Generate Cover Letter:** Click the green button **"Generate Instant Cover Letter (Simulation Mode)"**.
5. **Inspect Output:** In the right column, verify the generated multi-paragraph, professional cover letter rendered on an authentic A4 paper sheet.
6. **Test Copy Button:** Click **"Copy"** on the toolbar. Notice the button switches to **"Copied! ✓"** with an emerald badge for 2 seconds.
7. **Toggle Markdown:** Click **"Markdown"** to see the clean raw markdown, then click **"Preview"** to return to formatted document view.
8. **Export:** Click **"Download"** -> select **"As Markdown (.md)"** or **"As Plain Text (.txt)"**.

---

## 🧭 In-Depth Phase-by-Phase Walkthrough

### Phase 1 (P0): Base MVP & Data Simulation

#### 1. Form Configuration Panel
- **Candidate Details:** Enter `Candidate Full Name`, `Target Job Role`, and `Target Organization`. All three are validated with visual indicators.
- **Tone Selector:** Choose between 4 distinct tones:
  - **Professional:** Standard, balanced corporate tone.
  - **Confident:** Assertive, high-impact results narrative.
  - **Technical:** Architecture-focused, emphasizing engineering rigor.
  - **Executive:** Visionary, leadership-oriented, focusing on ROI.
- **Interactive Skills Tag Input:**
  - Type a skill (e.g. `GraphQL`, `Docker`, `Rust`) and press **Enter** or click **Add**.
  - Click on any of the pre-suggested chips (`+ React 19`, `+ TypeScript`, `+ AWS Cloud`, etc.) to quickly add competencies.
  - Click the **"x"** icon on any skill tag to remove it dynamically.
- **Reset Button:** Click **"Reset"** at the top right of the panel to wipe all state clean.

#### 2. Live Document Studio & Sheet Preview
- **A4 Document Simulation:** Styled like an executive letter on crisp white paper with authentic margins, header rules, and footer confidentiality marks.
- **Multi-Format Export Options:**
  - **Copy to Clipboard:** Native `navigator.clipboard` integration with 2-second green confirmation state.
  - **Download .MD / .TXT:** Triggers an instant client-side `Blob` download with zero server roundtrip.
  - **Print / PDF:** Invokes `window.print()` with a specialized CSS print stylesheet that hides the UI toolbar and renders a clean PDF.

---

### Phase 2 (P1): Google Gemini LLM Integration & Security Protocol

#### 1. Header Mode Switching
- Toggle between **"AI Mode (Gemini API)"** and **"Simulation Mode (P0)"** at any time using the segment control in the header.
- The primary action button updates its icon, gradient, and label dynamically based on active mode.

#### 2. Security Protocol & Session Key Override
- **Zero Hardcoded Secrets:** Check `src/services/geminiService.js` to verify that API keys are strictly loaded via `import.meta.env.VITE_GEMINI_API_KEY`.
- **Git Protection:** Run `git status` to verify that `.env`, `.env.local`, and `.env.*` are completely ignored by `.gitignore`.
- **In-Memory Session Key Modal:**
  1. Click the **"API Settings"** button in the header.
  2. Enter a temporary Gemini API key in the password field.
  3. Select your desired model:
     - `gemini-2.5-flash` (Fastest / Recommended)
     - `gemini-1.5-flash` (Standard Fallback)
     - `gemini-1.5-pro` (High Reasoning)
  4. Click **"Test API Connection & Handshake"** to test live connectivity directly with Google AI Studio.
  5. Close the modal—the key is stored purely in React state for this session and is never saved to localStorage, cookies, or Git.

#### 3. Latency Management & Staged Skeleton Loader
When generating in AI Mode, the document studio displays an animated 4-stage progress timeline:
1. `Step 1 (25%): Parsing candidate context & extracted resume signals...`
2. `Step 2 (50%): Aligning key skills with target organization requirements...`
3. `Step 3 (75%): Synthesizing narrative via Gemini LLM...`
4. `Step 4 (100%): Polishing typography and finalizing document structure...`

#### 4. Fault-Tolerant Error Handling & Graceful Fallback
If an invalid API key, network timeout, or rate limit occurs:
- The UI catches the error inside an error boundary without crashing.
- A user-friendly error card is displayed explaining the issue.
- A prominent button **"Switch to Simulation Mode (P0)"** is provided, allowing you to instantly generate a cover letter even if the API is offline.

---

### Phase 3 (P2): SaaS-Level Client-Side PDF Resume Parsing

#### 1. Zero-Backend Browser Extraction
- The application processes resumes **100% inside the browser** using `pdfjs-dist` with an official CDN worker (`https://unpkg.com/pdfjs-dist@.../build/pdf.worker.min.mjs`).
- No resume file or text is ever uploaded to an intermediate backend server.

#### 2. Drag-and-Drop Resume Uploader
1. Drag and drop any `.pdf` or `.txt` file onto the dropzone (or click to browse).
2. Watch the extraction spinner process the document.
3. Once loaded, the metadata card displays:
   - **File Name**
   - **File Size (KB)**
   - **Page Count**
   - **Word Count**
   - **Character Count**
4. Click **"View Text"** to expand the collapsible preview and verify the extracted text stream.
5. Click the **"X"** icon to remove the resume at any time.

#### 3. Dynamic Personalization in Prompt
- When a resume is attached, `src/services/geminiService.js` injects the extracted text under `### CANDIDATE RESUME CONTEXT`.
- The AI will cite actual past job titles, company names, metrics, and achievements from the resume in the generated letter.
- Rendered with `react-markdown` into properly spaced semantic `<p className="mb-4 leading-relaxed">` paragraphs and bulleted lists.

---

## 📂 File Architecture Map

```
Sprint 4/
├── .env.example                  # Safe template for environment configuration
├── .env                          # Local environment file (strictly git-ignored)
├── .gitignore                    # Security rules blocking .env and secret files
├── index.html                    # Root HTML with Inter font & SEO meta tags
├── package.json                  # Dependencies (React 19, Tailwind v4, Lucide, Gemini, PDF.js)
├── vite.config.js                # Vite 8 configuration with Tailwind CSS plugin
├── Prompts.md                    # System prompt specs, injection workflows & guardrails
├── README.md                     # Project overview, Mermaid architecture & setup guide
├── walkthrough.md                # This comprehensive step-by-step testing guide
└── src/
    ├── App.jsx                   # Main application orchestration & state management
    ├── index.css                 # Tailwind CSS v4 directives & A4 print styles
    ├── main.jsx                  # React 19 application entry point
    ├── components/
    │   ├── Header.jsx            # Branding, mode switcher, and API settings trigger
    │   ├── InputPanel.jsx        # Form controls, tag input, tone selector & demo loader
    │   ├── PreviewStudio.jsx     # A4 sheet rendering, copy feedback, exports & skeleton
    │   ├── ResumeUploader.jsx    # Drag-and-drop PDF/TXT parser with metadata preview
    │   └── SettingsModal.jsx     # In-memory session API key override & connection test
    ├── services/
    │   └── geminiService.js      # Google Generative AI SDK, prompt builder & fallbacks
    └── utils/
        ├── pdfParser.js          # Client-side pdfjs-dist extraction engine
        └── templateSimulator.js  # P0 simulation controller with 4 tone variations
```

---

## 🧪 Verification Commands

To verify code quality and build integrity from your terminal:

```bash
# 1. Run Oxlint checks
npm run lint

# 2. Compile production bundle
npm run build

# 3. Preview production build locally
npm run preview
```

*Engineered for Prodesk IT Sprint 4 — High-Conversion AI Cover Letter Studio.*
