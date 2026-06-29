"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/history", label: "Archaeology" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#d3d3d3]/90 border-b border-[#c1cdb5]/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <Image
            src="/transparent-logo.png"
            alt="Vestige"
            width={60}
            height={60}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-md text-lg font-bold transition-colors ${
                pathname === href
                  ? "text-[#89648F] bg-[#89648F]/10"
                  : "text-zinc-500 hover:text-[#89648F] hover:bg-[#89648F]/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {status === "loading" ? (
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#c1cdb5" }} />
          ) : session?.user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: "1px solid #c1cdb5",
                  borderRadius: "20px",
                  padding: "4px 12px 4px 4px",
                  cursor: "pointer",
                }}
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={28}
                    height={28}
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#89648F" }} />
                )}
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#555", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session.user.name}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 10 }}
                    onClick={() => setMenuOpen(false)}
                  />
                  <div style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    minWidth: "160px",
                    zIndex: 20,
                    overflow: "hidden",
                  }}>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
                      <p style={{ fontSize: "0.75rem", color: "#999", margin: 0 }}>Signed in as</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/home" })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: "transparent",
                        border: "none",
                        textAlign: "left",
                        fontSize: "0.85rem",
                        color: "#e07070",
                        cursor: "pointer",
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-lg font-bold text-[#89648F] rounded-md hover:bg-[#89648F]/8 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-bold text-white bg-[#89648F] rounded-full hover:bg-[#7a5880] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
