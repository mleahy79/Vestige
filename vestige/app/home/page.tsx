import React from "react";
import Image from "next/image";

const V_MARK_PATH =
  "M 73.60,108.02 L 67.78,107.82 L 60.81,106.51 L 56.05,105.01 L 48.78,101.65 L 43.02,97.89 L 38.10,93.68 L 34.07,89.14 L 30.81,84.53 L 28.50,80.37 L 26.60,75.90 L 24.84,70.54 L 23.59,64.52 L 23.29,59.56 L 23.59,51.49 L 24.59,46.68 L 25.29,44.82 L 24.99,43.32 L 24.34,42.51 L 20.93,34.94 L 18.32,28.58 L 16.92,25.87 L 16.77,24.77 L 14.76,20.71 L 13.86,18.15 L 9.65,8.77 L 7.45,5.06 L 5.77,3.43 L 4.04,2.21 L 3.89,1.75 L 4.21,1.13 L 15.64,0.93 L 32.74,1.08 L 35.55,1.58 L 38.85,2.73 L 41.71,4.69 L 43.04,6.32 L 44.54,8.92 L 46.55,13.79 L 46.60,14.54 L 47.85,16.54 L 56.78,37.60 L 58.53,40.86 L 59.08,42.61 L 59.84,43.77 L 60.54,46.32 L 63.95,53.74 L 64.75,56.20 L 65.48,56.73 L 66.25,56.15 L 67.76,52.09 L 72.87,40.16 L 73.32,38.60 L 79.09,25.72 L 82.70,16.85 L 84.95,12.13 L 85.81,9.63 L 87.01,7.57 L 89.49,4.64 L 90.54,4.09 L 90.99,3.58 L 94.55,1.93 L 98.82,1.08 L 105.94,0.98 L 107.34,1.23 L 107.99,1.03 L 124.33,1.03 L 125.34,1.13 L 125.71,1.40 L 125.71,2.31 L 123.93,3.63 L 121.85,6.07 L 119.30,10.88 L 118.34,13.74 L 116.09,18.35 L 113.33,24.97 L 112.18,26.92 L 111.98,28.38 L 110.92,30.38 L 108.77,36.20 L 105.01,44.22 L 102.85,49.78 L 101.85,51.14 L 101.85,51.94 L 100.65,54.60 L 100.45,55.65 L 99.74,56.75 L 99.49,57.76 L 97.44,61.97 L 96.59,64.62 L 94.73,68.63 L 94.08,69.34 L 93.58,71.39 L 91.67,75.60 L 91.07,77.61 L 88.36,83.47 L 87.56,84.73 L 87.51,85.68 L 86.81,87.39 L 82.75,96.26 L 81.34,99.97 L 79.84,102.88 L 78.24,107.19 L 77.46,107.77 L 73.60,108.02 Z";


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

      {/* Positioning — replaces How It Works */}
      <section className="px-6 py-24" style={{ background: "#1a1428" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Left: headline copy */}
          <div className="flex flex-col gap-6">
            <p
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: "var(--vestige-crystal)" }}
            >
              Technical Due Diligence — PE &amp; Growth Equity
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: "var(--foreground)" }}
            >
              The data room shows you what the seller chose to show you. The commit history doesn&apos;t have a curator.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#a09a94" }}>
              Vestige reads a target&apos;s full git history and surfaces what actually happened — the shortcuts, the deferred fixes, the migrations that quietly stalled — with cited evidence and a named human sign-off before any of it reaches your deal team.
            </p>
            <div className="flex items-center gap-5 mt-2 flex-wrap">
              <button
                className="px-6 py-3 font-semibold transition-opacity hover:opacity-80 cursor-pointer"
                style={{
                  background: "rgba(232,212,248,0.12)",
                  color: "var(--foreground)",
                  border: "1px solid rgba(232,212,248,0.25)",
                  borderRadius: "4px",
                }}
              >
                Request a sample report
              </button>
              <a
                href="#scoring"
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: "var(--vestige-crystal)" }}
              >
                See how the scoring works ↓
              </a>
            </div>
          </div>

          {/* Right: confidence tiers */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-1"
              style={{ color: "#555" }}
            >
              What the data room shows you
            </p>
            <div className="flex flex-col rounded-xl overflow-hidden">
              {[
                {
                  tier: "Surface",
                  desc: "A hypothesis worth raising",
                  confidence: "Low confidence",
                  bg: "#6B4E8F",
                },
                {
                  tier: "Strata",
                  desc: "Inferred from a pattern",
                  confidence: "Medium confidence",
                  bg: "#4A3070",
                },
                {
                  tier: "Bedrock",
                  desc: "Directly evidenced in the commit record",
                  confidence: "High confidence",
                  bg: "#2D1B4E",
                },
              ].map(({ tier, desc, confidence, bg }) => (
                <div
                  key={tier}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ background: bg }}
                >
                  <div>
                    <p className="font-semibold text-base" style={{ color: "#fff" }}>{tier}</p>
                    <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{desc}</p>
                  </div>
                  <span
                    className="text-xs font-mono px-3 py-1 rounded ml-4 shrink-0"
                    style={{
                      background: "rgba(0,0,0,0.35)",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {confidence}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-1" style={{ color: "#555" }}>
              What Vestige shows you: everything underneath, scored by how deep the evidence goes.
            </p>
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


      {/* Guarantee */}
      <section className="px-6 py-28 text-center" style={{ background: "#f5f3f0" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <p
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "#8e6cc9" }}
          >
            What we guarantee, and what we don&apos;t
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight italic"
            style={{ color: "#1e1030", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            &ldquo;We won&apos;t tell you if the deal works out. We&apos;ll make sure
            you&apos;ve seen the whole history before you decide.&rdquo;
          </h2>
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: "#888" }}
          >
            No tool can responsibly predict whether an acquisition will perform, and
            we&apos;re not going to claim Vestige is the exception. What we guarantee
            is complete coverage of the commit history — every commit reviewed and
            categorized, not a sample, not a highlight reel selected by the
            seller&apos;s engineering team. The picture is yours to interpret. We just
            make sure it&apos;s the whole one.
          </p>
        </div>
      </section>
      
      {/* Sample output + Risk Surface — combined */}
      <section className="px-6 py-24" style={{ background: "#111111" }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-semibold text-center mb-16"
            style={{ color: "var(--foreground)" }}
          >
            Two questions. One scan.
            <br />
            <span style={{ color: "var(--vestige-crystal)" }}>
              Both answered before your deadline.
            </span>
          </h2>

          {/* Row-based grid so cards in the same row share height */}
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">

            {/* Row 1: labels */}
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--vestige-stone)" }}>
              Archaeology — why is this code like this?
            </p>
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--vestige-stone)" }}>
              Risk Surface — where is this codebase fragile?
            </p>

            {/* Row 2: input cards */}
            <div className="rounded-2xl p-6 border flex flex-col gap-3" style={{ borderColor: "#333", background: "#1a1a1a" }}>
              <span className="text-xs uppercase tracking-widest font-mono" style={{ color: "var(--vestige-stone)" }}>
                3 commits · auth/
              </span>
              <div className="flex flex-col gap-3">
                {[
                  { hash: "a3f9c2b", msg: "add null check",   file: "auth/parseToken.ts" },
                  { hash: "b81e04a", msg: "update validation", file: "auth/validateUser.ts" },
                  { hash: "c29f17d", msg: "fix",               file: "middleware/auth.ts" },
                ].map(({ hash, msg, file }) => (
                  <div key={hash} className="flex flex-col gap-0.5">
                    <p className="text-sm font-mono font-semibold" style={{ color: "var(--foreground)" }}>{msg}</p>
                    <p className="text-xs font-mono" style={{ color: "var(--vestige-stone)" }}>{hash} · {file}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 border flex flex-col gap-3" style={{ borderColor: "#333", background: "#1a1a1a" }}>
              <span className="text-xs uppercase tracking-widest font-mono" style={{ color: "var(--vestige-stone)" }}>
                billing/charge.ts · core module
              </span>
              <div className="flex flex-col gap-1" style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                {[
                  "1,204 commits · 9 authors",
                  "imported by 31 modules",
                  "last 3 authors no longer active",
                  "...",
                ].map((line) => (
                  <span key={line} style={{ color: "#444" }}>{line}</span>
                ))}
              </div>
            </div>

            {/* Row 3: arrows */}
            <div className="text-center text-lg" style={{ color: "#333" }}>↓</div>
            <div className="text-center text-lg" style={{ color: "#333" }}>↓</div>

            {/* Row 4: output cards */}
            <div className="rounded-2xl p-6 border flex flex-col gap-4" style={{ borderColor: "var(--vestige-crystal)", background: "#1a1a1a" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-mono" style={{ color: "var(--vestige-stone)" }}>Vestige Analysis</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "#2a2a2a", color: "var(--vestige-crystal)" }}>High Confidence</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#a09a94" }}>
                A null check, a type guard, and an error catch — three patches in
                sequence with no commit messages, no PR, no issue. The pattern is
                consistent with a production incident caused by an unexpected null
                return in <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#2a2a2a", color: "var(--vestige-crystal)" }}>parseToken()</code>.
              </p>
              <p className="text-xs font-mono" style={{ color: "#c0783a" }}>
                ⚠ Three patches that only make sense if something broke in production.
              </p>
            </div>

            <div className="rounded-2xl p-6 border flex flex-col gap-4" style={{ borderColor: "var(--vestige-crystal)", background: "#1a1a1a" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-mono" style={{ color: "var(--vestige-stone)" }}>Risk Surface</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "#2a2a2a", color: "var(--vestige-crystal)" }}>High Risk</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#a09a94" }}>
                <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#2a2a2a", color: "var(--vestige-crystal)" }}>billing/charge.ts</code>{" "}
                is the most-changed file in the repo and the most depended-on —
                31 modules import it, yet the three engineers who shaped it have
                all left. Any change here ripples across billing with no one left
                who remembers why it works.
              </p>
              <p className="text-xs font-mono" style={{ color: "#c0783a" }}>
                ⚠ The three engineers who shaped it have all left. Whoever touches it next is on their own.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Sample report CTA */}
      <section className="px-6 py-28 text-center" style={{ background: "#1a1428" }}>
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <p
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "#8e6cc9" }}
          >
            Get a sample report
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: "var(--foreground)", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Run it against a deal you&apos;re already diligencing.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#a09a94" }}>
            Send read access to a target&apos;s repository, or run it yourselves if
            your firm prefers to keep access in-house. We&apos;ll turn around a sample
            report with the same confidence tiers, citations, and sign-off layer your
            deal team would see in production. No slide deck — just the report.
          </p>
          <div className="flex gap-4 mt-2 flex-wrap justify-center">
            <button
              className="px-6 py-3 font-semibold rounded transition-opacity hover:opacity-80 cursor-pointer"
              style={{ background: "#6B4E8F", color: "#fff" }}
            >
              Request a sample report
            </button>
            <button
              className="px-6 py-3 font-semibold rounded transition-opacity hover:opacity-80 cursor-pointer"
              style={{
                background: "transparent",
                color: "var(--foreground)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              Book a 20-minute walkthrough
            </button>
          </div>
        </div>
      </section>

      
    </div>
  );
}
