"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleGitHubSignIn() {
    setLoading(true);
    await signIn("github", { callbackUrl: "/history" });
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
              lineHeight: 1.6,
            }}
          >
            Connect your GitHub account to access public and private repositories.
          </p>

          <button
            onClick={handleGitHubSignIn}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
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
            <svg height="18" viewBox="0 0 16 16" width="18" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {loading ? "Redirecting…" : "Continue with GitHub"}
          </button>
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
