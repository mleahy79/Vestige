"use client";

import { useState, useEffect } from "react";

const CONFIDENCE_TO_TIER = {
  High:   "Bedrock",
  Medium: "Strata",
  Low:    "Surface",
} as const;

interface LiveFinding {
  title: string;
  detail: string;
  confidence: "High" | "Medium" | "Low";
  riskLevel: "High" | "Medium" | "Low";
  evidence: string;
  inferred: boolean;
  flag?: string;
}

interface LiveContributor {
  name: string;
  commitCount: number;
  lastActive: string;
  dominantFiles: string[];
  riskLevel: "High" | "Medium" | "Low";
  riskReason: string;
}

interface LiveResult {
  repo: { full_name: string; language: string };
  findings: LiveFinding[];
  busFactor?: { summary: string; contributors: LiveContributor[]; criticalDependencies: string[] };
  commits: unknown[];
  prs: unknown[];
  narrative: string;
}

const SAMPLE_REPORT = {
  meta: {
    repo: "acme-co/payments-platform",
    scanDate: "June 29, 2026",
    commitCount: 1847,
    prCount: 203,
    language: "TypeScript",
  },
  summary:
    "The payments-platform repository shows a mature codebase with concentrated ownership risk in its most critical modules. Two findings warrant attention before close: a cluster of unreviewed patches to the authentication layer with no corresponding issue or PR context, and a critical billing module with no active maintainers. A stalled database migration and a test coverage gap are flagged for post-close remediation planning.",
  findings: [
    {
      title: "Three unreviewed patches to the authentication token parser with no PR, issue, or commit context",
      tier: "Bedrock" as const,
      confidence: "High",
      risk: "High",
      detail:
        "Three sequential patches to auth/parseToken.ts were committed directly to main with no PR, no issue link, and commit messages of 'fix', 'add null check', and 'update validation'. The commits were made in rapid succession and bypassed the standard review process entirely. The pattern is consistent with emergency remediation of an unlogged event; the seller should be able to account for the change cluster.",
      evidence: "Commits a3f9c2b · b81e04a · c29f17d · auth/parseToken.ts · auth/validateUser.ts · middleware/auth.ts",
      flag: "If the seller cannot explain this sequence, that absence is itself a finding. Ask before close, not after.",
      signoff: null,
    },
    {
      title: "Billing module at single-owner risk with no active maintainers",
      tier: "Bedrock" as const,
      confidence: "High",
      risk: "High",
      detail:
        "billing/charge.ts has accumulated 1,204 commits across 9 contributors, but three engineers who authored 71% of its commits have all left within the past 18 months. The module is imported by 31 other modules and handles payment processing and retry logic. No documentation of its behavior exists in the repository.",
      evidence:
        "git log --follow billing/charge.ts · 1,204 commits · 9 authors · 31 import references",
      flag: "Any change to this module carries undocumented institutional risk. The next engineer to touch it has no map.",
      signoff: null,
    },
    {
      title: "Database migration stalled for 14 months",
      tier: "Strata" as const,
      confidence: "Medium",
      risk: "Medium",
      detail:
        "migrations/0047_payments_schema.sql was created 14 months ago and never applied. The branch that introduced it was closed without merge. Three subsequent commits reference the schema change as 'pending'. It is unclear whether the migration was abandoned intentionally or deferred indefinitely.",
      evidence:
        "migrations/0047_payments_schema.sql · branch payments/schema-update (closed, unmerged) · 3 references to 'pending schema'",
      flag: null,
      signoff: null,
    },
    {
      title: "No test coverage for payment retry logic",
      tier: "Strata" as const,
      confidence: "Medium",
      risk: "Medium",
      detail:
        "The retry and failure-handling logic in billing/charge.ts spans approximately 847 lines with no dedicated unit test file. The only coverage is a single integration test for the happy path; no tests exercise the failure or retry branches.",
      evidence:
        "Pattern analysis of test/ directory · billing/charge.ts LOC count · test/integration/billing.test.ts (happy path only)",
      flag: null,
      signoff: null,
    },
  ],
  busFactor: {
    summary:
      "Three of the nine contributors who shaped the most critical modules have left in the past 18 months. The authentication and billing systems, both high-dependency and high-risk, are now effectively unmaintained by anyone with direct context.",
    contributors: [
      {
        name: "J. Hartwell",
        commits: 412,
        lastActive: "Nov 2024",
        dominantModule: "billing/charge.ts",
        risk: "High" as const,
      },
      {
        name: "M. Osei",
        commits: 287,
        lastActive: "Feb 2025",
        dominantModule: "auth/",
        risk: "High" as const,
      },
      {
        name: "A. Thornton",
        commits: 164,
        lastActive: "Jan 2025",
        dominantModule: "payments/retry.ts",
        risk: "Medium" as const,
      },
    ],
  },
};

const TIER_STYLE = {
  Bedrock: { borderColor: "#1a0e30", textColor: "#1a0e30", label: "Bedrock: directly evidenced" },
  Strata:  { borderColor: "#4A3070", textColor: "#4A3070", label: "Strata: inferred from pattern" },
  Surface: { borderColor: "#89648F", textColor: "#89648F", label: "Surface: hypothesis worth raising" },
} as const;

const RISK_COLOR = {
  High:   "#c0392b",
  Medium: "#b7770d",
  Low:    "#7f8c8d",
} as const;

export default function ReportsPage() {
  const [liveResult, setLiveResult] = useState<LiveResult | null>(null);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("vestige_archaeology_result") ?? "null");
      if (cached?.result) setLiveResult(cached.result);
    } catch { /* ignore */ }
  }, []);

  const isLive = liveResult !== null;

  // Normalise to a single shape for rendering
  const meta = isLive ? {
    repo:        liveResult.repo.full_name,
    scanDate:    new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    commitCount: liveResult.commits.length,
    prCount:     liveResult.prs.length,
    language:    liveResult.repo.language ?? "",
  } : SAMPLE_REPORT.meta;

  const findings = isLive
    ? liveResult.findings.map(f => ({
        title:   f.title,
        tier:    CONFIDENCE_TO_TIER[f.confidence],
        risk:    f.riskLevel,
        detail:  f.detail,
        evidence: f.evidence,
        flag:    f.flag ?? null,
        signoff: null as string | null,
      }))
    : SAMPLE_REPORT.findings;

  const highCount   = findings.filter(f => f.risk === "High").length;
  const medCount    = findings.filter(f => f.risk === "Medium").length;
  const lowCount    = findings.filter(f => f.risk === "Low").length;

  const summary = isLive
    ? `Scan complete: ${findings.length} finding${findings.length !== 1 ? "s" : ""} across ${meta.commitCount.toLocaleString()} commits and ${meta.prCount} pull requests. ${highCount} high-risk, ${medCount} medium-risk, ${lowCount} low-risk.`
    : SAMPLE_REPORT.summary;

  const busFactor = isLive && liveResult.busFactor ? {
    summary:      liveResult.busFactor.summary,
    contributors: liveResult.busFactor.contributors.map(c => ({
      name:          c.name,
      commits:       c.commitCount,
      lastActive:    c.lastActive,
      dominantModule: c.dominantFiles?.[0] ?? "various",
      risk:          c.riskLevel,
    })),
  } : SAMPLE_REPORT.busFactor;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          nav { display: none !important; }
          body { background: white !important; }
        }
        @page { margin: 1.25in 1in; }
      `}</style>

      {/* Action bar */}
      <div
        className="no-print"
        style={{
          background: "#f5f3f0",
          borderBottom: "1px solid #e0ddd9",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <p style={{ fontSize: "0.82rem", color: "#888", margin: 0 }}>
          {isLive
            ? `Report for ${meta.repo}. Print or save as PDF, then redact any identifying details before sharing.`
            : "Sample report: this is what a Vestige scan delivers. Print or save as PDF to share with your deal team."}
        </p>
        <button
          onClick={() => window.print()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "999px",
            background: "#89648F",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Report */}
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "48px 40px 64px",
          background: "white",
          minHeight: "100vh",
          color: "#1a0e30",
        }}
      >
        {/* Report header */}
        <div
          style={{
            borderBottom: "2px solid #1a0e30",
            paddingBottom: "24px",
            marginBottom: "36px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#89648F",
                margin: "0 0 8px",
              }}
            >
              Vestige Technical Due Diligence
            </p>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1a0e30",
                margin: "0 0 6px",
                lineHeight: 1.2,
              }}
            >
              {meta.repo}
            </h1>
            <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#888", margin: 0 }}>
              {meta.scanDate} &nbsp;·&nbsp;{" "}
              {meta.commitCount.toLocaleString()} commits &nbsp;·&nbsp;{" "}
              {meta.prCount} PRs
              {meta.language && <> &nbsp;·&nbsp; {meta.language}</>}
            </p>
          </div>
          {!isLive && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "4px 12px",
                border: "1px solid #ccc",
                borderRadius: "999px",
                color: "#aaa",
                flexShrink: 0,
              }}
            >
              Sample
            </span>
          )}
        </div>

        {/* Summary */}
        <section style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#89648F",
              margin: "0 0 10px",
            }}
          >
            Summary
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#333", margin: 0 }}>
            {summary}
          </p>
        </section>

        {/* Findings */}
        <section style={{ marginBottom: "44px" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#89648F",
              margin: "0 0 18px",
            }}
          >
            Findings ({findings.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {findings.map((f, i) => {
              const tierKey = f.tier as keyof typeof TIER_STYLE;
              const tier = TIER_STYLE[tierKey] ?? TIER_STYLE.Surface;
              const riskKey = f.risk as keyof typeof RISK_COLOR;
              return (
                <div
                  key={i}
                  style={{
                    borderLeft: `4px solid ${tier.borderColor}`,
                    paddingLeft: "20px",
                    paddingBottom: "28px",
                    marginBottom: "28px",
                    borderBottom: "1px solid #ede9e4",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "16px",
                      marginBottom: "10px",
                    }}
                  >
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1a0e30", margin: 0, lineHeight: 1.35 }}>
                      {f.title}
                    </h3>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 9px", borderRadius: "999px", border: `1px solid ${tier.borderColor}`, color: tier.textColor }}>
                        {f.tier}
                      </span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 9px", borderRadius: "999px", border: `1px solid ${RISK_COLOR[riskKey]}`, color: RISK_COLOR[riskKey] }}>
                        {f.risk} risk
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#444", margin: "0 0 10px" }}>
                    {f.detail}
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#888", margin: "0 0 8px", lineHeight: 1.5 }}>
                    Evidence: {f.evidence}
                  </p>
                  {f.flag && (
                    <p style={{ fontSize: "0.82rem", color: "#c0392b", margin: "0 0 10px", lineHeight: 1.55 }}>
                      △ {f.flag}
                    </p>
                  )}
                  <p style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.08em", color: f.signoff ? "#27ae60" : "#bbb", margin: 0 }}>
                    {f.signoff ? `✓ Validated · ${f.signoff}` : "Pending reviewer sign-off"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Key person risk */}
        {busFactor && (
          <section style={{ marginBottom: "44px" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#89648F", margin: "0 0 10px" }}>
              Key Person Risk
            </p>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#444", margin: "0 0 18px" }}>
              {busFactor.summary}
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e0ddd9" }}>
                  {["Contributor", "Commits", "Last active", "Primary module", "Risk"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 10px", fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {busFactor.contributors.map(c => (
                  <tr key={c.name} style={{ borderBottom: "1px solid #f0ede9" }}>
                    <td style={{ padding: "9px 10px", color: "#1a0e30", fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: "9px 10px", fontFamily: "monospace", color: "#555" }}>{c.commits}</td>
                    <td style={{ padding: "9px 10px", fontFamily: "monospace", color: "#555" }}>{c.lastActive}</td>
                    <td style={{ padding: "9px 10px", fontFamily: "monospace", color: "#555" }}>{c.dominantModule}</td>
                    <td style={{ padding: "9px 10px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: RISK_COLOR[c.risk as keyof typeof RISK_COLOR], fontWeight: 600 }}>
                        {c.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Confidence tier legend */}
        <section style={{ background: "#faf9f7", border: "1px solid #ede9e4", borderRadius: "6px", padding: "20px 24px", marginBottom: "44px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#89648F", margin: "0 0 14px" }}>
            Confidence Tiers
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {(["Bedrock", "Strata", "Surface"] as const).map(tier => (
              <div key={tier} style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.72rem", fontWeight: 700, color: TIER_STYLE[tier].textColor, flexShrink: 0, width: "68px" }}>
                  {tier}
                </span>
                <span style={{ fontSize: "0.82rem", color: "#555", lineHeight: 1.55 }}>
                  {tier === "Bedrock" && "Directly evidenced in the commit record. The citation is the proof."}
                  {tier === "Strata"  && "Inferred from a consistent pattern across multiple commits. Stronger than a hunch, weaker than a record."}
                  {tier === "Surface" && "A hypothesis worth raising. Included so you can ask the question, not so you can cite it."}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Sign-off block */}
        <section>
          <p style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#89648F", margin: "0 0 10px" }}>
            Sign-off
          </p>
          <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.65, margin: "0 0 24px" }}>
            Each finding in this report requires a named reviewer to independently verify or correct it
            before the report is considered final. Sign-offs are timestamped and attributed. The report
            reflects the reviewer&apos;s findings, not Vestige&apos;s.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 40px" }}>
            {["Reviewer name", "Date", "Title / Firm", "Signature"].map(label => (
              <div key={label}>
                <div style={{ borderBottom: "1px solid #bbb", minHeight: "36px", marginBottom: "6px" }} />
                <p style={{ fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", margin: 0 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div style={{ marginTop: "56px", paddingTop: "16px", borderTop: "1px solid #e0ddd9", display: "flex", justifyContent: "space-between", fontSize: "0.65rem", fontFamily: "monospace", color: "#ccc", letterSpacing: "0.1em" }}>
          <span>VESTIGE · TECHNICAL DUE DILIGENCE</span>
          <span>{meta.scanDate}{!isLive && " · SAMPLE REPORT"}</span>
        </div>
      </div>
    </>
  );
}
