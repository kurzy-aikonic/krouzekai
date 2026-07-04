export type AiSkillLevel = "beginner" | "advanced" | "professional";

export type AiSkillAnswer = {
  id: string;
  text: string;
  points: number;
};

export type AiSkillQuestion = {
  id: string;
  prompt: string;
  answers: readonly AiSkillAnswer[];
};

export const AI_SKILL_LEVELS: readonly AiSkillLevel[] = [
  "beginner",
  "advanced",
  "professional",
];

export const AI_SKILL_LEVEL_LABELS: Record<AiSkillLevel, string> = {
  beginner: "Začátečník",
  advanced: "Pokročilý",
  professional: "Profesionál",
};

export const AI_SKILL_LEVEL_HINTS: Record<AiSkillLevel, string> = {
  beginner:
    "Vhodné je začít od základů: bezpečné používání AI, jasné zadávání a první jednoduché projekty.",
  advanced:
    "Dítě už má dobrý základ. Navážeme na něj složitějšími zadáními, iteracemi a samostatnější tvorbou.",
  professional:
    "Dítě je připravené na náročné projekty, systematickou práci s AI nástroji a vyšší míru samostatnosti.",
};

export const AI_SKILL_TEST_QUESTIONS: readonly AiSkillQuestion[] = [
  {
    id: "q1",
    prompt: "Když AI odpoví špatně, co obvykle uděláš?",
    answers: [
      { id: "a", text: "Nevím co dál, zkusím to znovu stejně.", points: 0 },
      { id: "b", text: "Změním zadání a upřesním, co chci.", points: 1 },
      { id: "c", text: "Postupně ladím prompt a ověřím výsledek více způsoby.", points: 2 },
    ],
  },
  {
    id: "q2",
    prompt: "Umíš AI zadat konkrétní roli (např. učitel, designer, programátor)?",
    answers: [
      { id: "a", text: "Spíš ne, píšu krátké obecné věty.", points: 0 },
      { id: "b", text: "Občas ano, když si vzpomenu.", points: 1 },
      { id: "c", text: "Ano, používám roli i jasná pravidla výstupu.", points: 2 },
    ],
  },
  {
    id: "q3",
    prompt: "Jak často kontroluješ, jestli si AI něco nevymyslela?",
    answers: [
      { id: "a", text: "Skoro nikdy.", points: 0 },
      { id: "b", text: "Někdy, když se mi to nezdá.", points: 1 },
      { id: "c", text: "Pravidelně porovnám fakta a zdroje.", points: 2 },
    ],
  },
  {
    id: "q4",
    prompt: "Co už jsi s AI vytvořil/a?",
    answers: [
      { id: "a", text: "Zatím jen krátké texty nebo obrázky na zkoušku.", points: 0 },
      { id: "b", text: "Menší projekt (např. mini hra, prezentace, jednoduchá appka).", points: 1 },
      { id: "c", text: "Víc projektů, které jsem vylepšoval/a v několika krocích.", points: 2 },
    ],
  },
  {
    id: "q5",
    prompt: "Když zadání nefunguje, jak postupuješ?",
    answers: [
      { id: "a", text: "Čekám, že AI sama přijde na lepší řešení.", points: 0 },
      { id: "b", text: "Přidám pár upřesnění a zkusím jinou formulaci.", points: 1 },
      { id: "c", text: "Rozdělím úkol na kroky, určím kritéria a testuju varianty.", points: 2 },
    ],
  },
  {
    id: "q6",
    prompt: "Víš, co do AI raději nepsat?",
    answers: [
      { id: "a", text: "Moc to neřeším.", points: 0 },
      { id: "b", text: "Vím, že tam nemám dávat citlivé údaje.", points: 1 },
      { id: "c", text: "Ano, hlídám soukromí, autorská práva i bezpečnost.", points: 2 },
    ],
  },
  {
    id: "q7",
    prompt: "Jak pracuješ s výstupem od AI?",
    answers: [
      { id: "a", text: "Většinou ho použiju tak, jak je.", points: 0 },
      { id: "b", text: "Trochu ho upravím.", points: 1 },
      { id: "c", text: "Kriticky ho upravím, doplním a přetvořím do vlastního stylu.", points: 2 },
    ],
  },
  {
    id: "q8",
    prompt: "Jak bys popsal/a svou samostatnost při tvorbě s AI?",
    answers: [
      { id: "a", text: "Potřebuju často pomoc krok za krokem.", points: 0 },
      { id: "b", text: "Základ zvládnu, u složitějších věcí pomůže podpora.", points: 1 },
      { id: "c", text: "Složitější úkoly zvládnu většinou samostatně.", points: 2 },
    ],
  },
];

export const AI_SKILL_PRO_CONFIRMATION_QUESTIONS: readonly AiSkillQuestion[] = [
  {
    id: "pc1",
    prompt:
      "Máš navrhnout AI asistenta pro školní projekt. Jak začneš, aby byl výstup kvalitní?",
    answers: [
      { id: "a", text: "Napíšu jen krátký dotaz a zkusím štěstí.", points: 0 },
      { id: "b", text: "Dám AI delší zadání, ale bez jasných kritérií.", points: 1 },
      { id: "c", text: "Rozdělím zadání na fáze a přidám kritéria kvality.", points: 2 },
      { id: "d", text: "Nejdřív navrhnu testovací scénáře, potom iteruju prompt po krocích.", points: 3 },
    ],
  },
  {
    id: "pc2",
    prompt:
      "AI vrací chybná fakta, ale text vypadá přesvědčivě. Jak postupuješ?",
    answers: [
      { id: "a", text: "Použiju to, pokud to zní dobře.", points: 0 },
      { id: "b", text: "Rychle to projdu a opravím pár věcí.", points: 1 },
      { id: "c", text: "Ověřím klíčové body ve více zdrojích.", points: 2 },
      { id: "d", text: "Zavedu systematický fact-check checklist a upravím prompt proti halucinacím.", points: 3 },
    ],
  },
  {
    id: "pc3",
    prompt:
      "Potřebuješ vytvořit konzistentní výstup ve stejném stylu napříč několika úkoly.",
    answers: [
      { id: "a", text: "Každý úkol řeším zvlášť bez pravidel.", points: 0 },
      { id: "b", text: "Zkusím styl popsat jednou větou.", points: 1 },
      { id: "c", text: "Použiju šablonu promptu s opakovanými pravidly.", points: 2 },
      { id: "d", text: "Vytvořím reusable prompt framework, eval kritéria a porovnání variant.", points: 3 },
    ],
  },
  {
    id: "pc4",
    prompt:
      "AI generuje kód hry, ale výkon je slabý a logika nepřehledná. Co je nejlepší přístup?",
    answers: [
      { id: "a", text: "Nechám to být, když to aspoň nějak funguje.", points: 0 },
      { id: "b", text: "Zkusím poprosit AI o „lepší verzi“.", points: 1 },
      { id: "c", text: "Nechám AI vysvětlit části kódu a postupně je refaktorovat.", points: 2 },
      { id: "d", text: "Rozbiju problém na moduly, nastavím metriky a iterativně testuju s AI.", points: 3 },
    ],
  },
  {
    id: "pc5",
    prompt:
      "Dítě chce publikovat AI výstup veřejně. Co je právně a eticky nejbezpečnější?",
    answers: [
      { id: "a", text: "Publikovat hned bez kontroly.", points: 0 },
      { id: "b", text: "Změnit pár detailů a publikovat.", points: 1 },
      { id: "c", text: "Prověřit citlivá data, práva k obsahu a podmínky nástroje.", points: 2 },
      { id: "d", text: "Udělám právní/etický checklist (soukromí, copyright, zdroje, věková pravidla) a teprve poté publikaci.", points: 3 },
    ],
  },
];

export function aiSkillMaxScore(): number {
  return AI_SKILL_TEST_QUESTIONS.reduce(
    (sum, q) => sum + Math.max(...q.answers.map((a) => a.points)),
    0,
  );
}

export function aiSkillProConfirmationMaxScore(): number {
  return AI_SKILL_PRO_CONFIRMATION_QUESTIONS.reduce(
    (sum, q) => sum + Math.max(...q.answers.map((a) => a.points)),
    0,
  );
}

export function evaluateAiSkillLevel(totalScore: number): AiSkillLevel {
  if (totalScore >= 12) return "professional";
  if (totalScore >= 6) return "advanced";
  return "beginner";
}

export function confirmProfessionalLevel(totalScore: number): boolean {
  return totalScore >= 12;
}

export function parseAiSkillLevel(value: unknown): AiSkillLevel | null {
  if (typeof value !== "string") return null;
  return (AI_SKILL_LEVELS as readonly string[]).includes(value)
    ? (value as AiSkillLevel)
    : null;
}
