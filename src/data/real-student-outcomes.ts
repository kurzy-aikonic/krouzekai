/** Anonymizovaná data z pilotního individuálního kurzu (duben–červen 2026). */

export type OutcomeProject = {
  emoji: string;
  title: string;
  summary: string;
  detail: string;
};

export type FeedbackRating = {
  label: string;
  score: number;
};

export const pilotCourseMeta = {
  format: "Individuální kurz AI",
  lessons: 10,
  period: "duben–červen 2026",
  participantLabel: "Absolvent individuálního kurzu, 15 let",
} as const;

export const realOutcomeProjects: OutcomeProject[] = [
  {
    emoji: "🕹️",
    title: "Funkční mini hra v prohlížeči",
    summary:
      "Během první lekce dítě s AI vytvořilo jednoduchou arkádovou hru v HTML — včetně opravy chyby a spuštění.",
    detail:
      "Student zadal zadání, nechal si vygenerovat kód, otestoval hru a společně s lektorem doladil chybu při spuštění. Výsledek šel okamžitě spustit v prohlížeči — silný praktický efekt bez klasického programování.",
  },
  {
    emoji: "📝",
    title: "Prompty, které dávají smysl",
    summary:
      "Naučil se skládat zadání podle metody RKUFO a postupně zužovat obecné nápady na konkrétní plán.",
    detail:
      "Od obecného „chci vlastní GTA“ až po krok za krokem návod s realistickým rozsahem. Dítě pochopilo, že kvalita zadání rozhoduje o kvalitě výstupu — a že iterace je normální součást práce s AI.",
  },
  {
    emoji: "🗺️",
    title: "Myšlenkové mapy a učební materiály",
    summary:
      "V NotebookLM zpracoval vlastní zdroje do map, přehledů, kvízů a kartiček pro opakování.",
    detail:
      "Práce jen s ověřenými podklady, citace ke každé odpovědi a minimum halucinací. Ideální pro školní projekty, přípravu na zkoušky nebo pochopení složitého tématu.",
  },
  {
    emoji: "🌐",
    title: "Vlastní web nebo aplikace",
    summary:
      "Cíl kurzu: do desáté lekce mít funkční prototyp — web, mini aplikaci nebo projekt připravený k publikování.",
    detail:
      "Student pracoval s Claude Cowork, artefakty a nástroji pro tvorbu webu. Největší přínos v hodnocení? Právě režim Cowork a práce na vlastním projektu od nápadu po hotový výstup.",
  },
  {
    emoji: "🔍",
    title: "Kritické myšlení u AI",
    summary:
      "Halucinace, bias, ověřování zdrojů a bezpečnost dat — ne teorie, ale praktické návyky.",
    detail:
      "Dítě si vyzkoušelo, že první odpověď nemusí být správná, naučilo se doptávat, porovnávat modely a do AI neposílat nic, co by nezveřejnilo na internetu.",
  },
];

export const pilotFeedbackRatings: FeedbackRating[] = [
  { label: "Celková spokojenost s kurzem", score: 5 },
  { label: "Srozumitelnost výkladu lektora", score: 4 },
  { label: "Naučil se něco nového a užitečného", score: 5 },
  { label: "Kritické myšlení a ověřování výstupů AI", score: 4 },
  { label: "Jistota v promptování", score: 5 },
  { label: "Přínos praktických cvičení a projektu", score: 5 },
  { label: "Ochota kurz doporučit", score: 5 },
];

export const pilotFeedbackQuotes = [
  {
    question: "Co vám kurz dal a co se vám líbilo nejvíc?",
    answer: "Nejvíc se mi líbila práce s Claudem a reálné projekty, ne jen teorie.",
  },
  {
    question: "Co vám chybělo nebo nebylo jasné?",
    answer: "Vše bylo jasné a nic nechybělo. Kurz bych rozhodně doporučil.",
  },
  {
    question: "Co zlepšit?",
    answer:
      "Není co zlepšovat. Na všechny dotazy mi bylo odpovězeno stručně a srozumitelně.",
  },
] as const;

export const pilotFeedbackSummary = {
  overallScore: 5,
  averageScore: 4.7,
  wouldRecommend: true,
  pace: "Tak akorát",
  lessonLength: "Tak akorát",
  topTopic: "Cowork mód a vlastní projekt",
} as const;
