import { site } from "@/lib/site-config";

const name = site.nameInflected;

/** Sjednocené meta popisy (cca 150–165 znaků) pro výsledky ve vyhledávání a sdílení. */
export const metaDescriptions = {
  home: `Online kroužek pro teenagery ${site.audience.ageMin}–${site.audience.ageMax} let. Vlastní hra nebo web s AI, malá skupina, ${site.pricing.lessons} lekcí. Platba až po potvrzení skupiny.`,

  registrace: `Přihláška do ${name} pro teenagery ${site.audience.ageMin}–${site.audience.ageMax} let. Odesláním vzniká návrh smlouvy a do potvrzení objednávky nic neplatíte.`,

  jakProbiha: `Jak probíhá ${site.name}: ${site.pricing.lessonMinutes} minut každý týden, celkem ${site.pricing.lessons} lekcí. Průběh, technické požadavky a role rodiče.`,

  faq: `Časté otázky ke ${name}: věk ${site.audience.ageMin}–${site.audience.ageMax} let, průběh lekcí, ceny, platba a bezpečnost práce s AI.`,

  kontakt: `Kontakt ke ${name}: e-mail ${site.contactEmail}, telefon ${site.company.phoneDisplay}. Provozovatel ${site.company.legalName}, IČO ${site.company.ic}.`,

  obchodniPodminky: `Obchodní podmínky ${name}: objednávka kurzu, cena, platba, odstoupení od smlouvy a práva účastníků i poskytovatele.`,

  ochrana: `Zásady ochrany osobních údajů ${name}: jaké údaje zpracováváme, proč, jak dlouho je uchováváme a jak uplatníte svá práva.`,

  cookies: `Informace o cookies na webu ${name}: nezbytné technologie, analytika po souhlasu a možnosti nastavení cookies v prohlížeči.`,

  pravidlaOnlineKrouzku: `Pravidla ${name}: bezpečné chování v lekcích, zákaz šikany, nahrávání a používání AI nástrojů.`,

  odstoupeni: `Vzorový formulář odstoupení od smlouvy ke ${name}: postup, kontaktní údaje a pokyny pro spotřebitele.`,

  platba: `Platba po přihlášce do ${name}: převod, variabilní symbol a další údaje. Finální pokyny posíláme po potvrzení objednávky.`,

  aktualniBehy: `Termíny ${name}: přehled skupinových a individuálních kurzů, kapacity a volných míst. Když termín není, necháte nám kontakt.`,

  coDetiTvori: `Co děti reálně tvoří v ${name}: hra v prohlížeči, vlastní web a zpětná vazba z pilotního kurzu.`,
} as const;
