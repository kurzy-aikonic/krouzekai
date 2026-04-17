/** Veřejné odkazy na sociální sítě — doplň v .env nebo zde. */
function socialUrl(key: `NEXT_PUBLIC_SOCIAL_${string}`): string {
  const v = process.env[key];
  return typeof v === "string" && v.startsWith("http") ? v : "";
}

export const site = {
  /** Hlavní nadpis značky (shodně s doménou krouzekumeleinteligence.cz). */
  name: "Kroužek umělé inteligence",
  /** Krátký název do šablony záložky a e-mailů. */
  shortName: "Kroužek umělé inteligence",
  /** Podnadpis s odkazem na mateřský web. */
  brandSubtitle: {
    prefix: "od ",
    linkLabel: "Aikonic training",
  },
  /** Nastav v produkci přes NEXT_PUBLIC_SITE_URL */
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
    name: "Zkušený tým lektorů",
    role: "Lektorský tým AIKONIC",
    bioShort:
      "Náš tým proškolil přes 2 500 lidí v Česku. Spolupracujeme např. s Českou spořitelnou, ČEZ nebo Škoda Auto. Učíme praktické použití AI — bez zbytečné teorie.",
  },

  /** Cílová skupina — jednotný zdroj pro copy, validaci přihlášky a SEO. */
  audience: {
    ageMin: 10,
    ageMax: 17,
  },

  pricing: {
    skupinaPerLesson: 500,
    skupinaCourse: 5000,
    individualPerLesson: 3000,
    individualCourse: 30000,
    lessons: 10,
    lessonMinutes: 60,
    /** Max. dětí ve skupině na lekci. */
    groupMaxStudents: 6,
    /** Min. přihlášených ke spuštění skupinového běhu. */
    groupMinStudentsToOpen: 3,
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
