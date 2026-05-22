# Vestige - Repo Code Historian

## Project Context

Vestige is a focused, portfolio-grade tool that surfaces undocumented decisions from Git history. It generates tiered reports explaining *why* code exists the way it does — for different audiences (jr dev, mid dev, sr dev, non-technical).

Ships as a live interview centerpiece: you run it on their repo during the pitch, proving product thinking + focused execution.

**Lineage:** GitStory concept → SustainRx full-featured → Vestige (focused historian).

---

## What We're Reusing from SustainRx

- **UI foundation:** React component patterns, layout structure, routing
- **GitHub API integration:** Auth, repo fetching, rate limit handling (refactor to be optional or graceful)
- **Toast/notification system:** Already working in SustainRx
- **Loading states & error boundaries:** Copy the patterns from SustainRx
- **localStorage persistence:** For settings, cache, user prefs

**What we're NOT reusing:**
- Repository health metrics / analysis logic (too specific to SustainRx)
- The full Analyze → Chat → Hotspots flow
- Pricing tiers / trial logic (Vestige is simple; no freemium complexity)

---

## MVP: Core Features (Ship These)

### Phase 1: Foundation
- [ ] **Git history ingestion** — Clone repo / pull history, extract commits, diffs, PR data
- [ ] **Confidence scoring** — Rate evidence quality (High/Medium/Low) based on artifact richness
- [ ] **Basic report generation** — Analyze a code section, surface decision context from history

### Phase 2: Tiered Output
- [ ] **Junior Dev report** — "What this does and why it matters" (simple language, learning-focused)
- [ ] **Mid Dev report** — "Decision history and what to watch" (context + gotchas)
- [ ] **Senior Dev report** — "Inferred vs undocumented; flags for review" (critical eye)
- [ ] **Plain English report** — "What this codebase does" (for investors/non-technical)

### Phase 3: Polish & Interview Ready
- [ ] **Live demo mode** — Paste a GitHub URL, analyze in real-time
- [ ] **Brand identity** — Ammonite motif visual, purples + stone tones, favicon
- [ ] **Interview landing page** — Explain concept, link to live demo
- [ ] **Deploy** — Vercel or similar; shareable URL for interviews

---

## Architecture

**RAG over Git artifacts:**
1. Ingest: commits, diffs, PR descriptions, branch patterns, merge behavior
2. Parse: extract decision signals (what changed, how often, linked context)
3. Rank: assign confidence based on evidence richness
4. Generate: LLM produces tiered reports, each audience-specific

**Tech Stack (TBD):**
- Frontend: React (from SustainRx template)
- Backend: Node.js + Git.js or similar (pull/analyze history)
- LLM: Claude API (tiered prompt engineering per report type)
- Deployment: Vercel + simple backend (or full-stack SvelteKit if simpler)

---

## Session Notes

- **Status:** Starting fresh. Planning phase.
- **Current decision:** Reuse SustainRx UI patterns, build new backend for Git analysis
- **Next:** Design Git ingestion pipeline + confidence scoring logic

### Session Log
- (First session — structure in place)
