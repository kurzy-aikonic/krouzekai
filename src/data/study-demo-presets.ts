/** Předpřipravený obsah pro ukázku „příprava na zkoušku“ (bez volání API). */

export type StudyQuestion = {
  q: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export type StudyDayPlan = {
  label: string;
  tasks: string[];
};

export type StudyPreset = {
  id: string;
  subjectId: string;
  subjectLabel: string;
  topicId: string;
  topicLabel: string;
  summary: string[];
  questions: StudyQuestion[];
  studyPlan: StudyDayPlan[];
};

export const studyPresets: StudyPreset[] = [
  {
    id: "math-zlomky",
    subjectId: "math",
    subjectLabel: "Matematika",
    topicId: "zlomky",
    topicLabel: "Zlomky — základní operace",
    summary: [
      "Zlomek zapisujeme jako podíl čitatele a jmenovatele; jmenovatel nesmí být 0.",
      "Zlomky můžeme krátit (dělit čitatel i jmenovatel stejným číslem) nebo rozšiřovat.",
      "Při sčítání a odčítání potřebujeme společný jmenovatel.",
      "Při násobení násobíme čitatele a jmenovatele; při dělení násobíme převráceným zlomkem.",
      "Smíšená čísla převádíme na nesprávné zlomky, když je to pro výpočet praktičtější.",
    ],
    questions: [
      {
        q: "Který zlomek je ve zkráceném tvaru?",
        options: ["6/9", "4/10", "3/7", "8/12"],
        correctIndex: 2,
      },
      {
        q: "Součet 1/4 + 1/4 je:",
        options: ["1/8", "1/3", "1/2", "3/4"],
        correctIndex: 2,
      },
      {
        q: "Součin 2/3 × 3/4 =",
        options: ["5/7", "1/4", "1/2", "12/7"],
        correctIndex: 2,
      },
      {
        q: "K čemu slouží rozšíření zlomku?",
        options: [
          "Jen ke zkrácení čitatele",
          "Ke zjištění společného jmenovatele nebo k úpravě tvaru",
          "K odstranění jmenovatele",
          "K přičtení 1 k čitateli",
        ],
        correctIndex: 1,
      },
      {
        q: "Zlomek 5/5 se rovná:",
        options: ["0", "1/2", "1", "5"],
        correctIndex: 2,
      },
    ],
    studyPlan: [
      {
        label: "Den 1 (cca 25 min)",
        tasks: [
          "Zopakovat krácení a rozšiřování — 5 příkladů z učebnice.",
          "Nakreslit si zlomky jako pizzy nebo čokoládu (vizualizace pomáhá).",
        ],
      },
      {
        label: "Den 2 (cca 30 min)",
        tasks: [
          "Procvičit sčítání a odčítání se společným jmenovatelem.",
          "2 příklady slovně: kolik je 1/2 + 1/4 dortu?",
        ],
      },
      {
        label: "Den 3 (cca 20 min)",
        tasks: [
          "Násobení a dělení zlomků — kontrola výsledků kalkulačkou jen u příkladů s velkými čísly.",
          "Krátký vlastní test: 6 příkladů, bez spěchu.",
        ],
      },
    ],
  },
  {
    id: "math-obsah",
    subjectId: "math",
    subjectLabel: "Matematika",
    topicId: "obsah",
    topicLabel: "Obvod a obsah čtverce a obdélníku",
    summary: [
      "Obvod je součet délek všech stran; u čtverce platí O = 4 × a.",
      "Obsah čtverce: S = a × a = a²; u obdélníku S = a × b.",
      "Jednotky musí sedět — délky v cm, obsah v cm².",
      "U složených útvarů můžeme plochu rozdělit na obdélníky a sečíst.",
      "U slovních úloh si nejdřív nakresli obrázek a označ známé hodnoty.",
    ],
    questions: [
      {
        q: "Má-li čtverec stranu 5 cm, jeho obsah je:",
        options: ["10 cm²", "20 cm²", "25 cm²", "50 cm²"],
        correctIndex: 2,
      },
      {
        q: "Obvod obdélníku 3 cm × 7 cm je:",
        options: ["10 cm", "20 cm", "21 cm", "42 cm"],
        correctIndex: 1,
      },
      {
        q: "Obsah obdélníku 4 cm × 9 cm je:",
        options: ["13 cm²", "26 cm²", "36 cm²", "72 cm²"],
        correctIndex: 2,
      },
      {
        q: "Co znamená zápis cm²?",
        options: [
          "Centimetr na druhou — plocha",
          "Centimetr krát dva",
          "Objem",
          "Obvod v centimetrech",
        ],
        correctIndex: 0,
      },
      {
        q: "Dvojnásobná délka strany čtverce znamená obsah:",
        options: ["2× větší", "3× větší", "4× větší", "stejný"],
        correctIndex: 2,
      },
    ],
    studyPlan: [
      {
        label: "Den 1",
        tasks: [
          "Napsat si vzorce O a S na lísteček a přilepit na zeď.",
          "5 příkladů jen na čtverec (strana daná).",
        ],
      },
      {
        label: "Den 2",
        tasks: [
          "Obdélníky z reálného života: pokoj, stůl — změř a spočítej obsah.",
        ],
      },
      {
        label: "Den 3",
        tasks: [
          "1 složitější úloha ze sbírky + kontrola řešení.",
          "Zkus vysvětlit sourozenci, jak počítáš obsah.",
        ],
      },
    ],
  },
  {
    id: "cj-slovni-druhy",
    subjectId: "cj",
    subjectLabel: "Český jazyk",
    topicId: "slovni-druhy",
    topicLabel: "Slovní druhy — základní rozlišení",
    summary: [
      "Podstatná jména pojmenovávají věci, vlastnosti, děje (stůl, radost, běh).",
      "Přídavná jména určují vlastnosti a často se shodují s podstatným jménem.",
      "Slovesa vyjadřují děj nebo stav (běží, je, má).",
      "Příslovce upřesňují slovesa, přídavná jména nebo jiná příslovce (rychle, velmi).",
      "Věta má podmět (kdo/co) a přísudek (co dělá); pomáhá se ptát.",
    ],
    questions: [
      {
        q: "Které slovo je podstatné jméno?",
        options: ["krásný", "rychle", "škola", "běžet"],
        correctIndex: 2,
      },
      {
        q: "„Velmi“ je nejčastěji:",
        options: ["přídavné jméno", "příslovce", "spojka", "předložka"],
        correctIndex: 1,
      },
      {
        q: "Sloveso většinou vyjadřuje:",
        options: ["barvu věci", "děj nebo stav", "číslo", "pád"],
        correctIndex: 1,
      },
      {
        q: "„Zelený“ u slova „strom“ je většinou:",
        options: ["podstatné jméno", "přídavné jméno", "číslovka", "částice"],
        correctIndex: 1,
      },
      {
        q: "Otázka „Kdo?“ nejčastěji hledá:",
        options: ["přísudek", "podmět", "předmět", "přívlastek"],
        correctIndex: 1,
      },
    ],
    studyPlan: [
      {
        label: "Den 1",
        tasks: [
          "Vybrat 10 slov z článku a označit slovní druh (barevně).",
          "Napsat 3 vlastní věty a podtrhnout sloveso.",
        ],
      },
      {
        label: "Den 2",
        tasks: [
          "Procvičit na kartičkách: slovo na lístečku — druh na zadní straně.",
        ],
      },
      {
        label: "Den 3",
        tasks: [
          "Krátký diktát (5 vět) — po opravě barevně označit podmět a přísudek.",
        ],
      },
    ],
  },
  {
    id: "cj-zanry",
    subjectId: "cj",
    subjectLabel: "Český jazyk",
    topicId: "zanry",
    topicLabel: "Literární žánry (základy)",
    summary: [
      "Báseň často rýmuje, má verše; próza je souvislý text ve větách a odstavcích.",
      "Pohádka má typické postavy a často šťastný konec.",
      "Pověst vysvětluje vznik místa nebo jevu a může mít prvky pravdy i fantazie.",
      "Fejeton je krátký, vtipný nebo polemický text do novin.",
      "Žánr poznáš podle formy, účelu a místa, kde se text objevuje.",
    ],
    questions: [
      {
        q: "Který text je typicky psán ve verších?",
        options: ["fejeton", "návod", "báseň", "rozvrh hodin"],
        correctIndex: 2,
      },
      {
        q: "Pohádka často končí:",
        options: ["otazníkem", "šťastně", "tabulkou", "citací"],
        correctIndex: 1,
      },
      {
        q: "Pověst se vztahuje hlavně k:",
        options: [
          "chemickým vzorcům",
          "vysvětlení původu místa nebo jevu",
          "sportu",
          "matematice",
        ],
        correctIndex: 1,
      },
      {
        q: "Próza je:",
        options: [
          "vždy jen drama",
          "souvislý text většinou ve větách a odstavcích",
          "jen seznam slov",
          "jen nadpisy",
        ],
        correctIndex: 1,
      },
      {
        q: "Fejeton najdeš spíš:",
        options: ["v matematické učebnici", "v novinách nebo online", "na obalu jogurtu", "v rozvrhu"],
        correctIndex: 1,
      },
    ],
    studyPlan: [
      {
        label: "Den 1",
        tasks: [
          "Vypsat 4 žánry a ke každému jednu knihu nebo článek, co znáš.",
        ],
      },
      {
        label: "Den 2",
        tasks: [
          "Přečíst krátkou pohádku a napsat 3 věty: kdo, kde, problém.",
        ],
      },
      {
        label: "Den 3",
        tasks: [
          "Porovnat úryvek básně a prózy — čím se liší na první pohled?",
        ],
      },
    ],
  },
  {
    id: "prir-fotosynteza",
    subjectId: "prir",
    subjectLabel: "Přírodopis",
    topicId: "fotosynteza",
    topicLabel: "Fotosyntéza — základ",
    summary: [
      "Rostliny v listech přeměňují světelnou energii na chemickou v zelených barvivech (chlorofyl).",
      "Vzniká glukóza a kyslík; vstupem je často voda a oxid uhličitý.",
      "Bez světla většinou fotosyntéza neběží — proto rostliny ve tmě „nesvítí“ výrobou kyslíku.",
      "Kořeny přijímají vodu a minerály z půdy.",
      "Fotosyntéza je základem potravních řetězců na Zemi.",
    ],
    questions: [
      {
        q: "Hlavním zeleným barvivem v listech je:",
        options: ["hemoglobin", "chlorofyl", "škrob", "voda"],
        correctIndex: 1,
      },
      {
        q: "Který plyn rostliny často uvolňují při fotosyntéze?",
        options: ["oxid uhličitý", "dusík", "kyslík", "helium"],
        correctIndex: 2,
      },
      {
        q: "Fotosyntéza probíhá nejvíc:",
        options: ["ve tmě ve sklepě", "ve světle v listech", "v kořenech v zimě", "v kameni"],
        correctIndex: 1,
      },
      {
        q: "Voda do rostliny často vchází přes:",
        options: ["květy", "listy", "kořeny", "plody"],
        correctIndex: 2,
      },
      {
        q: "Proč je fotosyntéza důležitá pro život?",
        options: [
          "ničí kyslík",
          "vyrábí potravu a kyslík pro ekosystém",
          "snižuje teplotu oceánů",
          "přeměňuje kovy",
        ],
        correctIndex: 1,
      },
    ],
    studyPlan: [
      {
        label: "Den 1",
        tasks: [
          "Nakreslit schéma: list, slunce, šipky CO₂ a O₂ (jak umíš).",
        ],
      },
      {
        label: "Den 2",
        tasks: [
          "Najít doma 3 rostliny a říct, co potřebují k růstu.",
        ],
      },
      {
        label: "Den 3",
        tasks: [
          "Vysvětlení vlastními slovy rodiči za 60 sekund — bez čtení z papíru.",
        ],
      },
    ],
  },
  {
    id: "prir-slunecni",
    subjectId: "prir",
    subjectLabel: "Přírodopis",
    topicId: "slunecni",
    topicLabel: "Sluneční soustava",
    summary: [
      "Slunce je hvězda uprostřed soustavy; planety obíhají kolem Slunce po dráhách.",
      "Země je třetí planeta od Slunce a má jednu větší přirozenou družici — Měsíc.",
      "Planety dělíme na vnitřní kamenné a vnější plynné obry (základní přehled).",
      "Asteroidy a komety jsou menší tělesa s různými dráhami.",
      "Pořadí planet si pomůžeš zapamatovat mnemotechnickou pomůckou.",
    ],
    questions: [
      {
        q: "Třetí planeta od Slunce je:",
        options: ["Venuše", "Mars", "Země", "Jupiter"],
        correctIndex: 2,
      },
      {
        q: "Největší planetou ve sluneční soustavě je:",
        options: ["Saturn", "Jupiter", "Neptun", "Země"],
        correctIndex: 1,
      },
      {
        q: "Měsíc obíhá kolem:",
        options: ["Marsu", "Slunce přímo", "Země", "Venuše"],
        correctIndex: 2,
      },
      {
        q: "Slunce je především:",
        options: ["planeta", "hvězda", "měsíc", "kometa"],
        correctIndex: 1,
      },
      {
        q: "Jedna z vnitřních kamenných planet je:",
        options: ["Jupiter", "Saturn", "Merkur", "Uran"],
        correctIndex: 2,
      },
    ],
    studyPlan: [
      {
        label: "Den 1",
        tasks: [
          "Nakreslit Slunce a 8 planet ve správném pořadí (nemusí být měřítko).",
        ],
      },
      {
        label: "Den 2",
        tasks: [
          "Vymyslet vlastní větu na pořadí planet (např. „Můj velký …“).",
        ],
      },
      {
        label: "Den 3",
        tasks: [
          "3 otázky pro spolužáka: co je asteroid, kometa, družice?",
        ],
      },
    ],
  },
];

export function getSubjects() {
  const map = new Map<string, { id: string; label: string }>();
  for (const p of studyPresets) {
    if (!map.has(p.subjectId)) {
      map.set(p.subjectId, { id: p.subjectId, label: p.subjectLabel });
    }
  }
  return [...map.values()];
}

export function getTopicsForSubject(subjectId: string) {
  return studyPresets
    .filter((p) => p.subjectId === subjectId)
    .map((p) => ({ id: p.topicId, label: p.topicLabel, presetId: p.id }));
}

export function getPresetById(presetId: string): StudyPreset | undefined {
  return studyPresets.find((p) => p.id === presetId);
}
