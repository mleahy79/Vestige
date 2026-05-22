"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  const pathname = usePathname();

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
        </div>
      </div>
    </nav>
  );
}
