import { site } from "@/lib/site-config";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type GuideRelatedLink = {
  label: string;
  href: string;
};

export type GuideArticle = {
  slug: string;
  /** H1 na stránce článku. */
  title: string;
  /** SEO <title> — může být kratší/jinak formulovaný než H1. */
  metaTitle: string;
  description: string;
  keywords: string[];
  /** ISO datum publikace — pevné, needitujeme při každém buildu. */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  /** Krátký úvodní odstavec / perex zobrazený i v přehledu. */
  summary: string;
  sections: GuideSection[];
  relatedLinks: GuideRelatedLink[];
};

export const guideArticles: GuideArticle[] = [
  {
    slug: "je-chatgpt-bezpecny-pro-deti",
    title: "Je ChatGPT bezpečný pro děti? Průvodce pro rodiče",
    metaTitle: "Je ChatGPT bezpečný pro děti? Průvodce pro rodiče",
    description:
      "Jaký je věkový limit ChatGPT a dalších AI nástrojů, jaká rizika hlídat a jak dítěti nastavit bezpečné používání AI doma i na kroužku.",
    keywords: ["chatgpt pro děti bezpečnost", "AI a děti", "věkové limity ChatGPT"],
    publishedAt: "2026-07-11",
    readingMinutes: 6,
    summary:
      "Rodiče se nás na to ptají nejčastěji: může moje dítě používat ChatGPT, a je to vůbec bezpečné? Odpověď zní „ano, ale s pravidly“ — a v tomto článku vysvětlujeme, jaká pravidla to jsou.",
    sections: [
      {
        heading: "Jaký je věkový limit ChatGPT a podobných nástrojů",
        paragraphs: [
          "Většina velkých AI nástrojů (ChatGPT od OpenAI, Claude od Anthropic a další) má ve svých podmínkách použití minimální věk 13 let. Uživatelé mezi 13 a 18 lety navíc podle podmínek těchto nástrojů potřebují souhlas zákonného zástupce.",
          "To v praxi znamená, že mladší dítě by nemělo mít vlastní účet a nástroj používat samo bez dohledu. Pokud rodič účet dítěti založí nebo mu dovolí AI nástroj používat, měl by si být vědom, že za dodržení věkových podmínek nese odpovědnost on — ne poskytovatel kurzu ani samotné dítě.",
        ],
      },
      {
        heading: "Na jaká rizika si dát pozor",
        paragraphs: [
          "AI nástroje nejsou neomylné a mají specifická rizika, která je dobré znát ještě dřív, než je dítě začne používat pravidelně.",
        ],
        bullets: [
          "Halucinace — AI si někdy fakta vymyslí a zní přitom velmi přesvědčivě. Výstup je vždy dobré ověřit, zvlášť u čísel, dat a jmen.",
          "Nevhodný nebo věkově nepřiměřený obsah — filtry nejsou stoprocentní, proto se hodí domluvit si s dítětem, co je a co není v pořádku generovat.",
          "Soukromí — do AI by se nemělo psát nic, co by dítě nezveřejnilo na internetu (adresa, telefon, jméno školy apod.).",
          "Přílišné spoléhání se na AI — cílem je, aby AI byla pomocník k učení, ne náhrada vlastního uvažování.",
        ],
      },
      {
        heading: "Jak nastavit bezpečné používání doma",
        paragraphs: [
          "Několik jednoduchých pravidel dokáže riziko výrazně snížit, aniž by dítěti braly chuť AI používat a objevovat.",
        ],
        bullets: [
          "Založte účet vy jako rodič a mějte přehled, k čemu ho dítě používá.",
          "Domluvte se předem, co se do AI nepíše (citlivé osobní údaje, hesla, fotky jiných lidí).",
          "Naučte dítě jednoduché pravidlo: „AI odpověď je návrh, ne definitivní pravda — u důležitých věcí to ověřím.“",
          "Sledujte oficiální podmínky používaného nástroje — občas se mění.",
        ],
      },
      {
        heading: "Jak to řešíme na kroužku umělé inteligence",
        paragraphs: [
          `V ${site.name} je souhlas zákonného zástupce s používáním AI nástrojů (a informace o jejich věkových omezeních) součástí přihlášky. Dětem zároveň věnujeme čas přímo v lekcích kritickému myšlení: jak ověřovat výstupy, co do AI nepsat a jak s nástroji zacházet odpovědně.`,
          "Cílem není naučit dítě AI nástrojům „slepě věřit“, ale používat je jako silného pomocníka — s rozumem a zdravou dávkou ostražitosti.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Jak kroužek probíhá", href: "/jak-probiha" },
      { label: "Zásady ochrany osobních údajů", href: "/ochrana-osobnich-udaju" },
      { label: "Časté otázky", href: "/faq" },
    ],
  },
  {
    slug: "krouzek-programovani-vs-krouzek-ai",
    title: "Kroužek programování vs. kroužek AI — co dnes dává větší smysl",
    metaTitle: "Kroužek programování vs. kroužek AI pro děti",
    description:
      "Jaký je rozdíl mezi klasickým kroužkem programování a kroužkem umělé inteligence a pro jaké dítě se který formát hodí víc.",
    keywords: [
      "kroužek programování pro děti",
      "kroužek AI vs programování",
      "jaký kroužek vybrat pro dítě",
    ],
    publishedAt: "2026-07-11",
    readingMinutes: 5,
    summary:
      "Rodiče často řeší, jestli dítě přihlásit na klasický kroužek programování, nebo na kroužek umělé inteligence. Odpovědi se liší podle věku, zájmů dítěte i toho, co od kroužku očekáváte.",
    sections: [
      {
        heading: "Co učí klasický kroužek programování",
        paragraphs: [
          "Klasické programovací kroužky (např. výuka Pythonu, Scratch nebo webových technologií) vedou dítě k pochopení syntaxe jazyka a k tomu, jak se program krok po kroku sestavuje a debuguje.",
          "Výhoda je v hlubokém porozumění tomu, „jak to uvnitř funguje“. Nevýhodou pro řadu dětí bývá pomalejší postup k viditelnému výsledku — první funkční projekt často přijde až po několika lekcích.",
        ],
      },
      {
        heading: "Co učí kroužek umělé inteligence (vibecoding)",
        paragraphs: [
          "Kroužek AI staví na jiném principu: dítě popíše AI nástroji, co chce vytvořit, a společně s ním výsledek iterativně upravuje a vylepšuje. Tomuto přístupu se říká vibecoding.",
          "Výsledek na sebe nechá čekat mnohem kratší dobu — funkční mini hru nebo web může mít dítě hotový už během první lekce. Důraz je na formulaci zadání, testování, ladění a kritické posouzení výstupu, ne na znalost konkrétní syntaxe.",
        ],
      },
      {
        heading: "Pro jaké dítě se hodí co",
        paragraphs: [
          "Obě cesty se navzájem nevylučují — u řady dětí dává smysl kombinace, případně postupný přechod z jedné do druhé.",
        ],
        bullets: [
          "Kroužek AI / vibecoding: skvělý vstupní bod pro děti, které chtějí rychle vidět výsledek a nemají zatím zkušenost s programováním.",
          "Klasické programování: vhodné pro děti, které už mají o technologie hlubší zájem a chtějí rozumět principům „pod kapotou“.",
          "Pro mnoho dětí je motivující začít s AI a tvorbou konkrétních projektů — a případně pak přejít k hlubšímu programování, když je téma opravdu zaujme.",
        ],
      },
      {
        heading: "Shrnutí",
        paragraphs: [
          "Neexistuje univerzálně „lepší“ varianta — jde o to, co dítě aktuálně nejvíc posune a udrží jeho zájem. Kroužek AI dává smysl jako přístupný a motivující start, který navíc učí dovednosti (práce s AI, kritické myšlení, formulace zadání), jež budou důležité bez ohledu na to, kterým směrem se dítě později vydá.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Co je vibecoding", href: "/pruvodce/co-je-vibecoding" },
      { label: "Co děti reálně tvoří", href: "/co-deti-tvori" },
      { label: "Registrace na kroužek", href: "/registrace" },
    ],
  },
  {
    slug: "co-je-vibecoding",
    title: "Co je vibecoding a proč ho děti zvládnou dřív než Python",
    metaTitle: "Co je vibecoding? Vysvětlení pro rodiče a děti",
    description:
      "Vibecoding je způsob tvorby s AI, kdy nápad popíšete slovy a AI ho převede do funkčního kódu. Vysvětlujeme, jak funguje a proč je pro děti přístupnější než klasické programování.",
    keywords: ["co je vibecoding", "vibecoding pro děti", "programování bez kódu"],
    publishedAt: "2026-07-11",
    readingMinutes: 5,
    summary:
      "Vibecoding je jeden z pojmů, které v posledních letech zásadně změnily, jak se dá programovat. Vysvětlujeme, co to je, jak to funguje v praxi a proč to dětem otevírá dveře k tvorbě mnohem dřív, než by zvládly klasický programovací jazyk.",
    sections: [
      {
        heading: "Vibecoding v kostce",
        paragraphs: [
          "Vibecoding je způsob tvorby softwaru, kdy člověk popíše AI nástroji v běžném jazyce, co chce vytvořit — a AI z toho popisu vygeneruje funkční kód. Autor projektu pak výsledek testuje, upravuje zadání a nechává AI kód postupně vylepšovat.",
          "Místo psaní každého řádku kódu ručně se hlavní dovedností stává formulace jasného zadání a schopnost posoudit, jestli výsledek dělá to, co má.",
        ],
      },
      {
        heading: "Jak to vypadá v praxi",
        paragraphs: [
          "Typický postup: dítě popíše nápad („chci hru, kde postavička sbírá hvězdy a přeskakuje překážky“), AI vygeneruje první verzi, dítě ji vyzkouší, najde, co nefunguje nebo co by chtělo jinak, a zadání upřesní. Tento cyklus se několikrát opakuje, dokud výsledek nesedí.",
          "Díky tomu je vidět reálný pokrok už po několika minutách práce — což je pro udržení zájmu dítěte mnohem účinnější než dlouhé týdny učení syntaxe předtím, než vznikne první viditelný výsledek.",
        ],
      },
      {
        heading: "Proč je to pro děti přístupnější než Python",
        paragraphs: [
          "Klasický programovací jazyk vyžaduje zvládnutí přesné syntaxe — chybějící čárka nebo špatně odsazený řádek dokážou frustrovat i dospělé. Vibecoding tuto bariéru odstraňuje: dítě komunikuje přirozeným jazykem, který už umí.",
        ],
        bullets: [
          "Žádná syntaxe k nazpaměť naučení — chyby v „zápisu“ řeší AI.",
          "Okamžitá zpětná vazba: výsledek lze rovnou vyzkoušet a upravit.",
          "Nižší vstupní bariéra motivuje děti, které by se klasického kódu mohly obávat.",
        ],
      },
      {
        heading: "Co si dítě přesto musí osvojit",
        paragraphs: [
          "Vibecoding neznamená, že si AI „udělá všechno sama“. Dítě se musí naučit myslet strukturovaně, rozdělit velký nápad na menší kroky, formulovat přesné zadání a kriticky posoudit, jestli výstup odpovídá tomu, co chtělo — a případně jak zadání upravit, aby to platilo.",
          `Přesně tyto dovednosti — prompt engineering, testování a kritické myšlení — jsou jádrem toho, co se děti učí na ${site.name}.`,
        ],
      },
    ],
    relatedLinks: [
      { label: "Co se děti naučí na kroužku", href: "/#learn" },
      { label: "Co děti reálně tvoří", href: "/co-deti-tvori" },
      { label: "AI test úrovně zdarma", href: "/test-urovne-ai" },
    ],
  },
  {
    slug: "jak-vybrat-online-krouzek-pro-dite",
    title: "Jak vybrat online kroužek pro dítě: 7 věcí, na které se ptát",
    metaTitle: "Jak vybrat online kroužek pro dítě — 7 otázek",
    description:
      "Praktický seznam otázek, které je dobré položit před přihlášením dítěte na jakýkoli online kroužek — od velikosti skupiny po ochranu osobních údajů.",
    keywords: [
      "jak vybrat online kroužek pro dítě",
      "online kroužek pro děti recenze",
      "na co se zeptat před přihláškou na kurz",
    ],
    publishedAt: "2026-07-11",
    readingMinutes: 6,
    summary:
      "Nabídka online kroužků pro děti roste každým rokem a není vždy snadné poznat, který stojí za peníze i čas dítěte. Tady je sedm konkrétních otázek, které doporučujeme položit před přihlášením — u nás i kdekoli jinde.",
    sections: [
      {
        heading: "1. Kolik dětí je ve skupině a kdo s nimi lekci vede",
        paragraphs: [
          "Menší skupina obvykle znamená víc prostoru pro každé dítě a lektor se mu může věnovat individuálně. Zeptejte se na maximální kapacitu skupiny a na to, kdo přesně lekce vede a s jakou zkušeností.",
        ],
      },
      {
        heading: "2. Jak přesně lekce probíhají",
        paragraphs: [
          "Na jaké platformě se lekce odehrávají, jaké nástroje se používají a jestli se lekce nahrávají. Pokud se nahrávají, měl by poskytovatel jasně říct, k čemu záznam slouží a kdo k němu má přístup.",
        ],
      },
      {
        heading: "3. Jaký je konkrétní výstup na konci kurzu",
        paragraphs: [
          "Dobrý kroužek by měl umět popsat, s čím dítě reálně odejde — konkrétní projekt, dovednost nebo výstup, který lze ukázat rodině nebo ve škole. Obecné sliby typu „naučíme vše“ jsou varovný signál.",
        ],
      },
      {
        heading: "4. Jak se řeší bezpečnost a věková omezení AI nástrojů",
        paragraphs: [
          "Pokud kroužek pracuje s AI nástroji jako ChatGPT nebo Claude, měl by rodiče upozornit na jejich věková omezení a vyžadovat explicitní souhlas zákonného zástupce s jejich používáním.",
        ],
      },
      {
        heading: "5. Jak funguje platba a právo na odstoupení od smlouvy",
        paragraphs: [
          "U online služeb prodávaných na dálku máte jako spotřebitel ze zákona právo odstoupit od smlouvy do 14 dnů bez udání důvodu. Poskytovatel by měl mít tuto informaci na webu jasně uvedenou a měl by si nechat od vás odsouhlasit, pokud má kurz začít dřív, než tato lhůta uplyne.",
        ],
      },
      {
        heading: "6. Jak je to s ochranou osobních údajů dítěte",
        paragraphs: [
          "Zjistěte, jaké údaje o dítěti poskytovatel sbírá, jak dlouho je uchovává a jestli je sdílí s třetími stranami (např. platformami pro online hovory). U dětí mladších 15 let musí zpracování osobních údajů schválit zákonný zástupce.",
        ],
      },
      {
        heading: "7. Co se stane, když dítěti tempo nesedí",
        paragraphs: [
          "Zeptejte se, jak poskytovatel řeší situaci, kdy dítěti nevyhovuje tempo skupiny, nebo když se rozhodne v kurzu nepokračovat. Flexibilní přístup (např. možnost změnit skupinu nebo formát) je dobré znamení.",
        ],
      },
      {
        heading: "Jak na tyto otázky odpovídáme my",
        paragraphs: [
          `V ${site.name} držíme skupiny malé, jasně popisujeme výstup kurzu (konkrétní hra, appka nebo web), vyžadujeme souhlas s používáním AI nástrojů, dodržujeme 14denní lhůtu na odstoupení od smlouvy a osobní údaje dětí zpracováváme podle GDPR se souhlasem zákonného zástupce.`,
        ],
      },
    ],
    relatedLinks: [
      { label: "Jak kroužek probíhá", href: "/jak-probiha" },
      { label: "Obchodní podmínky", href: "/obchodni-podminky" },
      { label: "Časté otázky", href: "/faq" },
    ],
  },
];

export function getGuideArticleBySlug(slug: string): GuideArticle | undefined {
  return guideArticles.find((a) => a.slug === slug);
}
