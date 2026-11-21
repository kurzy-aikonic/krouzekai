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
    a: `Doporučený věk je ${site.audience.ageMin} až ${site.audience.ageMax} let. Jiný věk domluvíme. Účastníka mladšího ${site.audience.adultAge} let přihlašuje zákonný zástupce a ten dává souhlasy. Zletilý účastník se přihlašuje sám.`,
  },
  {
    q: "Jaké vybavení potřebujeme?",
    a: site.equipment,
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
    a: "Fakturu posíláme až tehdy, když je skupina plná a objednávku potvrdíme. U individuální výuky až po potvrzení objednávky. Číslo účtu a variabilní symbol jsou na faktuře a v e-mailu. Do té doby nic neplatíte.",
  },
  {
    q: "Kolik to stojí?",
    a: `Skupina ${pricing.skupinaCourseCzk.toLocaleString("cs-CZ")} Kč za ${site.pricing.lessons} lekcí (${skupinaPerLesson.toLocaleString("cs-CZ")} Kč / lekce), 1:1 je ${pricing.individualCourseCzk.toLocaleString("cs-CZ")} Kč za kurz (${individualPerLesson.toLocaleString("cs-CZ")} Kč / lekce). ${site.pricing.vatNote}`,
  },
  {
    q: "Kdy se skupinový kurz skutečně rozběhne?",
    a: `Skupinu otevřeme, až se naplní kapacita ${site.pricing.groupMaxStudents} míst. Když se do té doby nenaplní, navrhneme nový termín. Fakturu posíláme až po naplnění a po potvrzení objednávky. Odeslaná přihláška je návrh smlouvy, který lze do potvrzení zrušit.`,
  },
  {
    q: "Proč ještě nemůžeme platit, i když jsme přihlášení?",
    a: "Dokud skupina není plná a objednávku nepotvrdíme, fakturu neposíláme. Odeslaná přihláška je návrh smlouvy a do potvrzení objednávky nic neplatíte.",
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
    a: "Odesláním vzniká návrh smlouvy. Do potvrzení objednávky ho můžete zrušit e-mailem a nic neplatíte. Po uzavření smlouvy můžete odstoupit do 14 dnů, jak popisují obchodní podmínky.",
    relatedLink: { label: "Obchodní podmínky", href: "/obchodni-podminky" },
  },
  {
    q: "Kdy jsou jarní termíny 2027?",
    a: `Skupiny běží každý týden online, ${site.pricing.lessons} lekcí po ${site.pricing.lessonMinutes} minutách. Plánovaný start je v úterý 12. ledna 2027 nebo ve čtvrtek 14. ledna 2027, vždy 16:00–17:00. Skupinu otevřeme, až se naplní kapacita ${site.pricing.groupMaxStudents} míst. Když se nenaplní, navrhneme nový termín. Týdny jarních prázdnin (upřesníme podle rozvrhu skupiny) a Velikonoc vynecháváme. Harmonogram lekcí pošleme v potvrzení.`,
    relatedLink: { label: "Vybrat úterý nebo čtvrtek", href: "/registrace" },
  },
  {
    q: "Kde vidím vypsané termíny skupin?",
    a: "Na stránce „Aktuální termíny“ jsou jarní skupiny: úterý a čtvrtek od 16:00. Při registraci si jednu z nich vyberete, nebo necháte výběr na pozdější domluvě.",
    relatedLink: { label: "Zobrazit aktuální termíny", href: "/aktualni-behy" },
  },
  {
    q: "Co když je termín už plný?",
    a: "U plného termínu je na stránce s termíny odkaz, přes který nám necháte kontakt. Ozveme se, jakmile se uvolní místo nebo otevřeme nový termín stejného formátu.",
    relatedLink: { label: "Zobrazit aktuální termíny", href: "/aktualni-behy" },
  },
  {
    q: "Jak zjistím stav přihlášky a platby?",
    a: "Po přihlášce vás budeme kontaktovat e-mailem. Stav i platební přehled najdete v přehledu pro rodiče. Přihlásíte se stejným e-mailem jako u přihlášky.",
    relatedLink: { label: "Přehled pro rodiče", href: "/rodic/prihlaseni" },
  },
  ];
}

/** Výchozí FAQ (statické stránky / build bez async). */
export const faqItems = buildFaqItems({
  skupinaCourseCzk: site.pricing.skupinaCourse,
  individualCourseCzk: site.pricing.individualCourse,
});
