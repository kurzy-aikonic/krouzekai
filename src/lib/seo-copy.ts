import { site } from "@/lib/site-config";

/** Sjednocené meta popisy (cca 150–165 znaků) pro výsledky ve vyhledávání a sdílení. */
export const metaDescriptions = {
  home: `Kroužek umělé inteligence pro děti ${site.audience.ageMin}–${site.audience.ageMax} let — vždy online, ${site.pricing.lessonMinutes} min: ${site.pricing.lessons} lekcí, vibecoding s AI, skupiny podle věku, otevíráme první běhy. Skupina max. ${site.pricing.groupMaxStudents} (${site.pricing.skupinaPerLesson} Kč/lekce) nebo 1:1 (${site.pricing.individualPerLesson} Kč/lekce). ${site.parentSite.name}.`,

  registrace: `Přihláška na ${site.name} (vždy online): skupina nebo 1:1, ${site.pricing.lessons}×${site.pricing.lessonMinutes} min, termín domluvíme po přihlášce, ceny skupina ${site.pricing.skupinaCourse} Kč / individuál ${site.pricing.individualCourse} Kč. ${site.contactEmail}.`,

  jakProbiha: `Jak probíhá online lekce ${site.name}: ${site.pricing.lessonMinutes} minut týdně, ${site.pricing.lessons} lekcí, co připravit doma a jak zapojit rodiče.`,

  faq: `FAQ k ${site.name}: není to klasické programování, věk ${site.audience.ageMin}–${site.audience.ageMax} let, skupiny podle věku, první běhy, platba, bezpečnost práce s AI, ceny skupiny a individuálu, minimální počet pro start kurzu.`,

  kontakt: `Kontakt na ${site.name} (${site.company.legalName}, IČO ${site.company.ic}): e-mail ${site.contactEmail}, telefon ${site.company.phoneDisplay}.`,

  obchodniPodminky: `Obchodní podmínky ${site.name}: předmět kurzu, objednávka, ceny, odstoupení, ochrana údajů. Provoz v návaznosti na ${site.parentSite.name}.`,

  ochrana: `Ochrana osobních údajů (GDPR) při registraci na ${site.name}: účel zpracování, doba uchování, práva subjektů údajů, kontakt na správce.`,

  cookies: `Informace o cookies na webu ${site.name}: nezbytné cookies, analytika po souhlasu, nastavení v prohlížeči.`,

  platba: `Orientační přehled platby kurzu ${site.name} po přihlášce — převod, variabilní symbol. Faktura a finální instrukce po domluvě s provozovatelem.`,

  aktualniBehy: `Aktuální skupinové běhy ${site.name}: vypsané termíny a kapacity. Přihláška na kurz online; konkrétní výběr termínu je na registraci.`,
} as const;
