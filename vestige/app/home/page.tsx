import React from "react";
import Image from "next/image";
import { FaDownload, FaRoute, FaLightbulb } from "react-icons/fa";
import type { IconType } from "react-icons";

const V_MARK_PATH =
  "M 73.60,108.02 L 67.78,107.82 L 60.81,106.51 L 56.05,105.01 L 48.78,101.65 L 43.02,97.89 L 38.10,93.68 L 34.07,89.14 L 30.81,84.53 L 28.50,80.37 L 26.60,75.90 L 24.84,70.54 L 23.59,64.52 L 23.29,59.56 L 23.59,51.49 L 24.59,46.68 L 25.29,44.82 L 24.99,43.32 L 24.34,42.51 L 20.93,34.94 L 18.32,28.58 L 16.92,25.87 L 16.77,24.77 L 14.76,20.71 L 13.86,18.15 L 9.65,8.77 L 7.45,5.06 L 5.77,3.43 L 4.04,2.21 L 3.89,1.75 L 4.21,1.13 L 15.64,0.93 L 32.74,1.08 L 35.55,1.58 L 38.85,2.73 L 41.71,4.69 L 43.04,6.32 L 44.54,8.92 L 46.55,13.79 L 46.60,14.54 L 47.85,16.54 L 56.78,37.60 L 58.53,40.86 L 59.08,42.61 L 59.84,43.77 L 60.54,46.32 L 63.95,53.74 L 64.75,56.20 L 65.48,56.73 L 66.25,56.15 L 67.76,52.09 L 72.87,40.16 L 73.32,38.60 L 79.09,25.72 L 82.70,16.85 L 84.95,12.13 L 85.81,9.63 L 87.01,7.57 L 89.49,4.64 L 90.54,4.09 L 90.99,3.58 L 94.55,1.93 L 98.82,1.08 L 105.94,0.98 L 107.34,1.23 L 107.99,1.03 L 124.33,1.03 L 125.34,1.13 L 125.71,1.40 L 125.71,2.31 L 123.93,3.63 L 121.85,6.07 L 119.30,10.88 L 118.34,13.74 L 116.09,18.35 L 113.33,24.97 L 112.18,26.92 L 111.98,28.38 L 110.92,30.38 L 108.77,36.20 L 105.01,44.22 L 102.85,49.78 L 101.85,51.14 L 101.85,51.94 L 100.65,54.60 L 100.45,55.65 L 99.74,56.75 L 99.49,57.76 L 97.44,61.97 L 96.59,64.62 L 94.73,68.63 L 94.08,69.34 L 93.58,71.39 L 91.67,75.60 L 91.07,77.61 L 88.36,83.47 L 87.56,84.73 L 87.51,85.68 L 86.81,87.39 L 82.75,96.26 L 81.34,99.97 L 79.84,102.88 L 78.24,107.19 L 77.46,107.77 L 73.60,108.02 Z";

const howItWorksSteps: { hash: string; title: string; icon: IconType; desc: string }[] = [
  {
    hash: "a3f9c2b",
    title: "Ingest",
    icon: FaDownload,
    desc: "Point Vestige at the target's repository. It reads the full commit history, diffs, PRs, and branch patterns — every decision the team left behind but never wrote down.",
  },
  {
    hash: "b81e04a",
    title: "Trace",
    icon: FaRoute,
    desc: "Every change is traced back to its origin. Vestige surfaces the decision, the risk it carries, and a confidence level for each inference — so nothing in your report is a guess.",
  },
  {
    hash: "c29f17d",
    title: "Explain",
    icon: FaLightbulb,
    desc: "Claude turns the evidence into findings tailored to whoever is reading — from the deal team digging in to the investment committee signing off.",
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 py-24 overflow-hidden">
        <Image
          src="/bgfoot.png"
          alt=""
          fill
          className="object-cover opacity-8 pointer-events-none select-none"
        />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">

          {/* Animated V mark: SVG traces in, then the icon develops over it */}
          <div style={{ position: "relative", width: "156px", height: "131px" }}>
            <svg
              viewBox="0 0 130 109.04"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <path
                className="trace-path"
                d={V_MARK_PATH}
                stroke="#9B6CC8"
                strokeWidth="2.2"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-mark-fill"
              src="/v-mark.png"
              alt="Vestige"
            />
          </div>

          {/* Headline + subhead + CTA + proof card all reveal together */}
          <div className="hero-reveal flex flex-col items-center gap-5 w-full">
            <h1
              className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              We read every commit.
              <br />
              <span style={{ color: "var(--vestige-crystal)" }}>Not the highlight reel.</span>
            </h1>
            <p
              className="text-lg md:text-xl max-w-xl leading-relaxed"
              style={{ color: "#a09a94" }}
            >
              Full git-history due diligence for PE and growth equity — cited
              findings, confidence-scored, and signed off before your deal team
              ever sees them.
            </p>
            <button
              className="mt-2 px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-opacity hover:opacity-80 cursor-pointer"
              style={{
                background: "var(--vestige-purple)",
                color: "var(--vestige-crystal)",
              }}
            >
              Analyze a Target Repo
            </button>

            {/* Proof card */}
            <div
              className="mt-2 rounded-2xl p-5 border text-left w-full max-w-md"
              style={{ borderColor: "rgba(168,153,104,0.3)", background: "#1a1a1a" }}
            >
              <p
                className="text-xs font-mono uppercase tracking-widest mb-3"
                style={{ color: "var(--vestige-stone)" }}
              >
                What a real finding looks like
              </p>
              <p
                className="text-base font-medium leading-snug"
                style={{ color: "var(--foreground)" }}
              >
                Auth disabled in staging. Shipped to production three weeks later.
                Never re-enabled.
              </p>
              <p className="text-xs font-mono mt-3" style={{ color: "#666" }}>
                commit a3f9e21 → 7c41bd0 · High confidence, cited
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-6 py-24"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-3xl md:text-4xl font-semibold uppercase mb-16"
            style={{ color: "var(--vestige-stone)" }}
          >
            How it works
          </p>
          <div className="flex flex-col">
            {howItWorksSteps.map(({ hash, title, icon: Icon, desc }, i) => (
              <div
                key={hash}
                className="flex items-start gap-6"
                style={{
                  paddingTop: "32px",
                  paddingBottom: "32px",
                  borderBottom: i < 2 ? "1px solid var(--vestige-purple)" : "none",
                }}
              >
                <Icon size={40} style={{ color: "var(--vestige-crystal)", flexShrink: 0, marginTop: "4px" }} />
                <div>
                  <h3
                    className="text-2xl font-semibold mb-3"
                    style={{ color: "var(--vestige-crystal)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-base leading-relaxed max-w-lg"
                    style={{ color: "#a09a94" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample output */}
      <section className="px-6 py-24" style={{ background: "#111111" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-semibold text-center mb-16"
            style={{ color: "var(--foreground)" }}
          >
            From a commit with no message
            <br />
            <span style={{ color: "var(--vestige-crystal)" }}>
              to a finding you can defend.
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Input */}
            <div
              className="rounded-2xl p-6 border flex flex-col gap-4"
              style={{
                borderColor: "var(--vestige-stone)",
                background: "#1a1a1a",
              }}
            >
              <span
                className="text-xs uppercase tracking-widest font-mono"
                style={{ color: "var(--vestige-stone)" }}
              >
                3 commits · auth/
              </span>
              <div className="flex flex-col gap-3">
                {[
                  {
                    hash: "a3f9c2b",
                    msg: "add null check",
                    file: "auth/parseToken.ts",
                  },
                  {
                    hash: "b81e04a",
                    msg: "update validation",
                    file: "auth/validateUser.ts",
                  },
                  { hash: "c29f17d", msg: "fix", file: "middleware/auth.ts" },
                ].map(({ hash, msg, file }) => (
                  <div key={hash} className="flex flex-col gap-0.5">
                    <p
                      className="text-sm font-mono font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {msg}
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{ color: "var(--vestige-stone)" }}
                    >
                      {hash} · {file}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Output */}
            <div
              className="rounded-2xl p-6 border flex flex-col gap-4"
              style={{
                borderColor: "var(--vestige-crystal)",
                background: "#1a1a1a",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs uppercase tracking-widest font-mono"
                  style={{ color: "var(--vestige-stone)" }}
                >
                  Vestige Analysis
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  High Confidence
                </span>
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#a09a94" }}
              >
                A null check was added to{" "}
                <code
                  className="text-xs px-1 py-0.5 rounded"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  parseToken()
                </code>
                , a type guard was introduced in{" "}
                <code
                  className="text-xs px-1 py-0.5 rounded"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  validateUser()
                </code>
                , and an error catch was wrapped around the middleware call —
                the pattern of these three changes together is consistent with a
                production incident caused by an unexpected null return.
              </p>
              <p className="text-sm font-mono" style={{ color: "#c0783a" }}>
                ⚠ No commit message, no PR, no issue — three patches in sequence
                that only make sense if something broke in production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative bridge */}
      <section className="px-6 py-28" style={{ background: "var(--background)" }}>
        <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-0">
          <p className="text-2xl md:text-3xl font-semibold leading-snug w-full" style={{ color: "#a09a94", paddingBottom: "40px", borderBottom: "1px solid var(--vestige-purple)" }}>
            <span style={{ color: "var(--vestige-crystal)" }}>Vestige</span> gives you the story of how this codebase became what it is today.
          </p>
          <p className="text-2xl md:text-3xl font-semibold leading-snug w-full" style={{ color: "var(--foreground)", paddingTop: "40px", paddingBottom: "40px", borderBottom: "1px solid var(--vestige-purple)" }}>
            But a story isn&apos;t a risk assessment. Your report needs to say where this code is fragile.
          </p>
          <p className="text-2xl md:text-3xl font-semibold leading-snug w-full" style={{ color: "#a09a94", paddingTop: "40px" }}>
            That&apos;s why we built the <span style={{ color: "var(--vestige-crystal)" }}>Risk Surface.</span>
          </p>
        </div>
      </section>

      {/* Risk Surface */}
      <section className="px-6 py-24" style={{ background: "#141414" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="text-3xl md:text-4xl text-center font-semibold mb-16"
            style={{ color: "var(--foreground)" }}
          >
            Know which files put the whole<br /><span style={{ color: "var(--vestige-crystal)" }}> deal at risk.</span>
          </p>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Input */}
            <div
              className="rounded-2xl p-6 border flex flex-col gap-4"
              style={{
                borderColor: "var(--vestige-stone)",
                background: "#1a1a1a",
              }}
            >
              <span
                className="text-xs uppercase tracking-widest font-mono"
                style={{ color: "var(--vestige-stone)" }}
              >
                billing/charge.ts · core module
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#a09a94" }}
              >
                Where in this codebase is a change most likely to break
                something else — and what does the buyer inherit if it does?
              </p>
              <div
                className="flex flex-col gap-1 mt-2"
                style={{ fontFamily: "monospace", fontSize: "0.78rem" }}
              >
                {[
                  "1,204 commits · 9 authors",
                  "imported by 31 modules",
                  "last 3 authors no longer active",
                  "...",
                ].map((line) => (
                  <span key={line} style={{ color: "#444" }}>
                    {line}
                  </span>
                ))}
              </div>
            </div>

            {/* Output */}
            <div
              className="rounded-2xl p-6 border flex flex-col gap-4"
              style={{
                borderColor: "var(--vestige-crystal)",
                background: "#1a1a1a",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs uppercase tracking-widest font-mono"
                  style={{ color: "var(--vestige-stone)" }}
                >
                  Risk Surface
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  High Risk
                </span>
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#a09a94" }}
              >
                <code
                  className="text-xs px-1 py-0.5 rounded"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  billing/charge.ts
                </code>{" "}
                is the most-changed file in the repo and the most depended-on —
                31 modules import it, yet the three engineers who shaped it have
                all left. Any change here ripples across billing with no one
                left who remembers why it works.
              </p>
              <p
                className="text-sm font-mono"
                style={{ color: "#c0783a" }}
              >
                ⚠ The three engineers who shaped it have all left. Whoever
                touches it next is on their own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two features */}
      <section
        className="px-6 py-24"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl text-red-800 font-bold"
          >This section is under construction</p>
          <p
            className="text-2xl uppercase  mb-12"
            style={{ color: "var(--vestige-stone)" }}
          >
             features.
          </p>
          <div className="flex flex-col gap-6">
            {[
              {
                mode: "Archaeology",
                href: "/history",
                question: "Why is this code like this?",
                desc: "Read the full commit history, PRs, and branch patterns. Claude writes you the story of every decision — documented and inferred — so your report explains the why, not just the what.",
                featured: false,
              },
              {
                mode: "Risk Surface",
                href: "/placement",
                question: "Where is this codebase fragile?",
                desc: "Vestige maps churn, dependencies, and author history to flag the files where change is most dangerous — the technical debt and key-person risk a buyer is actually underwriting.",
                featured: true,
              },
            ].map(({ mode, question, desc, featured }) => (
              <div
                key={mode}
                className="rounded-2xl p-8 border flex flex-col gap-3"
                style={{
                  borderColor: featured
                    ? "var(--vestige-crystal)"
                    : "var(--vestige-stone)",
                  background: "#1a1a1a",
                }}
              >
                <span
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{
                    color: featured
                      ? "var(--vestige-crystal)"
                      : "var(--vestige-stone)",
                  }}
                >
                  {mode}
                </span>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {question}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#a09a94" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p
            className="mt-12 text-base leading-relaxed"
            style={{ color: "#a09a94" }}
          >
            When you&apos;re valuing a codebase you didn&apos;t write, you need both:
            why it got this way, and where it will hurt. Vestige answers both —
            in time to make the deadline.
          </p>
          <p className="text-lg text-red-800">Above under construction</p>
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <h2
            className="text-3xl md:text-4xl font-semibold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            Every codebase has a history.
            <br />
            <span style={{ color: "var(--vestige-crystal)" }}>
              Now you can read it.
            </span>
          </h2>
          <p
            className="text-xl md:text-2xl leading-relaxed italic"
            style={{ color: "#a09a94", borderLeft: "2px solid var(--vestige-purple)", paddingLeft: "1.25rem", textAlign: "left" }}
          >
            &ldquo;We won&apos;t tell you if the deal works out. We&apos;ll make sure
            you&apos;ve seen the whole history before you decide.&rdquo;
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#a09a94" }}>
            Every weird architectural choice, every quiet dependency swap, every
            late-night hotfix — surfaced, scored, and turned into findings your
            deal team can put in the report.
          </p>
          <div className="flex gap-4 mt-2 flex-wrap justify-center">
            <a
              href="/history"
              className="px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-opacity hover:opacity-80"
              style={{
                background: "var(--vestige-purple)",
                color: "var(--vestige-crystal)",
              }}
            >
              Archaeology
            </a>
            <a
              href="/placement"
              className="px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-opacity hover:opacity-80"
              style={{
                border: "1px solid var(--vestige-stone)",
                color: "var(--vestige-stone)",
              }}
            >
              Risk Surface
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
