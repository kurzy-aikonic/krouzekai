import type { Metadata } from "next";
import { site } from "@/lib/site-config";
import { metaDescriptions } from "@/lib/seo-copy";

/** Bezpečná základní URL pro metadata a kanonické odkazy. */
export function getSiteUrl(): URL {
  try {
    return new URL(site.baseUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

/** Absolutní URL pro kanonické odkazy, JSON-LD a Open Graph. */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, getSiteUrl()).toString();
}

/** Krátký popis služby pro schema.org (Organization / WebSite / Course). */
export function rootSchemaDescription(): string {
  return `Online kroužek pro děti ${site.audience.ageMin}–${site.audience.ageMax} let: ${site.pricing.lessonMinutes} min jednou za 14 dní, ${site.pricing.lessons} lekcí. Skupiny skládáme podle věku — tempo i témata sedí danému segmentu. Děti tvoří vlastní hru, appku nebo web s AI — bez klasického programování.`;
}

export const seoKeywords = [
  "Kroužek umělé inteligence",
  "kroužek umělé inteligence online",
  "kroužek AI",
  "AI kroužek pro děti",
  "kurz AI pro děti",
  "ChatGPT pro děti",
  "vibecoding",
  "promptování",
  "online kurz",
  "tvorba her",
  "programování bez kódu",
  `děti ${site.audience.ageMin}–${site.audience.ageMax} let`,
  "Aikonic",
] as const;

const ogImageFromEnv = process.env.NEXT_PUBLIC_OG_IMAGE;
const ogImageFallback = "/og-image.png";
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
/** Ověřovací kód ze Seznam Webmaster Tools (seznam-wmt meta tag). Nastav v .env po registraci webu. */
const seznamSiteVerification = process.env.NEXT_PUBLIC_SEZNAM_SITE_VERIFICATION;

function openGraphImages(): NonNullable<Metadata["openGraph"]>["images"] {
  const candidate = ogImageFromEnv?.trim() || ogImageFallback;
  try {
    const url = new URL(candidate, getSiteUrl());
    // Vlastní OG obrázek (og-image.png) i env override mají standardní rozměr 1200×630.
    return [{ url: url.toString(), width: 1200, height: 630, alt: site.name }];
  } catch {
    return undefined;
  }
}

function firstOgUrl(
  images: NonNullable<NonNullable<Metadata["openGraph"]>["images"]>,
): string | undefined {
  const first = Array.isArray(images) ? images[0] : images;
  if (first == null) return undefined;
  if (typeof first === "string") return first;
  if (typeof first === "object" && "url" in first && first.url != null) {
    const u = first.url;
    return typeof u === "string" ? u : String(u);
  }
  return undefined;
}

const defaultOgImages = openGraphImages();
const rootTwitterImage =
  defaultOgImages ? firstOgUrl(defaultOgImages) : undefined;

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  /** Specifická klíčová slova pro danou stránku (3–5 ks). Globální seznam zůstává jako fallback. */
  keywords?: string[];
  /** Např. platební stránka — neindexovat, ale sledovat odkazy */
  noIndex?: boolean;
};

/**
 * Jednotná metadata: kanonická URL, Open Graph, Twitter, robots.
 */
export function pageMetadata(input: PageSeoInput): Metadata {
  const base = getSiteUrl();
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const canonical = new URL(path || "/", base).toString();
  const ogImages = defaultOgImages;
  const twitterImage = ogImages ? firstOgUrl(ogImages) : undefined;
  const hasOgImage = Boolean(twitterImage);

  return {
    title: input.title,
    description: input.description,
    // Web je čistě český — jediná varianta jazyka, x-default/cs-CZ duplikace nemá smysl.
    keywords: input.keywords?.length
      ? [...input.keywords, ...seoKeywords]
      : [...seoKeywords],
    alternates: {
      canonical,
    },
    robots: input.noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: site.shortName,
      locale: "cs_CZ",
      type: "website",
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: hasOgImage ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}

/** Export popisů pro stránky (jeden zdroj pravdy). */
export { metaDescriptions };

/** Globální metadata pro root layout (doplní se o metadataBase). */
export const rootMetadata: Metadata = {
  metadataBase: getSiteUrl(),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      {
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  title: {
    default: site.name,
    template: `%s — ${site.shortName}`,
  },
  description: metaDescriptions.home,
  applicationName: site.shortName,
  authors: [{ name: site.lektor.name, url: getSiteUrl().toString() }],
  creator: site.lektor.name,
  publisher: site.shortName,
  category: "education",
  keywords: [...seoKeywords],
  ...(googleSiteVerification || seznamSiteVerification
    ? {
        verification: {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(seznamSiteVerification
            ? { other: { "seznam-wmt": seznamSiteVerification } }
            : {}),
        },
      }
    : {}),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: site.shortName,
    title: site.name,
    description: metaDescriptions.home,
    url: getSiteUrl().toString(),
    ...(defaultOgImages ? { images: defaultOgImages } : {}),
  },
  twitter: {
    card: rootTwitterImage ? "summary_large_image" : "summary",
    title: site.name,
    description: metaDescriptions.home,
    ...(rootTwitterImage ? { images: [rootTwitterImage] } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
