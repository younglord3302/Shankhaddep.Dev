import type { Metadata } from "next";
import { Inter, Fira_Code, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const MouseGlow = dynamic(() => import("@/components/MouseGlow"), { ssr: false });


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [{ url: "https://res.cloudinary.com/dgdf7uxtn/image/upload/v1776102117/logo_1_et1tyx.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["https://res.cloudinary.com/dgdf7uxtn/image/upload/v1776102117/logo_1_et1tyx.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Premium Console Hardening: Silencing noise from extensions, dev keys, and library deprecations
  if (typeof window !== "undefined") {
    const _origWarn = console.warn;
    const _origError = console.error;
    const _origLog = console.log;
    
    const noiseFilter = (args: any[]) => {
      return args.some(arg => {
        if (typeof arg !== 'string') return false;
        const lower = arg.toLowerCase();
        return (
          lower.includes("clerk") || 
          lower.includes("development keys") ||
          lower.includes("suppresshydrationwarning") ||
          lower.includes("extra attributes from the server") ||
          (lower.includes("three") && (lower.includes("clock") || lower.includes("timer"))) ||
          lower.includes("pcfsoftshadowmap") ||
          lower.includes("webglshadowmap") ||
          lower.includes("installhook.js")
        );
      });
    };

    console.warn = (...args) => {
      if (noiseFilter(args)) return;
      _origWarn(...args);
    };
    
    console.error = (...args) => {
      if (noiseFilter(args)) return;
      _origError(...args);
    };

    console.log = (...args) => {
      if (noiseFilter(args)) return;
      _origLog(...args);
    };
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${inter.variable} ${outfit.variable} ${firaCode.variable} font-sans antialiased bg-white dark:bg-dark-950 text-dark-900 dark:text-dark-100`}
        >
          <div className="noise" />
          <MouseGlow />
          <ThemeProvider>
            <div className="min-h-screen flex flex-col relative z-0">
              <Navbar />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
