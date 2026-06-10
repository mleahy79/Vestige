import React from "react";
import Image from "next/image";
import { FaDownload, FaRoute, FaLightbulb } from "react-icons/fa";
import type { IconType } from "react-icons";

const howItWorksSteps: { hash: string; title: string; icon: IconType; desc: string }[] = [
  {
    hash: "a3f9c2b",
    title: "Ingest",
    icon: FaDownload,
    desc: "Point Vestige at any Git repo. It reads your full commit history, diffs, PRs, and branch patterns — everything your team left behind.",
  },
  {
    hash: "b81e04a",
    title: "Trace",
    icon: FaRoute,
    desc: "Every change is traced back to its origin. Vestige surfaces the decision, the context, and the confidence level of each inference.",
  },
  {
    hash: "c29f17d",
    title: "Explain",
    icon: FaLightbulb,
    desc: "Claude turns the evidence into a narrative tailored to whoever is reading so the why reaches everyone who needs it.",
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
        <Image
          src="/bgfoot.png"
          alt=""
          fill
          className="object-cover opacity-8 pointer-events-none select-none"
        />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center top-0 gap-6">
          <Image
            src="/transparent-logo - Edited.png"
            alt="Vestige"
            width={300}
            height={300}
            className="mb-2 hero-logo"
          />
          <h1
            className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight hero-copy"
            style={{ color: "var(--foreground)", animationDelay: "2400ms" }}
          >
            Why does this
            <br />
            <span style={{ color: "var(--vestige-crystal)" }}>code exist?</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-xl leading-relaxed hero-copy"
            style={{ color: "#a09a94", animationDelay: "2150ms" }}
          >
            Every codebase carries decisions nobody documented. Vestige reads
            your Git history to surface the why behind every change.
          </p>
          <button
            className="mt-4 px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-opacity hover:opacity-80 cursor-pointer hero-copy"
            style={{
              background: "var(--vestige-purple)",
              color: "var(--vestige-crystal)",
              animationDelay: "1900ms",
            }}
          >
            Analyze a Repo
          </button>
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
              to a reason.
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
                runtime crash on an unexpected null return.
              </p>
              <p className="text-sm font-mono" style={{ color: "#c0783a" }}>
                ⚠ No incident report found. Decision inferred from history.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-28" style={{ background: "var(--background)" }}>
        <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-0">
          <p className="text-2xl md:text-3xl font-semibold leading-snug w-full" style={{ color: "#a09a94", paddingBottom: "40px", borderBottom: "1px solid var(--vestige-purple)" }}>
            <span style={{ color: "var(--vestige-crystal)" }}>Vestige</span> gives you the story of how your codebase evolved to what it is today.
          </p>
          <p className="text-2xl md:text-3xl font-semibold leading-snug w-full" style={{ color: "var(--foreground)", paddingTop: "40px", paddingBottom: "40px", borderBottom: "1px solid var(--vestige-purple)" }}>
            But history can&apos;t tell you the safest place to put your next change.
          </p>
          <p className="text-2xl md:text-3xl font-semibold leading-snug w-full" style={{ color: "#a09a94", paddingTop: "40px" }}>
            That&apos;s why we built <span style={{ color: "var(--vestige-crystal)" }}>Placement.</span>
          </p>
        </div>
      </section>

      {/* Placement Mode */}
      <section className="px-6 py-24" style={{ background: "#141414" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="text-3xl md:text-4xl text-center font-semibold mb-16"
            style={{ color: "$f5f1ed" }}
          >
            Feel confident where you put your code wont<br /><span style={{ color: "var(--vestige-crystal)" }}> break anything.</span> 
          </p>

          {/* Placement example */}
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
                styles.css · 14,000 lines
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#a09a94" }}
              >
                I want to add a hover state for{" "}
                <code
                  className="text-xs px-1 py-0.5 rounded"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  .card-title
                </code>{" "}
                that changes the color to the brand purple.
              </p>
              <div
                className="flex flex-col gap-1 mt-2"
                style={{ fontFamily: "monospace", fontSize: "0.78rem" }}
              >
                {[
                  "827  .card-title { ... }",
                  "828  .card-body { ... }",
                  "829  /* utility classes */",
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
                  Placement
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  Line 828
                </span>
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#a09a94" }}
              >
                Add after line 827, directly below{" "}
                <code
                  className="text-xs px-1 py-0.5 rounded"
                  style={{
                    background: "#2a2a2a",
                    color: "var(--vestige-crystal)",
                  }}
                >
                  .card-title
                </code>{" "}
                — this is where component-level states live in this file. Adding
                here keeps it out of the global reset block above and the
                utility classes below.
              </p>
              <p
                className="text-sm font-mono"
                style={{ color: "var(--vestige-stone)" }}
              >
                → Safe. Follows the file&apos;s own pattern.
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
                question: "Why is this like this?",
                desc: "Read the full commit history, PRs, and branch patterns. Claude writes you the story of every decision — documented and inferred.",
                featured: false,
              },
              {
                mode: "Placement",
                href: "/placement",
                question: "Where does my change belong?",
                desc: "Point Vestige at a file and describe what you're adding. It reads the structure and tells you the exact line — and why that placement is safe.",
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
             you&apos;rehat matte
            working in a codebase you didn&apos;t write. Vestige answers both,
            in order, and gets out of your way.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
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
          <p className="text-base leading-relaxed" style={{ color: "#a09a94" }}>
            Every weird architectural choice, every quiet dependency swap, every
            late-night hotfix and now, every change you make — placed with
            confidence.
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
              Placement
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
