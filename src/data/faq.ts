import { site } from "@/lib/site-config";

export const faqItems: { q: string; a: string }[] = [
  {
    q: "Je to programování?",
    a: "Ne v klasickém smyslu. Děti netvoří kód řádek po řádku — řídí AI nástroje a skládají vlastní hru, appku nebo web (vibecoding). Pokud hledáte kurz Pythonu, tenhle formát je jiný.",
  },
  {
    q: "Jaký je vhodný věk?",
    a: `Kurz cílí na děti ${site.audience.ageMin}–${site.audience.ageMax} let. Záleží na zvídavosti a základní práci s počítačem — individuálně lze domluvit výjimku.`,
  },
  {
    q: "Proč dělíte skupiny podle věku?",
    a: "Aby tempo, složitost i příklady seděly danému segmentu — mladší a starší teen to berou jinak a my to respektujeme. Přesné věkové rozmezí konkrétního běhu s vámi domluvíme po přihlášce.",
  },
  {
    q: "Máte už reference nebo ukázky z kurzu?",
    a: "První běhy právě spouštíme — na webu zatím neuvádíme vykonstruované výsledky. Jakmile dokončíme první cykly, doplníme férové ohlasy a ukázky projektů od dětí (se souhlasem rodičů).",
  },
  {
    q: "Je kurz prezenční nebo online?",
    a: `Forma je vždy online — každá lekce trvá ${site.pricing.lessonMinutes} minut, cyklus má ${site.pricing.lessons} lekcí (jednou týdně). Odkaz na hovor dostanete před začátkem.`,
  },
  {
    q: "Co když dítě zmešká lekci?",
    a: "Doplníme v obchodních podmínkách konkrétní pravidlo (náhrada / záznam). Cílem je, aby dítě nespadlo z tempa — domluvíme individuálně.",
  },
  {
    q: "Jak probíhá platba?",
    a: "Po registraci vás kontaktujeme a domluvíme podmínky. Fakturu zatím vystavujeme a posíláme individuálně (fyzicky / poštou dle domluvy), nikoli automaticky z webu. Po obdržení faktury platíte podle uvedených údajů. Online platební brána může být doplněna později.",
  },
  {
    q: "Je práce s AI pro děti bezpečná?",
    a: "V kurzu probíráme bezpečnost a etiku — co sdílet, co ne, kdy AI věřit. Rodiče dostanou stručné doporučení k účtům nástrojů a dohledu.",
  },
  {
    q: "Kolik to stojí?",
    a: `Skupina ${site.pricing.skupinaCourse} Kč za ${site.pricing.lessons} lekcí (${site.pricing.skupinaPerLesson} Kč / lekce), 1:1 je ${site.pricing.individualCourse} Kč za kurz (${site.pricing.individualPerLesson} Kč / lekce). ${site.pricing.vatNote}`,
  },
  {
    q: "Kdy se skupinový kurz skutečně rozběhne?",
    a: `Nejdřív s vámi domluvíme termín a složení skupiny podle zájmu. Skupinový běh pak otevřeme, když se přihlásí alespoň ${site.pricing.groupMinStudentsToOpen} dětí. Ve skupině je nejvýše ${site.pricing.groupMaxStudents} dětí.`,
  },
  {
    q: "Kde vidím vypsané termíny skupin?",
    a: `Na stránce „Aktuální běhy“ je přehled toho, co právě nabízíme. Při registraci můžete (pokud to dává smysl) vybrat konkrétní běh — nebo nechat výběr na pozdější domluvě.`,
  },
  {
    q: "Co když je termín už plný?",
    a: "Na přihlášce se plný termín obvykle nedá vybrat. Napište nám — můžeme nabídnout jiný běh nebo vás zařadit na čekací listinu podle domluvy.",
  },
  {
    q: "Jak zjistím stav přihlášky a platby?",
    a: `Po přihlášce vás budeme kontaktovat e-mailem. Můžete také použít přehled pro rodiče na webu (přihlášení stejným e-mailem jako u přihlášky) — uvidíte stav a odkaz na orientační platební přehled.`,
  },
];
