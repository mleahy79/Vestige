"use client";

import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const STORAGE_KEY = "vestige_archaeology_result";

interface RepoInfo {
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  created_at: string;
  pushed_at: string;
  html_url: string;
}

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface PR {
  number: number;
  title: string;
  body: string;
  user: string;
  merged_at: string | null;
  closed_at: string;
  url: string;
}

interface Finding {
  title: string;
  detail: string;
  confidence: "High" | "Medium" | "Low";
  evidence: string;
  inferred: boolean;
  flag?: string;
}

interface AnalysisResult {
  narrative: string;
  findings: Finding[];
  repo: RepoInfo;
  commits: Commit[];
  prs: PR[];
}

type Tier = "all" | "hi" | "md" | "lo";

const BADGE = {
  High:   { color: "var(--arch-mist)",     border: "rgba(127,174,154,0.55)",  bg: "rgba(127,174,154,0.09)" },
  Medium: { color: "var(--arch-lavender)",  border: "rgba(217,199,242,0.4)",   bg: "rgba(217,199,242,0.07)" },
  Low:    { color: "var(--arch-amber)",     border: "rgba(207,138,74,0.55)",   bg: "rgba(207,138,74,0.09)" },
} as const;

const TIER_MAP: Record<string, Tier> = { High: "hi", Medium: "md", Low: "lo" };

function FindingCard({ f }: { f: Finding }) {
  const badge = BADGE[f.confidence];

  return (
    <article style={{
      border: "1px solid var(--arch-seam)",
      borderRadius: "11px",
      background: "var(--arch-obsidian)",
      marginBottom: "1.15rem",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "minmax(230px, 300px) 1fr",
    }}>
      {/* Evidence column */}
      <div style={{
        borderRight: "1px solid var(--arch-seam)",
        padding: "1.15rem 1.2rem",
        background: "linear-gradient(180deg, rgba(181,162,104,0.04) 0%, transparent 45%)",
      }}>
        <span style={{
          display: "block",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--arch-fossil)",
          marginBottom: "0.85rem",
        }}>
          Evidence
        </span>
        <b style={{
          display: "block",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          fontWeight: 500,
          color: "var(--arch-parchment)",
          marginBottom: "0.35rem",
        }}>
          {f.title}
        </b>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--arch-fossil)",
          opacity: 0.85,
        }}>
          {f.evidence}
        </span>
      </div>

      {/* Analysis column */}
      <div style={{ padding: "1.15rem 1.4rem 1.25rem" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.8rem",
          marginBottom: "0.7rem",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--arch-amethyst)",
          }}>
            Vestige analysis
          </span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            borderRadius: "999px",
            padding: "0.28rem 0.75rem",
            border: `1px solid ${badge.border}`,
            color: badge.color,
            background: badge.bg,
          }}>
            {f.confidence} confidence
          </span>
        </div>

        <p style={{
          color: "var(--arch-stone)",
          fontSize: "0.95rem",
          lineHeight: 1.65,
          maxWidth: "60ch",
        }}>
          {f.detail}
        </p>

        {f.flag && (
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.74rem",
            color: "var(--arch-amber)",
            marginTop: "0.85rem",
            lineHeight: 1.7,
          }}>
            △ {f.flag}
          </p>
        )}

        <div style={{ marginTop: "1.05rem", display: "flex", gap: "1.3rem" }}>
          {(["View full evidence", "Copy as PR comment"] as const).map((label) => (
            <button
              key={label}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--arch-lavender)",
                background: "none",
                border: "none",
                borderBottom: "1px solid transparent",
                paddingBottom: "1px",
                cursor: "pointer",
                transition: "border-color 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = "var(--arch-lavender)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function HistoryPage() {
  const [repoUrl, setRepoUrl] = useState<string>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")?.repoUrl ?? ""; } catch { return ""; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")?.result ?? null; } catch { return null; }
  });
  const [activeTier, setActiveTier] = useState<Tier>("all");
  const [showCommits, setShowCommits] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Analysis failed"); return; }
      setResult(data);
      setActiveTier("all");
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ result: data, repoUrl: repoUrl.trim() })); } catch { /* ignore */ }
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setRepoUrl("");
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--arch-void)", color: "var(--arch-parchment)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
            <DotLottieReact src="/loading.lottie" loop autoplay style={{ width: 220, height: 220, margin: "0 auto" }} />
          <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--arch-lavender)", marginBottom: "12px" }}>
            Reading the history
          </h2>
          <p style={{ color: "var(--arch-stone)", fontSize: "0.9rem" }}>
            Fetching commits and PRs, then tracing the decisions…
          </p>
        </div>
      </main>
    );
  }

  /* ── Input form ── */
  if (!result) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--arch-void)", color: "var(--arch-parchment)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--arch-fossil)",
              marginBottom: "2rem",
            }}>
              Decision Archaeology
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--arch-parchment)", marginBottom: "12px", lineHeight: 1.2 }}>
              Why does this<br />
              <span style={{ color: "var(--arch-lavender)" }}>code exist?</span>
            </h1>
            <p style={{ color: "var(--arch-stone)", fontSize: "1.05rem", lineHeight: 1.7 }}>
              Paste a GitHub repository URL. Vestige reads the full commit history,<br />
              PRs, and branch patterns — then writes you the story behind the code.
            </p>
          </div>

          {error && (
            <div style={{
              background: "rgba(180,60,60,0.1)", border: "1px solid rgba(180,60,60,0.35)",
              borderRadius: "10px", padding: "14px 18px", marginBottom: "24px",
              color: "#f08080", fontSize: "0.88rem", fontFamily: "var(--font-mono)",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1, padding: "13px 18px", borderRadius: "9px",
                  background: "var(--arch-obsidian)", border: "1px solid var(--arch-seam)",
                  color: "var(--arch-parchment)", fontSize: "0.9rem",
                  outline: "none", fontFamily: "var(--font-mono)",
                }}
              />
              <button
                type="submit"
                disabled={!repoUrl.trim()}
                style={{
                  padding: "13px 26px", borderRadius: "9px",
                  background: "var(--arch-amethyst)", color: "var(--arch-lavender)",
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  fontWeight: 500, cursor: "pointer", border: "none",
                  opacity: repoUrl.trim() ? 1 : 0.4, transition: "opacity 0.15s",
                }}
              >
                Analyze
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  /* ── Results ── */
  const { narrative, findings = [], repo, commits, prs } = result;

  const tiers: { id: Tier; label: string }[] = [
    { id: "all", label: "All findings" },
    { id: "hi",  label: "High" },
    { id: "md",  label: "Medium" },
    { id: "lo",  label: "Low" },
  ];

  const visibleFindings = activeTier === "all"
    ? findings
    : findings.filter((f) => TIER_MAP[f.confidence] === activeTier);

  const counts = {
    hi:  findings.filter((f) => f.confidence === "High").length,
    md:  findings.filter((f) => f.confidence === "Medium").length,
    lo:  findings.filter((f) => f.confidence === "Low").length,
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--arch-void)", color: "var(--arch-parchment)" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(1.25rem, 3vw, 2.5rem)" }}>

        {/* Dig summary */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "1.5rem",
          alignItems: "end",
          marginBottom: "1.75rem",
        }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              The dig is complete.{" "}
              <em style={{ fontStyle: "normal", color: "var(--arch-lavender)" }}>
                Here&apos;s what the history admits to.
              </em>
            </h1>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--arch-slate)",
              marginTop: "0.45rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--arch-fossil)", textDecoration: "none" }}
              >
                {repo.full_name}
              </a>
              {" · "}
              {commits.length} commits read
              {" · "}
              {prs.length} PRs
              {repo.language && ` · ${repo.language}`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "1px", background: "var(--arch-seam)", border: "1px solid var(--arch-seam)", borderRadius: "9px", overflow: "hidden" }}>
            {[
              { val: counts.hi,  label: "High",   color: "var(--arch-mist)" },
              { val: counts.md,  label: "Medium",  color: "var(--arch-lavender)" },
              { val: counts.lo,  label: "Low",     color: "var(--arch-amber)" },
              { val: findings.length, label: "Total", color: "var(--arch-fossil)" },
            ].map(({ val, label, color }) => (
              <div key={label} style={{ background: "var(--arch-obsidian)", padding: "0.8rem 1.15rem", textAlign: "center", minWidth: "80px" }}>
                <b style={{ display: "block", fontSize: "1.35rem", fontWeight: 600, lineHeight: 1.1, color }}>{val}</b>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--arch-slate)" }}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--arch-slate)", marginRight: "0.3rem" }}>
            Show
          </span>
          {tiers.map(({ id, label }) => {
            const on = activeTier === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTier(id)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: `1px solid ${on ? "var(--arch-amethyst)" : "var(--arch-seam)"}`,
                  borderRadius: "999px",
                  padding: "0.42rem 0.95rem",
                  color: on ? "var(--arch-lavender)" : "var(--arch-stone)",
                  background: on ? "rgba(142,108,201,0.14)" : "none",
                  cursor: "pointer",
                  transition: "0.18s",
                }}
              >
                {label}
              </button>
            );
          })}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--arch-slate)", marginLeft: "auto", letterSpacing: "0.08em" }}>
            {visibleFindings.length} finding{visibleFindings.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={reset}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "1px solid var(--arch-seam)",
              borderRadius: "999px",
              padding: "0.42rem 0.95rem",
              color: "var(--arch-slate)",
              background: "none",
              cursor: "pointer",
            }}
          >
            New analysis
          </button>
        </div>

        {/* Finding cards */}
        {visibleFindings.map((f, i) => (
          <FindingCard key={i} f={f} />
        ))}

        {visibleFindings.length === 0 && (
          <p style={{ color: "var(--arch-slate)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "2rem 0" }}>
            No findings at this confidence level.
          </p>
        )}

        {/* Narrative (collapsible) */}
        {narrative && (
          <section style={{ marginTop: "2rem" }}>
            <button
              onClick={() => setShowCommits((v) => !v)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--arch-slate)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--arch-seam)",
                width: "100%",
              }}
            >
              <span style={{ color: "var(--arch-fossil)" }}>{showCommits ? "▾" : "▸"}</span>
              Full narrative · {commits.length} commits · {prs.length} PRs
            </button>

            {showCommits && (
              <div style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* Narrative text */}
                <div style={{
                  border: "1px solid var(--arch-seam)",
                  borderRadius: "11px",
                  background: "var(--arch-obsidian)",
                  padding: "1.4rem 1.5rem",
                  gridColumn: "1 / -1",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--arch-amethyst)", display: "block", marginBottom: "1rem" }}>
                    Narrative
                  </span>
                  <div style={{ color: "var(--arch-stone)", fontSize: "0.9rem", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {narrative}
                  </div>
                </div>

                {/* Commits */}
                <div style={{ border: "1px solid var(--arch-seam)", borderRadius: "11px", background: "var(--arch-obsidian)", padding: "1.2rem 1.35rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--arch-fossil)", display: "block", marginBottom: "0.9rem" }}>
                    Commits ({commits.length})
                  </span>
                  {commits.slice(0, 30).map((c, i) => (
                    <div key={c.sha} style={{ paddingBottom: "0.7rem", marginBottom: "0.7rem", borderBottom: i < Math.min(commits.length, 30) - 1 ? "1px solid var(--arch-seam)" : "none" }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--arch-parchment)", marginBottom: "3px", lineHeight: 1.4 }}>
                        {c.message.split("\n")[0]}
                      </p>
                      <div style={{ display: "flex", gap: "12px", fontSize: "0.72rem", color: "var(--arch-slate)", fontFamily: "var(--font-mono)" }}>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--arch-fossil)", textDecoration: "none" }}>
                          {c.sha.substring(0, 7)}
                        </a>
                        <span>{c.author}</span>
                        <span>{c.date ? new Date(c.date).toLocaleDateString() : ""}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PRs */}
                <div style={{ border: "1px solid var(--arch-seam)", borderRadius: "11px", background: "var(--arch-obsidian)", padding: "1.2rem 1.35rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--arch-fossil)", display: "block", marginBottom: "0.9rem" }}>
                    Pull Requests ({prs.length})
                  </span>
                  {prs.length === 0 ? (
                    <p style={{ color: "var(--arch-slate)", fontSize: "0.85rem" }}>No pull requests found.</p>
                  ) : prs.map((pr, i) => (
                    <div key={pr.number} style={{ paddingBottom: "0.7rem", marginBottom: "0.7rem", borderBottom: i < prs.length - 1 ? "1px solid var(--arch-seam)" : "none" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "4px" }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.62rem", padding: "2px 8px",
                          borderRadius: "999px", flexShrink: 0,
                          background: pr.merged_at ? "rgba(142,108,201,0.2)" : "rgba(255,255,255,0.04)",
                          color: pr.merged_at ? "var(--arch-lavender)" : "var(--arch-slate)",
                        }}>
                          {pr.merged_at ? "merged" : "closed"}
                        </span>
                        <a href={pr.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--arch-parchment)", fontSize: "0.85rem", textDecoration: "none", lineHeight: 1.4 }}>
                          {pr.title}
                        </a>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--arch-slate)", fontFamily: "var(--font-mono)" }}>
                        #{pr.number} · {pr.user}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: "2.2rem",
          paddingTop: "1.4rem",
          borderTop: "1px solid var(--arch-seam)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--arch-slate)",
          letterSpacing: "0.08em",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}>
          <span>VESTIGE · EVERY CHANGE LEAVES A VESTIGE</span>
          <span>GOLD = WHAT HAPPENED · PURPLE = WHAT IT MEANS</span>
        </footer>
      </div>
    </main>
  );
}
