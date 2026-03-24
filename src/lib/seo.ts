import type { Metadata } from "next";
import { site } from "@/lib/site-config";

/** Bezpečná základní URL pro metadata a kanonické odkazy. */
export function getSiteUrl(): URL {
  try {
    return new URL(site.baseUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const seoKeywords = [
  "AI kroužek",
  "vibecoding",
  "kurz pro děti",
  "online kurz",
  "tvorba her",
  "ChatGPT",
  "programování bez kódu",
  "děti 10–15 let",
] as const;

const ogImageFromEnv = process.env.NEXT_PUBLIC_OG_IMAGE;

function openGraphImages(): NonNullable<Metadata["openGraph"]>["images"] {
  if (!ogImageFromEnv) return undefined;
  try {
    const url = new URL(ogImageFromEnv, getSiteUrl());
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

  return {
    title: input.title,
    description: input.description,
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
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}

/** Globální metadata pro root layout (doplní se o metadataBase). */
export const rootMetadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${site.shortName} — ${site.name}`,
    template: `%s — ${site.shortName}`,
  },
  description:
    "Online kroužek: vlastní hra, appka nebo web s AI — bez programování. Pro děti 10–15 let. Skupina max. 6 nebo kurz 1:1.",
  applicationName: site.shortName,
  authors: [{ name: site.lektor.name, url: getSiteUrl().toString() }],
  creator: site.lektor.name,
  keywords: [...seoKeywords],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: site.shortName,
    title: `${site.shortName} — ${site.name}`,
    description:
      "Online kroužek: vlastní hra, appka nebo web s AI — bez programování. Pro děti 10–15 let.",
    url: getSiteUrl().toString(),
    ...(defaultOgImages ? { images: defaultOgImages } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} — ${site.name}`,
    description:
      "Online kroužek: vlastní hra, appka nebo web s AI — bez programování. Pro děti 10–15 let.",
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
