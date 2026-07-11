import { site } from "@/lib/site-config";
import type { CoursePricing } from "@/lib/course-pricing-store";
import { perLessonCzk } from "@/lib/course-pricing-utils";

export function buildFaqItems(pricing: CoursePricing): { q: string; a: string }[] {
  const skupinaPerLesson = perLessonCzk(pricing.skupinaCourseCzk);
  const individualPerLesson = perLessonCzk(pricing.individualCourseCzk);

  return [
  {
    q: "Musí dítě umět programovat?",
    a: "Vůbec ne. Používáme vibecoding, kde kód píše AI podle instrukcí dítěte.",
  },
  {
    q: "Jaký je vhodný věk?",
    a: `Kurz cílí na děti ${site.audience.ageMin}–${site.audience.ageMax} let. Záleží na zvídavosti a základní práci s počítačem — individuálně lze domluvit výjimku.`,
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
    a: "Skupinový termín spouštíme až po naplnění kapacity — tedy když jsou obsazena všechna místa daného termínu (např. 5 z 5). Do té doby sbíráme nezávazné přihlášky a u každého termínu vidíte průběh obsazenosti. Po naplnění kapacity vás kontaktujeme s fakturací a organizací startu.",
  },
  {
    q: "Proč ještě nemůžeme platit, i když jsme přihlášení?",
    a: "Dokud není skupina plně obsazená, kurz ještě není potvrzen ke spuštění. Fakturu a platební instrukce posíláme až po naplnění kapacity termínu — předtím je přihláška nezávazná.",
  },
  {
    q: "Kde vidím vypsané termíny skupin?",
    a: `Na stránce „Aktuální termíny“ je přehled toho, co právě nabízíme. Při registraci můžete (pokud to dává smysl) vybrat konkrétní termín — nebo nechat výběr na pozdější domluvě.`,
  },
  {
    q: "Co když je termín už plný?",
    a: "Na přihlášce se plný termín obvykle nedá vybrat. Napište nám — můžeme nabídnout jiný termín nebo vás zařadit na čekací listinu podle domluvy.",
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
