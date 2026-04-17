import { site } from "@/lib/site-config";

export const faqItems: { q: string; a: string }[] = [
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
    q: "Je práce s AI bezpečná?",
    a: "Ano. Děti učíme etiku, ochranu soukromí a kyberbezpečnost hned od první lekce.",
  },
  {
    q: "Jak probíhá platba?",
    a: "Po registraci vás kontaktujeme a domluvíme podmínky. Fakturu vystavujeme a posíláme individuálně, nikoli automaticky z webu. Po obdržení faktury platíte podle uvedených údajů.",
  },
  {
    q: "Je práce s AI pro děti bezpečná?",
    a: "V kurzu probíráme bezpečnost a etiku — co sdílet, co ne, kdy AI věřit. Rodiče dostanou stručné doporučení k účtům nástrojů a dohledu.",
  },
  {
    q: "Kolik to stojí?",
    a: `Skupina ${site.pricing.skupinaCourse.toLocaleString("cs-CZ")} Kč za ${site.pricing.lessons} lekcí (${site.pricing.skupinaPerLesson.toLocaleString("cs-CZ")} Kč / lekce), 1:1 je ${site.pricing.individualCourse.toLocaleString("cs-CZ")} Kč za kurz (${site.pricing.individualPerLesson.toLocaleString("cs-CZ")} Kč / lekce). ${site.pricing.vatNote}`,
  },
  {
    q: "Kdy se skupinový kurz skutečně rozběhne?",
    a: `Nejdřív s vámi domluvíme termín a složení skupiny podle zájmu. Skupinový termín otevřeme, když se přihlásí alespoň ${site.pricing.groupMinStudentsToOpen} dětí. Ve skupině je nejvýše ${site.pricing.groupMaxStudents} dětí.`,
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
