export const site = {
  name: "AI kroužek pro děti",
  shortName: "Kroužek AI",
  /** Nastav v produkci přes NEXT_PUBLIC_SITE_URL */
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@example.cz",
  lektor: {
    name: "Tomáš Doležal",
    role: "AI konzultant",
    bioShort:
      "Proškolil přes 2 500 lidí v Česku. Spolupracuje např. s Českou spořitelnou, ČEZ nebo Škoda Auto. Učí praktické použití AI — bez zbytečné teorie.",
  },
  pricing: {
    skupinaPerLesson: 500,
    skupinaCourse: 6000,
    individualPerLesson: 2000,
    individualCourse: 24000,
    lessons: 12,
    lessonMinutes: 60,
    vatNote: "Poskytovatel není plátcem DPH.",
  },
} as const;
