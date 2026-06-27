"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--arch-void)",
    border: "1px solid var(--arch-seam)",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "0.9rem",
    color: "var(--arch-parchment)",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--arch-stone)",
    marginBottom: "6px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--arch-void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link href="/home">
            <Image
              src="/transparent-logo.png"
              alt="Vestige"
              width={64}
              height={64}
              style={{ margin: "0 auto 16px" }}
            />
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--arch-stone)",
            }}
          >
            Vestige
          </h1>
        </div>

        <div
          style={{
            background: "var(--arch-obsidian)",
            border: "1px solid var(--arch-seam)",
            borderRadius: "12px",
            padding: "36px",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--arch-amethyst)/20",
                  border: "1px solid var(--arch-amethyst)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "1.2rem",
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--arch-parchment)",
                  marginBottom: "12px",
                }}
              >
                Request received
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--arch-stone)", lineHeight: 1.6 }}>
                We&apos;ll be in touch. In the meantime, try the live demo.
              </p>
              <button
                onClick={() => router.push("/history")}
                style={{
                  marginTop: "24px",
                  padding: "10px 24px",
                  background: "transparent",
                  color: "var(--arch-lavender)",
                  border: "1px solid var(--arch-amethyst)",
                  borderRadius: "6px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Open demo
              </button>
            </div>
          ) : (
            <>
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--arch-parchment)",
                  marginBottom: "8px",
                }}
              >
                Request access
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--arch-stone)",
                  marginBottom: "28px",
                  lineHeight: 1.5,
                }}
              >
                Vestige is in early access for diligence teams and technical advisors.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--arch-amethyst)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--arch-seam)")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Work email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@firm.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--arch-amethyst)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--arch-seam)")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Firm / organization</label>
                  <input
                    type="text"
                    value={firm}
                    onChange={(e) => setFirm(e.target.value)}
                    placeholder="Optional"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "var(--arch-amethyst)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--arch-seam)")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "8px",
                    padding: "12px",
                    background: loading ? "var(--arch-seam)" : "var(--arch-amethyst)",
                    color: "var(--arch-parchment)",
                    border: "none",
                    borderRadius: "6px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {loading ? "Submitting…" : "Request access"}
                </button>
              </form>
            </>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.85rem",
            color: "var(--arch-stone)",
          }}
        >
          Already have access?{" "}
          <Link
            href="/login"
            style={{ color: "var(--arch-lavender)", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
