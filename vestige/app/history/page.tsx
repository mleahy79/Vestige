"use client";

import { useState } from "react";

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

function NarrativeBlock({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div style={{ color: "#a09a94", lineHeight: "1.8", fontSize: "0.95rem" }}>
      {paragraphs.map((para, i) => {
        if (para.startsWith("# ")) {
          return (
            <h2 key={i} style={{ color: "var(--vestige-crystal)", fontSize: "1.25rem", fontWeight: 700, marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              {para.replace(/^# /, "")}
            </h2>
          );
        }
        if (para.startsWith("## ")) {
          return (
            <h3 key={i} style={{ color: "var(--vestige-stone)", fontSize: "1.1rem", fontWeight: 600, marginTop: "1.25rem", marginBottom: "0.4rem" }}>
              {para.replace(/^## /, "")}
            </h3>
          );
        }
        if (para.startsWith("**") && para.endsWith("**")) {
          return (
            <h3 key={i} style={{ color: "var(--vestige-stone)", fontSize: "1.05rem", fontWeight: 600, marginTop: "1.25rem", marginBottom: "0.4rem" }}>
              {para.replace(/\*\*/g, "")}
            </h3>
          );
        }
        return (
          <p key={i} style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
            {para}
          </p>
        );
      })}
    </div>
  );
}

export default function HistoryPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"narrative" | "commits" | "prs">("narrative");

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
      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }
      setResult(data);
      setActiveTab("narrative");
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
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              border: "3px solid var(--vestige-purple)",
              borderTopColor: "var(--vestige-crystal)",
              animation: "spin 1s linear infinite",
              margin: "0 auto 24px",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
          <h2 style={{ color: "var(--vestige-crystal)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "12px" }}>
            Reading the history
          </h2>
          <p style={{ color: "#a09a94" }}>
            Fetching commits and PRs, then asking Claude to trace the decisions...
          </p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{
              display: "inline-block", fontSize: "3rem", fontWeight: 600, fontFamily: "monospace",
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "var(--vestige-stone)",
               padding: "4px 14px", marginBottom: "60px",
            }}>
              Decision Archaeology
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px", lineHeight: 1.2 }}>
              Why does this<br />
              <span style={{ color: "var(--vestige-crystal)" }}>code exist?</span>
            </h1>
            <p style={{ color: "#a09a94", fontSize: "1.05rem", lineHeight: 1.7 }}>
              Paste a GitHub repository URL. Vestige reads the full commit history,<br />
              PRs, and branch patterns — then writes you the story behind the code.
            </p>
          </div>

          {error && (
            <div style={{
              background: "rgba(180,60,60,0.12)", border: "1px solid rgba(180,60,60,0.4)",
              borderRadius: "12px", padding: "14px 18px", marginBottom: "24px",
              color: "#f08080", fontSize: "0.9rem",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1, padding: "14px 18px", borderRadius: "12px",
                  background: "#111111", border: "1px solid #333",
                  color: "var(--foreground)", fontSize: "0.95rem",
                  outline: "none", fontFamily: "monospace",
                }}
              />
              <button
                type="submit"
                disabled={!repoUrl.trim()}
                style={{
                  padding: "14px 28px", borderRadius: "12px",
                  background: "var(--vestige-purple)", color: "var(--vestige-crystal)",
                  fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
                  border: "none", opacity: repoUrl.trim() ? 1 : 0.4,
                  transition: "opacity 0.15s",
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

  const { narrative, findings = [], repo, commits, prs } = result;

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Repo header */}
        <div style={{
          background: "#111111", border: "1px solid #2a2a2a",
          borderRadius: "16px", padding: "24px 28px", marginBottom: "28px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--vestige-crystal)", fontWeight: 700, fontSize: "1.3rem", textDecoration: "none" }}
              >
                {repo.full_name}
              </a>
              {repo.description && (
                <p style={{ color: "#a09a94", marginTop: "6px", fontSize: "0.9rem" }}>{repo.description}</p>
              )}
            </div>
            <button
              onClick={reset}
              style={{
                padding: "8px 18px", borderRadius: "99px", fontSize: "0.8rem",
                border: "1px solid #444", color: "#a09a94", background: "transparent",
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              New analysis
            </button>
          </div>
          <div style={{ display: "flex", gap: "20px", marginTop: "14px", flexWrap: "wrap", fontSize: "0.82rem", color: "#666" }}>
            {repo.language && <span style={{ color: "var(--vestige-stone)" }}>{repo.language}</span>}
            <span>★ {repo.stars?.toLocaleString()}</span>
            <span>{repo.forks?.toLocaleString()} forks</span>
            <span>{commits.length} commits loaded</span>
            <span>{prs.length} PRs</span>
            {repo.created_at && <span>Created {repo.created_at.split("T")[0]}</span>}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid #2a2a2a", paddingBottom: "0" }}>
          {(["narrative", "commits", "prs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px", background: "transparent", border: "none",
                cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
                color: activeTab === tab ? "var(--vestige-crystal)" : "#666",
                borderBottom: activeTab === tab ? "2px solid var(--vestige-crystal)" : "2px solid transparent",
                marginBottom: "-1px", textTransform: "capitalize",
                transition: "color 0.15s",
              }}
            >
              {tab === "narrative" ? "Narrative" : tab === "commits" ? `Commits (${commits.length})` : `PRs (${prs.length})`}
            </button>
          ))}
        </div>

        {/* Narrative tab */}
        {activeTab === "narrative" && (
          <div style={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "32px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--vestige-stone)" }}>
                Vestige Analysis
              </span>
              <span style={{ fontSize: "0.7rem", fontFamily: "monospace", padding: "3px 10px", borderRadius: "99px", background: "#1e1e1e", color: "var(--vestige-crystal)" }}>
                Claude Opus 4.8
              </span>
            </div>
            <NarrativeBlock text={narrative} />

            {findings && findings.length > 0 && (
              <div style={{ marginTop: "40px", borderTop: "1px solid #2a2a2a", paddingTop: "32px" }}>
                <span style={{
                  fontSize: "0.7rem", fontFamily: "monospace", letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "var(--vestige-stone)", display: "block",
                  marginBottom: "20px",
                }}>
                  Key Findings
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {findings.map((f, i) => (
                    <div key={i} style={{
                      background: "#0e0e0e", border: "1px solid #2a2a2a",
                      borderRadius: "12px", padding: "20px 24px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "12px" }}>
                        <span style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "0.95rem" }}>
                          {f.title}
                        </span>
                        <span style={{
                          fontSize: "0.7rem", fontFamily: "monospace", padding: "3px 10px",
                          borderRadius: "99px", whiteSpace: "nowrap", flexShrink: 0,
                          background: f.confidence === "High" ? "rgba(80,180,80,0.12)" : f.confidence === "Medium" ? "rgba(180,140,40,0.12)" : "rgba(180,80,80,0.12)",
                          color: f.confidence === "High" ? "#6dbf6d" : f.confidence === "Medium" ? "#c9a84c" : "#c96d6d",
                          border: `1px solid ${f.confidence === "High" ? "rgba(80,180,80,0.3)" : f.confidence === "Medium" ? "rgba(180,140,40,0.3)" : "rgba(180,80,80,0.3)"}`,
                        }}>
                          {f.confidence} Confidence
                        </span>
                      </div>
                      <p style={{ color: "#a09a94", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "10px" }}>
                        {f.detail}
                      </p>
                      {f.evidence && (
                        <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#555" }}>
                          evidence: {f.evidence}
                        </span>
                      )}
                      {f.inferred && f.flag && (
                        <div style={{
                          marginTop: "12px", padding: "8px 12px", borderRadius: "8px",
                          background: "rgba(180,120,40,0.08)", border: "1px solid rgba(180,120,40,0.25)",
                          fontSize: "0.78rem", fontFamily: "monospace", color: "#c9923a",
                        }}>
                          ⚠ {f.flag}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Commits tab */}
        {activeTab === "commits" && (
          <div style={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px 28px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {commits.map((c, i) => (
                <div
                  key={c.sha}
                  style={{
                    padding: "14px 0",
                    borderBottom: i < commits.length - 1 ? "1px solid #1e1e1e" : "none",
                  }}
                >
                  <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "4px", lineHeight: 1.4 }}>
                    {c.message.split("\n")[0]}
                  </p>
                  <div style={{ display: "flex", gap: "16px", fontSize: "0.78rem", color: "#555" }}>
                    <span style={{ color: "#666" }}>{c.author || "Unknown"}</span>
                    <span>{c.date ? new Date(c.date).toLocaleDateString() : ""}</span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: "monospace", color: "var(--vestige-stone)", textDecoration: "none" }}
                    >
                      {c.sha.substring(0, 7)}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRs tab */}
        {activeTab === "prs" && (
          <div style={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "24px 28px" }}>
            {prs.length === 0 ? (
              <p style={{ color: "#666", fontSize: "0.9rem" }}>No pull requests found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {prs.map((pr, i) => (
                  <div
                    key={pr.number}
                    style={{
                      padding: "16px 0",
                      borderBottom: i < prs.length - 1 ? "1px solid #1e1e1e" : "none",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                      <span style={{
                        fontSize: "0.7rem", padding: "2px 8px", borderRadius: "99px", flexShrink: 0,
                        background: pr.merged_at ? "rgba(61,38,69,0.5)" : "#1e1e1e",
                        color: pr.merged_at ? "var(--vestige-crystal)" : "#666",
                        fontFamily: "monospace",
                      }}>
                        {pr.merged_at ? "merged" : "closed"}
                      </span>
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--foreground)", fontSize: "0.9rem", textDecoration: "none", lineHeight: 1.4 }}
                      >
                        {pr.title}
                      </a>
                    </div>
                    <div style={{ display: "flex", gap: "16px", fontSize: "0.78rem", color: "#555", paddingLeft: "0" }}>
                      <span>#{pr.number}</span>
                      <span>{pr.user}</span>
                      <span>{pr.merged_at ? new Date(pr.merged_at).toLocaleDateString() : pr.closed_at ? new Date(pr.closed_at).toLocaleDateString() : ""}</span>
                    </div>
                    {pr.body && (
                      <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "6px", lineHeight: 1.5, maxWidth: "680px" }}>
                        {pr.body.substring(0, 200)}{pr.body.length > 200 ? "…" : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
