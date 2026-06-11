import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";

// We assign the exact variable names Tailwind expects internally
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans", 
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono", 
});

export const metadata: Metadata = {
  title: "Vestige",
  description: "Decision archaeology for codebases you didn't write.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Applied the font variables to the body */}
      <body className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
