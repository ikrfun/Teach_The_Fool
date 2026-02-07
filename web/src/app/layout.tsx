import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teach the Fool",
  description: "教えて覚える学習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg text-text`}
      >
        <header className="sticky top-0 z-10 bg-brand-400 text-white shadow-soft">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a href="/topic" className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="text-lg font-semibold">Teach the Fool</span>
            </a>
            <nav className="flex items-center gap-3">
              <a href="/topic" className="rounded-full bg-brand-500 px-4 py-2 text-white hover:opacity-90">
                新しい学習を始める
              </a>
            </nav>
          </div>
        </header>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
