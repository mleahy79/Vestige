"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    // Auth not yet implemented — forward to archaeology tool
    await new Promise((r) => setTimeout(r, 800));
    router.push("/history");
  }

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
        {/* Logo */}
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

        {/* Card */}
        <div
          style={{
            background: "var(--arch-obsidian)",
            border: "1px solid var(--arch-seam)",
            borderRadius: "12px",
            padding: "36px",
          }}
        >
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
            Sign in
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--arch-stone)",
              marginBottom: "28px",
            }}
          >
            Access your diligence workspace.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--arch-stone)",
                  marginBottom: "6px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@firm.com"
                required
                style={{
                  width: "100%",
                  background: "var(--arch-void)",
                  border: "1px solid var(--arch-seam)",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "0.9rem",
                  color: "var(--arch-parchment)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--arch-amethyst)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--arch-seam)")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--arch-stone)",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  background: "var(--arch-void)",
                  border: "1px solid var(--arch-seam)",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "0.9rem",
                  color: "var(--arch-parchment)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--arch-amethyst)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--arch-seam)")}
              />
            </div>

            {error && (
              <p style={{ fontSize: "0.8rem", color: "#e07070", margin: 0 }}>{error}</p>
            )}

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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.85rem",
            color: "var(--arch-stone)",
          }}
        >
          No account?{" "}
          <Link
            href="/signup"
            style={{ color: "var(--arch-lavender)", textDecoration: "none" }}
          >
            Request access
          </Link>
        </p>
      </div>
    </main>
  );
}
