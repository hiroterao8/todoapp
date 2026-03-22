import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToDo アプリ",
  description: "シンプルなToDoアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
