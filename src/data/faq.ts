import { site } from "@/lib/site-config";
import type { CoursePricing } from "@/lib/course-pricing-store";
import { perLessonCzk } from "@/lib/course-pricing-utils";

export function buildFaqItems(
  pricing: CoursePricing,
): { q: string; a: string; relatedLink?: { label: string; href: string } }[] {
  const skupinaPerLesson = perLessonCzk(pricing.skupinaCourseCzk);
  const individualPerLesson = perLessonCzk(pricing.individualCourseCzk);

  return [
  {
    q: "Potřebuje dítě umět programovat?",
    a: "Nepotřebuje. Dítě popisuje, co chce vytvořit, a kód podle jeho zadání píše AI. Stačí základní práce s počítačem.",
    relatedLink: { label: "Co je vibecoding a jak funguje", href: "/pruvodce/co-je-vibecoding" },
  },
  {
    q: "Jaký je vhodný věk?",
    a: `Kurz je pro teenagery od ${site.audience.ageMin} do ${site.audience.ageMax} let. Rozhoduje zájem o technologie a běžná práce s počítačem. Výjimku domluvíme individuálně.`,
  },
  {
    q: "Jaké vybavení potřebujeme?",
    a: "Stačí PC nebo notebook s přístupem na internet a běžný webový prohlížeč.",
  },
  {
    q: "Potřebujeme placené AI nástroje?",
    a: "Ne. Využíváme bezplatné verze nástrojů nebo naše licence.",
  },
  {
    q: "Je práce s AI pro děti bezpečná?",
    a: "Ano. Děti učíme etiku, ochranu soukromí a kyberbezpečnost hned od první lekce — co je bezpečné sdílet, co ne a kdy AI výstupům věřit. Rodiče navíc dostanou stručné doporučení k účtům u AI nástrojů (věková omezení) a k rozumnému dohledu nad dítětem během kurzu.",
    relatedLink: { label: "Je ChatGPT bezpečný pro děti? Celý průvodce", href: "/pruvodce/je-chatgpt-bezpecny-pro-deti" },
  },
  {
    q: "Jak probíhá platba?",
    a: "Po registraci vás kontaktujeme a domluvíme podmínky. Fakturu vystavujeme a posíláme individuálně, nikoli automaticky z webu. Po obdržení faktury platíte podle uvedených údajů.",
  },
  {
    q: "Kolik to stojí?",
    a: `Skupina ${pricing.skupinaCourseCzk.toLocaleString("cs-CZ")} Kč za ${site.pricing.lessons} lekcí (${skupinaPerLesson.toLocaleString("cs-CZ")} Kč / lekce), 1:1 je ${pricing.individualCourseCzk.toLocaleString("cs-CZ")} Kč za kurz (${individualPerLesson.toLocaleString("cs-CZ")} Kč / lekce). ${site.pricing.vatNote}`,
  },
  {
    q: "Kdy se skupinový kurz skutečně rozběhne?",
    a: "Skupinu otevřeme, jakmile se naplní její kapacita, nejvýš šest dětí. Do potvrzení objednávky a vystavení faktury nic neplatíte a přihlášku můžete zrušit. Pak vám pošleme fakturu a informace k první lekci.",
  },
  {
    q: "Proč ještě nemůžeme platit, i když jsme přihlášení?",
    a: "Dokud skupinu nepotvrdíme, kurz ještě neběží. Fakturu posíláme až po naplnění kapacity. Do té doby je odeslaná přihláška návrh smlouvy a nic se neplatí.",
  },
  {
    q: "Co když dítě lekci zmešká?",
    a: "Když lekci zrušíme my, nabídneme náhradní termín. Když se dítě bez omluvy nedostaví, náhradní termín sám od sebe nevzniká. Napište nám předem na e-mail a domluvíme se.",
  },
  {
    q: "Jaké AI nástroje děti používají a jsou pro jejich věk vhodné?",
    a: "Účastníci pracují například s ChatGPT a Claude, vždy s lektorem. Tyto nástroje mají vlastní podmínky, obvykle od 13 let, a do 18 let potřebují souhlas zákonného zástupce. Ten dáváte v přihlášce. Na lekcích se probírá, co do nástroje nepatří.",
    relatedLink: { label: "Je ChatGPT bezpečný pro děti? Celý průvodce", href: "/pruvodce/je-chatgpt-bezpecny-pro-deti" },
  },
  {
    q: "Můžu přihlášku zrušit?",
    a: "Dokud objednávku nepotvrdíme a nepošleme fakturu, nic neplatíte. Přihlášku v té době zrušíte e-mailem. Po uzavření smlouvy můžete odstoupit do 14 dnů, jak popisují obchodní podmínky.",
    relatedLink: { label: "Obchodní podmínky", href: "/obchodni-podminky" },
  },
  {
    q: "Kde vidím vypsané termíny skupin?",
    a: `Na stránce „Aktuální termíny“ je přehled toho, co právě nabízíme. Při registraci můžete (pokud to dává smysl) vybrat konkrétní termín — nebo nechat výběr na pozdější domluvě.`,
    relatedLink: { label: "Zobrazit aktuální termíny", href: "/aktualni-behy" },
  },
  {
    q: "Co když je termín už plný?",
    a: "U plného termínu je na stránce s termíny odkaz, přes který nám necháte kontakt. Ozveme se, jakmile se uvolní místo nebo otevřeme nový termín stejného formátu.",
    relatedLink: { label: "Zobrazit aktuální termíny", href: "/aktualni-behy" },
  },
  {
    q: "Jak zjistím stav přihlášky a platby?",
    a: `Po přihlášce vás budeme kontaktovat e-mailem. Stav i platební přehled najdete v přehledu pro rodiče na adrese /rodic/prihlaseni (přihlášení stejným e-mailem jako u přihlášky).`,
  },
  ];
}

/** Výchozí FAQ (statické stránky / build bez async). */
export const faqItems = buildFaqItems({
  skupinaCourseCzk: site.pricing.skupinaCourse,
  individualCourseCzk: site.pricing.individualCourse,
});
