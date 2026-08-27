import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import AuthSessionProvider from "@/components/providers/SessionProvider";

// Plus Jakarta Sans was imported here but never actually applied — body sets
// Arial and no `font-sans` utility is used — so it was 27 KB of font downloaded
// on every page for nothing. Dropped rather than left dangling; to make it the
// real body face, re-add it and point globals.css `body { font-family }` at it.

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono", 
});

export const metadata: Metadata = {
  title: "Vestige — Technical Due Diligence for PE & Growth Equity",
  description: "Full git-history due diligence. Every commit reviewed, findings cited and confidence-scored, signed off before your deal team sees them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Applied the font variables to the body */}
      <body className={`${geistMono.variable} antialiased min-h-full flex flex-col`}>
        {/*
          /history is statically prerendered with an empty result, so a returning
          user's cached analysis can only be restored after hydration — which
          repaints the whole page and registers as a large layout shift. This runs
          during parse, before first paint, and marks the document so #history-root
          stays hidden until the restore lands; the flag is cleared in that effect.
          Users with no cached analysis are unaffected and still paint immediately.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("vestige_archaeology_result"))document.documentElement.setAttribute("data-restoring","")}catch(e){}`,
          }}
        />
        <AuthSessionProvider>
          <Navbar />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
