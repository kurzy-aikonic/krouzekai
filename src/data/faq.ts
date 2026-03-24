import { site } from "@/lib/site-config";

export const faqItems: { q: string; a: string }[] = [
  {
    q: "Je to programování?",
    a: "Ne v klasickém smyslu. Děti netvoří kód řádek po řádku — řídí AI nástroje a skládají vlastní hru, appku nebo web (vibecoding). Pokud hledáte kurz Pythonu, tenhle formát je jiný.",
  },
  {
    q: "Jaký je vhodný věk?",
    a: "Kurz cílí na děti 10–15 let. Záleží na zvídavosti a základní práci s počítačem — individuálně lze domluvit výjimku.",
  },
  {
    q: "Co když dítě zmešká lekci?",
    a: "Doplníme v obchodních podmínkách konkrétní pravidlo (náhrada / záznam). Cílem je, aby dítě nespadlo z tempa — domluvíme individuálně.",
  },
  {
    q: "Jak probíhá platba?",
    a: "Po registraci vám pošleme platební instrukce. Brána (např. online platba) může být doplněna ve druhé fázi webu.",
  },
  {
    q: "Je práce s AI pro děti bezpečná?",
    a: "V kurzu probíráme bezpečnost a etiku — co sdílet, co ne, kdy AI věřit. Rodiče dostanou stručné doporučení k účtům nástrojů a dohledu.",
  },
  {
    q: "Kolik to stojí?",
    a: `Pilotní ceny: skupina ${site.pricing.skupinaCourse} Kč za ${site.pricing.lessons} lekcí, 1:1 je ${site.pricing.individualCourse} Kč za kurz. ${site.pricing.vatNote}`,
  },
];
