import React from 'react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
        <Image
          src="/bgfoot.png"
          alt=""
          fill
          className="object-cover opacity-8 pointer-events-none select-none"
        />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center top-0 gap-6">
          <Image src="/transparent-logo - Edited.png" alt="Vestige" width={300} height={300} className="mb-2 hero-logo" />
          <h1 className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight hero-copy" style={{ color: 'var(--foreground)', animationDelay: '2400ms' }}>
            Why does this<br />
            <span style={{ color: 'var(--vestige-crystal)' }}>code exist?</span>
          </h1>
          <p className="text-lg md:text-xl max-w-xl leading-relaxed hero-copy" style={{ color: '#a09a94', animationDelay: '2150ms' }}>
            Every codebase carries decisions nobody documented. Vestige reads your Git history
            to surface the why behind every change.
          </p>
          <button
            className="mt-4 px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-opacity hover:opacity-80 cursor-pointer hero-copy"
            style={{ background: 'var(--vestige-purple)', color: 'var(--vestige-crystal)', animationDelay: '1900ms' }}
          >
            Analyze a Repo
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="flex justify-center mb-4">
          <span
            className="text-xs uppercase tracking-[0.25em] font-mono px-3 py-1 rounded-full border"
            style={{ color: 'var(--vestige-stone)', borderColor: 'var(--vestige-stone)' }}
          >
            Decision Archaeology
          </span>
        </div>
        <p className="text-center text-2xl font-bold uppercase tracking-[0.3em] font-mono mb-12" style={{ color: 'var(--vestige-stone)' }}>
          How it works
        </p>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {[
            {
              step: '01',
              title: 'Ingest',
              desc: 'Point Vestige at any Git repo. It reads your full commit history, diffs, PRs, and branch patterns — everything your team left behind.',
            },
            {
              step: '02',
              title: 'Trace',
              desc: 'Every change is traced back to its origin. Vestige surfaces the decision, the context, and how confident the evidence is.',
            },
            {
              step: '03',
              title: 'Explain',
              desc: 'Claude produces reports tailored to whoever is reading — so the why reaches everyone who needs it.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center gap-4">
              <span className="font-mono text-4xl font-bold" style={{ color: 'var(--vestige-crystal)' }}>
                {step}
              </span>
              <h3 className="text-2xl font-semibold" style={{ color: 'var(--vestige-crystal)' }}>
                {title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#a09a94' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample output */}
      <section className="px-6 py-24" style={{ background: '#111111' }}>
        <div className="max-w-5xl mx-auto">
         
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16" style={{ color: 'var(--foreground)' }}>
            From a commit with no message<br />
            <span style={{ color: 'var(--vestige-crystal)' }}>to a reason.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Input */}
            <div className="rounded-2xl p-6 border flex flex-col gap-4" style={{ borderColor: 'var(--vestige-stone)', background: '#1a1a1a' }}>
              <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--vestige-stone)' }}>3 commits · auth/</span>
              <div className="flex flex-col gap-3">
                {[
                  { hash: 'a3f9c2b', msg: 'add null check', file: 'auth/parseToken.ts' },
                  { hash: 'b81e04a', msg: 'update validation', file: 'auth/validateUser.ts' },
                  { hash: 'c29f17d', msg: 'fix', file: 'middleware/auth.ts' },
                ].map(({ hash, msg, file }) => (
                  <div key={hash} className="flex flex-col gap-0.5">
                    <p className="text-sm font-mono font-semibold" style={{ color: '#e4f8de' }}>{msg}</p>
                    <p className="text-xs font-mono" style={{ color: '#7aaa8a' }}>{hash} · {file}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="rounded-2xl p-6 border flex flex-col gap-4" style={{ borderColor: 'var(--vestige-crystal)', background: '#1a1a1a' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--vestige-stone)' }}>Vestige Analysis</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: '#2a2a2a', color: 'var(--vestige-crystal)' }}>High Confidence</span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: '#a09a94' }}>
                A null check was added to <code className="text-xs px-1 py-0.5 rounded" style={{ background: '#2a2a2a', color: 'var(--vestige-crystal)' }}>parseToken()</code>, a type guard was introduced in <code className="text-xs px-1 py-0.5 rounded" style={{ background: '#2a2a2a', color: 'var(--vestige-crystal)' }}>validateUser()</code>, and an error catch was wrapped around the middleware call — the pattern of these three changes together is consistent with a runtime crash on an unexpected null return.
              </p>
              <p className="text-sm font-mono" style={{ color: '#c0783a' }}>⚠ No incident report found. Decision inferred from history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Report tiers */}
      <section className="px-6 py-24" style={{ background: '#141414' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-2xl font-bold pb-2 uppercase tracking-[0.3em] font-mono mb-6" style={{ color: 'var(--vestige-stone)' }}>
            Tiered output
          </p>
          <h2 className="text-4xl md:text-4xl font-bold text-center mb-16" style={{ color: 'var(--foreground)' }}>
            The same why. Tailored for every reader.
          </h2>
          <div className="flex flex-col gap-6">
            {[
              {
                label: 'Junior Dev',
                desc: 'Why this exists and what it means for you — plain language that builds real understanding of the decisions that shaped the code.',
              },
              {
                label: 'Mid Dev',
                desc: 'The full decision trail — what changed, why it changed, and what patterns in the history are worth watching.',
              },
              {
                label: 'Plain English',
                desc: 'What this codebase does and the thinking behind it — for anyone who needs to understand without reading the code.',
              },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="rounded-2xl p-8 border flex flex-col gap-3"
                style={{ borderColor: 'var(--vestige-stone)', background: '#1a1a1a' }}
              >
                <span className="text-lg font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--vestige-stone)' }}>
                  {label}
                </span>
                <p className="text-base leading-relaxed" style={{ color: '#a09a94' }}>
                  {desc}
                </p>
              </div>
            ))}

            {/* Senior Dev — featured */}
            <div
              className="rounded-2xl p-8 border flex flex-col gap-3"
              style={{ borderColor: 'var(--vestige-crystal)', background: '#1a1a1a' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--vestige-crystal)' }}>
                  Senior Dev
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: 'var(--vestige-purple)', color: 'var(--vestige-crystal)' }}>
                  Most detailed
                </span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: '#a09a94' }}>
                What is documented vs. inferred, with confidence scores and flags for decisions that deserve a closer look. The only report that tells you what the history couldn&apos;t prove.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight" style={{ color: 'var(--foreground)' }}>
            Your history,<br />
            <span style={{ color: 'var(--vestige-crystal)' }}>finally legible.</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#a09a94' }}>
            Every weird architectural choice, every quiet dependency swap, every late-night hotfix — Vestige reads your Git history and tells you why.
          </p>
          <button
            className="mt-2 px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-opacity hover:opacity-80 cursor-pointer"
            style={{ background: 'var(--vestige-purple)', color: 'var(--vestige-crystal)' }}
          >
            Analyze a Repo
          </button>
        </div>
      </section>

    </div>
  )
}
