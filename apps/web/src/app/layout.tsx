import type { Metadata, Viewport } from "next";
import { ThemeProvider, themeInitScript } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingTelemetryHUD } from "@/components/layout/FloatingTelemetryHUD";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#060913",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "BrainDrop AI — Your Second Brain, On-Device",
  description:
    "Privacy-first knowledge capture & research assistant powered by Chrome Built-in AI Gemini Nano and Gemini 3.8 Flash Hybrid Inference. Clip, organize, and synthesize your knowledge on-device.",
  openGraph: {
    title: "BrainDrop AI — Intelligent Hybrid Knowledge Graph",
    description:
      "Capture anything, forget nothing — a connected workspace for your notes, ideas, and study cards.",
    url: "https://brain.tinonurcahya.dev",
    siteName: "BrainDrop AI",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased min-h-screen flex flex-col">
        <ThemeProvider>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 w-full pt-20 sm:pt-24 flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
        <FloatingTelemetryHUD />
        </ThemeProvider>
      </body>
    </html>
  );
}
