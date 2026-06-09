"use client";

import { useState } from "react";

interface PlacementResult {
  recommendation: string;
  file: {
    path: string;
    totalLines: number;
    repo: string;
    url: string;
  };
}

function RecommendationBlock({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div style={{ color: "#a09a94", lineHeight: "1.8", fontSize: "0.95rem" }}>
      {paragraphs.map((para, i) => {
        if (/^\*\*[^*]+\*\*/.test(para)) {
          const headingMatch = para.match(/^\*\*([^*]+)\*\*/);
          const rest = para.replace(/^\*\*[^*]+\*\*\s*—?\s*/, "");
          return (
            <div key={i} style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ color: "var(--vestige-stone)", fontSize: "0.8rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "6px", fontWeight: 600 }}>
                {headingMatch?.[1]}
              </h3>
              {rest && <p style={{ whiteSpace: "pre-wrap" }}>{rest}</p>}
            </div>
          );
        }
        if (para.startsWith("# ")) {
          return (
            <h2 key={i} style={{ color: "var(--vestige-crystal)", fontSize: "1.15rem", fontWeight: 700, marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              {para.replace(/^# /, "")}
            </h2>
          );
        }
        return (
          <p key={i} style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}>{para}</p>
        );
      })}
    </div>
  );
}

export default function PlacementPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [filePath, setFilePath] = useState("");
  const [changeDescription, setChangeDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!repoUrl.trim() || !filePath.trim() || !changeDescription.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          filePath: filePath.trim(),
          changeDescription: changeDescription.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Placement analysis failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            border: "3px solid var(--vestige-purple)",
            borderTopColor: "var(--vestige-crystal)",
            animation: "spin 1s linear infinite",
            margin: "0 auto 32px",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ color: "var(--vestige-crystal)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "12px" }}>
            Reading the structure
          </h2>
          <p style={{ color: "#a09a94" }}>
            Fetching the file and tracing its conventions...
          </p>
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>

          {/* File header */}
          <div style={{
            background: "#111111", border: "1px solid #2a2a2a",
            borderRadius: "16px", padding: "20px 24px", marginBottom: "24px",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap",
          }}>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--vestige-stone)", marginBottom: "4px" }}>
                {result.file.repo}
              </p>
              <a
                href={result.file.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "monospace", color: "var(--vestige-crystal)", fontSize: "0.95rem", textDecoration: "none" }}
              >
                {result.file.path}
              </a>
              <p style={{ color: "#555", fontSize: "0.78rem", marginTop: "4px" }}>
                {result.file.totalLines.toLocaleString()} lines
              </p>
            </div>
            <button
              onClick={reset}
              style={{
                padding: "8px 18px", borderRadius: "99px", fontSize: "0.8rem",
                border: "1px solid #444", color: "#a09a94", background: "transparent",
                cursor: "pointer",
              }}
            >
              New placement
            </button>
          </div>

          {/* Change description recap */}
          <div style={{
            background: "#111111", border: "1px solid #2a2a2a",
            borderRadius: "16px", padding: "18px 24px", marginBottom: "24px",
          }}>
            <p style={{ fontSize: "0.7rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--vestige-stone)", marginBottom: "8px" }}>
              Change requested
            </p>
            <p style={{ color: "#a09a94", fontSize: "0.9rem", lineHeight: 1.6 }}>{changeDescription}</p>
          </div>

          {/* Recommendation */}
          <div style={{
            background: "#111111", border: "1px solid var(--vestige-purple)",
            borderRadius: "16px", padding: "32px 36px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--vestige-stone)" }}>
                Placement Recommendation
              </span>
              <span style={{ fontSize: "0.7rem", fontFamily: "monospace", padding: "3px 10px", borderRadius: "99px", background: "#1e1e1e", color: "var(--vestige-crystal)" }}>
                Claude Opus 4.8
              </span>
            </div>
            <RecommendationBlock text={result.recommendation} />
          </div>

        </div>
      </main>
    );
  }

  const canSubmit = repoUrl.trim() && filePath.trim() && changeDescription.trim();

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{
            display: "inline-block", fontSize: "2.25rem", fontWeight: 600, fontFamily: "monospace",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "var(--vestige-stone)", border: "1px solid var(--vestige-stone)",
            padding: "4px 14px", borderRadius: "99px", marginBottom: "60px",
          }}>
            Placement Mode
          </span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px", lineHeight: 1.2 }}>
            Where does your<br />
            <span style={{ color: "var(--vestige-crystal)" }}>change belong?</span>
          </h1>
          <p style={{ color: "#a09a94", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Point Vestige at a file. Describe what you want to add.<br />
            It reads the structure and tells you exactly where to put it — and why.
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repository"
            autoComplete="off"
            spellCheck={false}
            style={{
              padding: "14px 18px", borderRadius: "12px",
              background: "#111111", border: "1px solid #333",
              color: "var(--foreground)", fontSize: "0.95rem",
              outline: "none", fontFamily: "monospace",
            }}
          />
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="src/styles/globals.css"
            autoComplete="off"
            spellCheck={false}
            style={{
              padding: "14px 18px", borderRadius: "12px",
              background: "#111111", border: "1px solid #333",
              color: "var(--foreground)", fontSize: "0.95rem",
              outline: "none", fontFamily: "monospace",
            }}
          />
          <textarea
            value={changeDescription}
            onChange={(e) => setChangeDescription(e.target.value)}
            placeholder="I want to add a hover state for .card-title that changes the color to #3D2645"
            rows={4}
            style={{
              padding: "14px 18px", borderRadius: "12px",
              background: "#111111", border: "1px solid #333",
              color: "var(--foreground)", fontSize: "0.95rem",
              outline: "none", resize: "vertical", lineHeight: 1.6,
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: "14px 28px", borderRadius: "12px",
              background: "var(--vestige-purple)", color: "var(--vestige-crystal)",
              fontWeight: 600, fontSize: "0.9rem", cursor: canSubmit ? "pointer" : "default",
              border: "none", opacity: canSubmit ? 1 : 0.4,
              transition: "opacity 0.15s", alignSelf: "flex-end",
            }}
          >
            Find placement
          </button>
        </form>
      </div>
    </main>
  );
}
