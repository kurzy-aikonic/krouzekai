import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieBannerHost } from "@/components/cookies/CookieBannerHost";
import { DeferredCourseSignupToast } from "@/components/layout/DeferredChrome";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MagicBackdrop } from "@/components/playful/MagicBackdrop";
import { GlobalJsonLd } from "@/components/seo/GlobalJsonLd";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const display = Geist({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

const logo = Archivo({
  variable: "--font-logo",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "800"],
  display: "swap",
  adjustFontFallback: true,
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07060f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${display.variable} ${body.variable} ${mono.variable} ${logo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip text-[var(--magic-ink)]">
        <GoogleAnalytics />
        <GlobalJsonLd />
        <MagicBackdrop />
        <a
          href="#obsah"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-2xl focus:border-2 focus:border-[var(--magic-ink)] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[var(--magic-ink)] focus:shadow-lg"
        >
          Přejít na obsah
        </a>
        <SiteHeader />
        <main
          id="obsah"
          className="paper-dots relative flex-1"
          tabIndex={-1}
        >
          {children}
        </main>
        <DeferredCourseSignupToast />
        <SiteFooter />
        <CookieBannerHost />
      </body>
    </html>
  );
}
