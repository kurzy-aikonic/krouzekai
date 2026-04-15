import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { CookieBannerHost } from "@/components/cookies/CookieBannerHost";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LazyClickSparkles } from "@/components/playful/LazyClickSparkles";
import { MagicBackdrop } from "@/components/playful/MagicBackdrop";
import { GlobalJsonLd } from "@/components/seo/GlobalJsonLd";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const display = Baloo_2({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  /** Stačí 700/800 — display font se u nás nepoužívá na „semibold“. */
  weight: ["700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c4b5fd",
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
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-[var(--magic-ink)]">
        <GlobalJsonLd />
        <MagicBackdrop />
        <LazyClickSparkles />
        <a
          href="#obsah"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-2xl focus:border-2 focus:border-[var(--magic-ink)] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[var(--magic-ink)] focus:shadow-[4px_4px_0_#312e81]"
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
        <SiteFooter />
        <CookieBannerHost />
      </body>
    </html>
  );
}
