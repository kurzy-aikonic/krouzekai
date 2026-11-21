const CANONICAL_ORIGIN = "https://www.krouzekumeleinteligence.cz";

/**
 * Kanonická adresa webu. Apex bez www se přepíše na www, protože tam web žije.
 * Náhled na Vercelu si nechá vlastní hostitele, pokud v prostředí není nastavená produkční adresa.
 */
export function resolveSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (!raw) {
    if (process.env.VERCEL_ENV === "production") return CANONICAL_ORIGIN;
    const vercelHost = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "");
    if (vercelHost) return `https://${vercelHost}`;
    return "http://localhost:3000";
  }
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    if (url.hostname === "krouzekumeleinteligence.cz") {
      url.hostname = "www.krouzekumeleinteligence.cz";
    }
    return url.origin;
  } catch {
    return CANONICAL_ORIGIN;
  }
}

/**
 * Firemní reference na webu (věta o 2 500 proškolených a jména Česká spořitelna, ČEZ, Škoda Auto).
 * Až bude souhlas a doklad, nechte `true`. Hodnota `false` je z webu odstraní.
 */
export const showCorporateReferences: boolean = true;

/** Veřejné odkazy na sociální sítě — doplň v .env nebo zde. */
function socialUrl(key: `NEXT_PUBLIC_SOCIAL_${string}`): string {
  const v = process.env[key];
  return typeof v === "string" && v.startsWith("http") ? v : "";
}

export const site = {
  /** Hlavní nadpis značky (shodně s doménou krouzekumeleinteligence.cz). */
  name: "Kroužek umělé inteligence",
  /** 2. a 6. pád: „v Kroužku…“, „ke Kroužku…“, „podmínky Kroužku…“. */
  nameInflected: "Kroužku umělé inteligence",
  /** Krátký název do šablony záložky a e-mailů. */
  shortName: "Kroužek umělé inteligence",
  /** Podnadpis s odkazem na mateřský web. */
  brandSubtitle: {
    prefix: "od ",
    linkLabel: "Aikonic training",
  },
  /** Produkce je vždy www, i když v prostředí zůstane adresa bez www. */
  baseUrl: resolveSiteBaseUrl(),
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kurzy@aikonic.cz",

  /** Hlavní web značky — odkazuje sem i aikonic.cz. */
  parentSite: {
    name: "AIKONIC",
    url: "https://www.aikonic.cz/",
    tagline: "AI školení a služby pro firmy",
  },

  company: {
    /** Obchodní firma dle veřejného rejstříku (MSp). */
    legalName: "Aikonic training s.r.o.",
    ic: "24472590",
    /** Spisová značka v obchodním rejstříku. */
    registryMark:
      "Spisová značka C 56215 vedená u Krajského soudu v Hradci Králové",
    /** Datum zápisu subjektu do OR (pro informaci na webu). */
    registryRegisteredAt: "2026-02-05",
    addressLine: "Heydukova 115, Dolní Předměstí, 572 01 Polička",
    addressNote: "sídlo společnosti, fakturační adresa",
    /** Rozdělená adresa pro schema.org (shodně se sídlem v OR). */
    postalAddress: {
      streetAddress: "Heydukova 115, Dolní Předměstí",
      addressLocality: "Polička",
      postalCode: "572 01",
      addressCountry: "CZ" as const,
    },
    phoneDisplay: "+420 723 061 013",
    phoneTel: "+420723061013",
  },

  social: {
    linkedin: socialUrl("NEXT_PUBLIC_SOCIAL_LINKEDIN"),
    facebook: socialUrl("NEXT_PUBLIC_SOCIAL_FACEBOOK"),
    instagram: socialUrl("NEXT_PUBLIC_SOCIAL_INSTAGRAM"),
    youtube: socialUrl("NEXT_PUBLIC_SOCIAL_YOUTUBE"),
  },

  lektor: {
    name: "Pavol Stuchlik",
    role: "Lektor kroužku",
  },

  /** Cílová skupina — jednotný zdroj pro copy, validaci přihlášky a SEO. */
  audience: {
    ageMin: 13,
    ageMax: 18,
  },

  pricing: {
    skupinaPerLesson: 500,
    skupinaCourse: 5000,
    individualPerLesson: 3000,
    individualCourse: 30000,
    lessons: 10,
    lessonMinutes: 60,
    /** Max. dětí ve skupině na lekci (orientační horní hranice copy). */
    groupMaxStudents: 6,
    /** Skupinový kurz startuje až po 100 % obsazení kapacity daného termínu. */
    groupLaunchRequiresFullCapacity: true as const,
    vatNote: "Poskytovatel není plátcem DPH.",
  },
} as const;

export type SiteConfig = typeof site;

/** Pro JSON-LD `sameAs` — hlavní web AIKONIC + nakonfigurované profily. */
export function schemaSameAsUrls(): string[] {
  const urls: string[] = [site.parentSite.url];
  for (const href of Object.values(site.social)) {
    if (href.length > 0) urls.push(href);
  }
  return urls;
}
