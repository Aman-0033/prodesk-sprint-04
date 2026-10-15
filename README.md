# Prodesk IT — Sprint 4: The AI Cover Letter Generator

> **Production-Grade SaaS Web Application**  
> Architected for **Prodesk IT Sprint 4** with React (Vite), Tailwind CSS, Google Gemini LLM API, and Client-Side PDF Resume Parsing.

---

## 🚀 Live Demo & Quick Start

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```
2. **Configure Environment Variables (Optional for P0):**
   ```bash
   cp .env.example .env
   # Edit .env with your Google AI Studio Gemini API key:
   # VITE_GEMINI_API_KEY=AIzaSy...
   ```
3. **Launch Local Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

> **💡 Note for QA Evaluators:** You can test immediately without any `.env` key by using **Simulation Mode (P0)** or entering a temporary session key via the **API Settings** modal in the UI header!

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph UI_UX ["User Interface (React 19 + Tailwind CSS)"]
        A[Header: Mode Toggle & API Settings]
        B[Input Panel: Form + Skills Tag Input]
        C[Resume Dropzone: PDF / TXT Uploader]
        D[Preview Studio: A4 Sheet + Copy/Export]
    end

    subgraph Core_Services ["Application Core & Processing"]
        E[pdfParser.js: pdfjs-dist CDN Worker]
        F[templateSimulator.js: P0 Controller]
        G[geminiService.js: Google Generative AI SDK]
    end

    subgraph LLM_Cloud ["External Services"]
        H[(Google Gemini 2.5 Flash / 1.5 Flash)]
    end

    B -->|User Inputs| F
    B -->|Payload & Prompts| G
    C -->|Extract Tokens (Browser)| E
    E -->|Extracted Text Context| G
    E -->|Extracted Text Context| F
    G -->|Streaming Callbacks| D
    G -->|Prompt Delivery| H
    H -->|Markdown Response| D
    F -->|Instant Interpolation| D
```

---

## 📋 Comprehensive Feature Checklist

### Phase 1 (P0): Base MVP & Data Simulation
- [x] **Two-Column SaaS Layout:** Responsive split between Configuration Input Panel (left) and Live Document Preview Studio (right).
- [x] **Form Inputs:** Candidate Name (required), Target Role (required), Target Company (required), Interactive Key Skills Tag Input with suggested chips (required), Job Description (optional), and Tone Selector.
- [x] **Dedicated Template Simulator:** `src/utils/templateSimulator.js` with `generateSimulatedLetter(payload)` interpolating variables into 4 distinct tone templates (Professional, Confident, Technical, Executive).
- [x] **Live A4 Document Preview:** Styled like an executive paper sheet with crisp margins, headers, and metadata.
- [x] **Copy with Visual Feedback:** Clipboard copy button with green `Copied! ✓` state indicator for 2 seconds.
- [x] **Multi-Format Export:** Instant export to `.md` (Markdown) and `.txt` (Plain text), plus native Print/PDF support (`window.print()`).
- [x] **Form Reset & Demo Profile:** Instant one-click demo population for streamlined QA evaluation.

### Phase 2 (P1): Gemini LLM Integration & Latency UX
- [x] **Gemini SDK Integration:** Direct connection using `@google/generative-ai` with primary `gemini-2.5-flash` and resilient fallback to `gemini-1.5-flash`.
- [x] **Structured System Prompt:** Elite Tech Recruiter and Executive Career Coach prompt architecture enforcing ATS-optimized formatting and zero placeholder brackets.
- [x] **Multi-Step Skeleton Loader:** 4-stage latency indicator during generation (*Parsing context -> Aligning skills -> Synthesizing narrative -> Polishing typography*).
- [x] **Fault-Tolerant Error Handling:** Structured error detection (invalid keys, rate limits, network timeouts) with one-click graceful fallback to P0 Simulation Mode.
- [x] **Mode Switching:** Header toggle between **"AI Mode (Gemini API)"** and **"Simulation Mode (P0 Template)"**.
- [x] **Session API Key Override:** In-memory key input modal stored purely in React state for risk-free evaluator testing.

### Phase 3 (P2): SaaS-Level PDF Parsing & Dynamic Personalization
- [x] **Client-Side PDF Extraction:** `src/utils/pdfParser.js` powered by `pdfjs-dist` with official CDN worker—100% browser-based without any backend server.
- [x] **Multi-Format Dropzone:** `src/components/ResumeUploader.jsx` accepting `.pdf` and `.txt` files with drag-and-drop animations.
- [x] **Resume Metadata & Preview:** Displays file name, size (KB), page count, word count, character count, and collapsible raw text inspector.
- [x] **Dynamic Personalization:** Injects parsed resume achievements directly into the LLM prompt under `### CANDIDATE RESUME CONTEXT`.
- [x] **Semantic HTML Formatting:** Markdown rendered into well-spaced semantic HTML elements (`<p>`, `<ul>`, `<li>`, `<strong>`) via `react-markdown`.

---

## 🔒 Security Protocol & Environment Guardrails

1. **Git Protection (`.gitignore`):**
   ```gitignore
   # Environment variables & secrets (CRITICAL SECURITY)
   .env
   .env.local
   .env.*
   !.env.example
   ```
2. **Environment Variable Reference:**
   - Keys are accessed strictly through `import.meta.env.VITE_GEMINI_API_KEY`.
   - Never hardcode or commit active API keys.
3. **Session Key Override:**
   - Evaluators can enter a temporary key in the UI settings dialog. This key lives exclusively in volatile React component state and disappears upon page reload.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) bootstrapped with [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite` |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **LLM Engine** | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Google Gemini API) |
| **PDF Extraction** | [pdfjs-dist](https://mozilla.github.io/pdf.js/) (Client-side token parsing via CDN worker) |
| **Markdown Rendering** | [react-markdown](https://github.com/remarkjs/react-markdown) |

---

## 📦 Build & Test Verification

```bash
# Run ESLint/Oxlint checks
npm run lint

# Production bundle compilation
npm run build

# Preview production build locally
npm run preview
```

---

*Engineered with precision for Prodesk IT Sprint 4.*
