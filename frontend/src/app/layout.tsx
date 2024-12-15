import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal Buddy - Your Legal Journey Made Simple",
  description: "Navigate the legal system with confidence. Legal Buddy provides intelligent guidance for both pro se litigants and attorneys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider>
          <SessionProvider>
            <ClientLayout>{children}</ClientLayout>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
