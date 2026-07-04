import { site } from "@/lib/site-config";

/** Sjednocené meta popisy (cca 150–165 znaků) pro výsledky ve vyhledávání a sdílení. */
export const metaDescriptions = {
  home: `Online kroužek umělé inteligence pro děti ${site.audience.ageMin}–${site.audience.ageMax} let: ${site.pricing.lessons} lekcí po ${site.pricing.lessonMinutes} min, vibecoding s AI, skupiny podle věku a formát skupina nebo 1:1.`,

  registrace: `Registrace na ${site.name}: online kurz pro děti ${site.audience.ageMin}–${site.audience.ageMax} let, formát skupina nebo 1:1. Po přihlášce domlouváme termín i detaily individuálně.`,

  jakProbiha: `Jak to u nás funguje v ${site.name}: ${site.pricing.lessonMinutes} minut jednou za 14 dní, celkem ${site.pricing.lessons} lekcí. Přehled průběhu, technických požadavků i role rodiče.`,

  faq: `Časté otázky ke ${site.name}: věk ${site.audience.ageMin}–${site.audience.ageMax} let, průběh lekcí, ceny, platba, bezpečnost práce s AI i organizace prvních termínů.`,

  kontakt: `Kontakt na ${site.name}: e-mail ${site.contactEmail}, telefon ${site.company.phoneDisplay}. Provozovatel ${site.company.legalName} (IČO ${site.company.ic}).`,

  obchodniPodminky: `Obchodní podmínky ${site.name}: objednávka kurzu, cena, platební podmínky, odstoupení a další práva a povinnosti účastníků i poskytovatele.`,

  ochrana: `Zásady ochrany osobních údajů (GDPR) pro ${site.name}: jaké údaje zpracováváme, proč, jak dlouho je uchováváme a jak můžete uplatnit svá práva.`,

  cookies: `Informace o cookies na webu ${site.name}: nezbytné technologie, analytika po souhlasu a možnosti nastavení cookies v prohlížeči.`,

  pravidlaOnlineKrouzku: `Pravidla online kroužku ${site.name}: bezpečné chování v lekcích, zákaz šikany, pravidla pro nahrávání a používání AI nástrojů.`,

  odstoupeni: `Vzorový formulář odstoupení od smlouvy pro ${site.name}: postup, kontaktní údaje a praktické pokyny pro spotřebitele.`,

  platba: `Orientační přehled platby po registraci do ${site.name}: převod, variabilní symbol a další platební údaje. Finální pokyny posíláme po individuální domluvě.`,

  aktualniBehy: `Aktuální termíny ${site.name}: přehled skupinových i individuálních kurzů, kapacit a dostupnosti míst. Registrace probíhá online.`,

  coDetiTvori: `Co děti reálně tvoří v ${site.name}: hry, prompty, projekty a zpětná vazba z pilotního kurzu. Konkrétní výstupy místo obecných slibů.`,
} as const;
