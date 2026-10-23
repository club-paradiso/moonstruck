# moonstruck

A responsive React + TypeScript + Tailwind CSS academic paper reader. It runs entirely in the browser with a deterministic placeholder AI adapter, local fonts, and a locally bundled PDF.js worker. No API keys or external runtime services are required.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

```sh
npm run build    # TypeScript checks and production bundle
npm run preview  # Serve the production build
npm test         # Text extraction structure and companion grounding tests
```

## What works

- Upload a PDF from the header, library, or by dropping it into the reader.
- Extract text, identify common section headings, and suggest claim/method/result highlights with local rules.
- Switch between an accessible reading view and an original PDF canvas with page navigation.
- Navigate sections, adjust reading size, and enter focus mode.
- Select a passage to reveal an inline translation, section explanation, or save action.
- Use English, Korean, or bilingual reading modes for the included educational paper.
- Ask the local bunny companion for paper excerpts and section-reading guides, with links back to source sections.
- Add, delete, and export notes as Markdown. Notes and lesson progress persist in localStorage.
- Store uploaded PDF files in IndexedDB and reopen them from the library after reload.
- Complete a four-step lesson with scored questions, retry feedback, and completion state.
- Use the outline and companion drawers on smaller screens.

## Deliberate local-demo limits

The sample paper, authors, study, and numerical results are fictional. Its Korean translations and explanations are curated. Do not cite the sample as research evidence.

The AI boundary is `src/lib/analysis.ts` (`askCompanion`). It retrieves document excerpts and uses deterministic educational guides; it is not an LLM. Uploaded-paper translation is explicitly unavailable until a model adapter is connected. Arbitrary questions receive a truthful local-demo notice. Do not put provider credentials in browser code; any future model integration must use a server-side adapter.

Highlighting is heuristic, not a scientific assessment. Extracted reading order may differ for multicolumn layouts, equations, or tables. Check the Original PDF view for layout fidelity. Scanned/image-only PDFs can be viewed, but OCR is not included. Password-protected PDFs require an unlocked copy. Limits: 40 MB and 150 pages per file. Browser storage is local to the current browser and origin, and may be cleared by browser settings.

## Structure

- `src/App.tsx`: app composition, uploads, library state, notes, and navigation
- `src/components/`: reader, PDF canvas, sidebar, companion, library, lesson, shared controls
- `src/lib/`: types, educational sample, analysis adapter, PDF extraction, and persistence
- `src/styles.css`: visual tokens, responsive layouts, and component styles
- `public/bunny.png`: generated reading companion asset

## Design and assets

The interface uses white paper, a cool-gray canvas, lavender controls, serif article typography, and a three-column desktop layout. The concept and bunny were created with the built-in image generator. The generated mascot is included locally; fonts and icons are installed dependencies. This is an independent implementation, not affiliated with the original reference product.

## Verification performed

- `npm run build`: TypeScript and production build passed.
- `npm test`: 6 tests passed, including section/page mapping, unique passage identifiers, empty scans, highlight classification, and document-grounded demo responses.
- Playwright with local Chrome: 41 checks passed at desktop 1536×1024, mobile 390×844, and tablet 768×1024. Browser plugin was unavailable, so regular Playwright was used. Checked upload, rendering, page navigation, notes persistence/export/deletion, library persistence, translations, chat, lesson completion, invalid/scanned PDFs, and responsive drawers. Zero runtime application errors and zero external HTTP requests.
- Korean copy lint: 30 extracted strings checked with `kolint --stdin --genre ux`; zero findings or blocking issues.
- Visual review: the concept and native-size desktop screenshot were both inspected with `view_image`. Checked column layout, typography, palette, icons, mascot treatment, spacing, responsive behavior, and visible copy. Smaller initial UI text and title wrapping were corrected. Intentional differences are fictional-paper disclosures, local-demo copy, responsive drawers, and the standalone bunny variant.

Chrome was tested; Safari and Firefox were not tested. The app uses modern PDF.js/browser features.

## Korean interface mode

Use **한국어 / English** in the header to switch the complete interface. The choice persists across reloads and updates the page language, navigation, library, notes, reading companion, lessons, and error messages. Korean mode starts the sample in bilingual reading; the paper-language selector remains independent. New companion responses follow the interface language. Previously written notes and chat messages retain their original text.

The app is now branded **moonstruck**, including the browser title and `moonstruck-notes.md` exports. Existing internal storage keys are retained for compatibility, so previously saved PDFs, notes, and lesson progress are preserved. Uploaded-paper translation still requires a model adapter; changing the interface language does not invent translations.
