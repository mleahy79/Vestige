# Vestige

**Git-history technical due diligence. Every change leaves a vestige.**

Live demo: [vestige-azure.vercel.app](https://vestige-azure.vercel.app)

---

## What it is

Vestige reads a repository's git history (commits, diffs, PR descriptions, merge patterns) and produces a technical due diligence report: what decisions were made, what evidence supports each finding, and what risks deserve attention. It is built for the people who commission this kind of report manually before an acquisition: private equity and growth equity teams evaluating a software asset, and the technical reviewers who advise them.

The core idea came from a simple observation: every codebase carries a record of why it is the way it is, but that record is scattered across thousands of commits nobody has time to read. Vestige reads them.

## Why the triage matters more than the findings

Every codebase has flags. Including the ones I write. Nobody ships code that holds up to every scrutiny, so a wall of raw findings is noise, not analysis. The product is the triage:

- **Evidence confidence** on every finding: **Surface / Strata / Bedrock**, rating how strongly the git record supports the claim. Bedrock findings are backed by documented human intent. Surface findings are inferred and say so.
- **Risk severity** rated separately: **High / Medium / Low**. Confidence and severity are different questions, and Vestige never conflates them.
- **Inference flags** so a reader always knows when the tool is reading the record versus synthesizing from it.

## Built for accountability, not just output

Reports in a financial context need a human on the hook. Vestige includes a **sign-off layer**: named reviewers, checkbox ownership, and timestamps on every acknowledgment, so a low-confidence finding can be formally reviewed and owned by a person rather than silently accepted from a machine.

## Plain English on purpose

Jargon gatekeeps. I watched it happen for years in industrial work: people get rated on words instead of the competence the words describe. PE buyers are experts at risk. What they lack is the mapping between code artifacts and their own risk vocabulary, so Vestige writes its reports in tiers, from engineer-level detail down to a plain-English layer a non-technical reader can act on without a translator.

## How it works

RAG over git artifacts:

1. **Ingest**: commits, diffs, PR descriptions, branch and merge patterns
2. **Parse**: extract decision signals (what changed, how often, what context is linked)
3. **Rank**: assign evidence confidence based on artifact richness
4. **Generate**: structured JSON from the Claude API, rendered as findings cards in the UI

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Claude API for analysis and report generation
- Deployed on Vercel

## Status

Working product, actively developed. The flagship demo runs against a real ~28k-star open-source fintech codebase, sanitized of repository and contributor identifiers. It can also run live against a repo you choose, which is exactly how I like to demo it.

## Background

Vestige is the third iteration of an idea: GitStory (a narrative layer over code history) grew into SustainRx (full codebase analysis, see that repo), and Vestige strips the concept back to its sharpest form, the historian. Built solo, from concept through design, architecture, and deployment.

---

Built by Mitchell Leahy. Portfolio: [mleahy.dev](https://mleahy.dev)
