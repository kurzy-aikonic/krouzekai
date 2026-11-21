import Link from "next/link";
import { HeroClient } from "@/components/home/HeroClient";
import { HeroPlay } from "@/components/home/HeroPlay";
import { ReferenceScene } from "@/components/home/ReferenceScene";
import { Icon } from "@/components/icons/Icon";
import { heroMedia } from "@/data/hero-media";
import { pilotFeedbackQuotes } from "@/data/real-student-outcomes";
import { formatCzk } from "@/lib/format-czk";
import { site } from "@/lib/site-config";

type Prices = {
  skupinaCourseCzk: number;
  individualCourseCzk: number;
  skupinaPerLessonCzk: number;
  individualPerLessonCzk: number;
};

function studentsInGroup(count: number): string {
  if (count === 1) return "Nejvýš 1 student ve skupině";
  if (count >= 2 && count <= 4) return `Nejvýš ${count} studenti ve skupině`;
  return `Nejvýš ${count} studentů ve skupině`;
}

export function HomeHero({ hasRuns }: { hasRuns: boolean }) {
  // Čísla jsou v site.pricing a v popisech termínů už na hlavní větvi
  // (skupina max. 6, 10 lekcí, 60 minut). „Hotový projekt“ je cíl kurzu v datech výstupů.
  const facts = [
    studentsInGroup(site.pricing.groupMaxStudents),
    `${site.pricing.lessons} lekcí po ${site.pricing.lessonMinutes} minutách`,
    "Hotový projekt na konci kurzu",
  ];

  return (
    <section id="uvod" className="hero-shell relative overflow-hidden text-white">
      <canvas id="hero-grid" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
      <HeroClient />
      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:min-h-[34rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-4 lg:pb-12 lg:pt-10">
        <div className="relative z-10 max-w-xl">
          <p className="hero-eyebrow mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" aria-hidden />
            {hasRuns
              ? "Jaro 2027 · úterý nebo čtvrtek, 16:00–17:00"
              : "Jaro 2027 · termíny připravujeme"}
          </p>
          <h1 className="font-display text-[2.05rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.35rem]">
            Postav si vlastní
            <br />
            hru, aplikaci
            <br />
            <span className="hero-gradient">nebo AI projekt</span>
          </h1>
          <p className="hero-terminal mt-4" aria-label="Ukázka zadání">
            <span className="hero-terminal-prompt" aria-hidden>› </span>
            <span className="hero-type">Udělej mi hru, kde uhýbám asteroidům</span>
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Online kroužek. Doporučený věk je {site.audience.ageMin} až{" "}
            {site.audience.ageMax} let, jiný věk domluvíme. V malé skupině s lektorem si studenti
            navrhnou a postaví vlastní projekt a naučí se s umělou inteligencí
            pracovat tak, aby jim opravdu pomáhala.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="#terminy" className="btn-hero-primary w-full sm:w-auto">
              {hasRuns ? "Vybrat termín" : "Chci informace o jarních termínech"}
              <span aria-hidden> →</span>
            </Link>
            <Link href="/jak-probiha" className="btn-hero-outline w-full sm:w-auto">
              Jak kroužek probíhá
            </Link>
          </div>
          <div className="mt-4">
            <HeroPlay />
          </div>
          <ul className="mt-5 flex flex-col gap-1.5 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span className="h-1 w-1 shrink-0 rounded-full bg-violet-300" aria-hidden />
                {fact}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-visual relative z-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%]">
          <picture>
            <source
              type="image/avif"
              srcSet={heroMedia.avifSrcSet}
              sizes={heroMedia.sizes}
            />
            <source
              type="image/webp"
              srcSet={heroMedia.webpSrcSet}
              sizes={heroMedia.sizes}
            />
            <img
              src={heroMedia.src}
              srcSet={heroMedia.jpgSrcSet}
              sizes={heroMedia.sizes}
              alt={heroMedia.alt}
              width={heroMedia.width}
              height={heroMedia.height}
              fetchPriority="high"
              decoding="async"
              className="hero-photo hero-assemble h-auto max-h-[200px] w-full object-contain object-right sm:max-h-[240px] lg:absolute lg:inset-0 lg:h-full lg:max-h-none lg:object-cover lg:object-[72%_center]"
            />
          </picture>
          <img
            src={heroMedia.islandSrc}
            srcSet={heroMedia.islandSrcSet}
            sizes={heroMedia.sizes}
            alt=""
            aria-hidden
            width={heroMedia.width}
            height={heroMedia.height}
            decoding="async"
            className="hero-island hero-assemble object-contain object-right lg:object-cover lg:object-[72%_center]"
          />
        </div>
      </div>
    </section>
  );
}

export function PricingCards({ prices }: { prices: Prices }) {
  const lessons = site.pricing.lessons;
  return (
    <div className="mt-8">
      <h3 className="font-display text-xl font-extrabold text-[var(--magic-ink)]">
        Kolik kurz stojí
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-violet-200 bg-violet-50/60 p-5 sm:p-6">
          <p className="text-sm font-bold text-violet-800">Nejčastější volba</p>
          <h4 className="font-display mt-1 text-2xl font-extrabold text-[var(--magic-ink)]">
            Skupina do {site.pricing.groupMaxStudents} lidí
          </h4>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-slate-900">
            {formatCzk(prices.skupinaCourseCzk)} za celý kurz (
            {formatCzk(prices.skupinaPerLessonCzk)} za lekci)
          </p>
          <p className="mt-1 text-sm text-slate-600">{lessons} lekcí po 60 minutách</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-sm font-bold text-slate-600">Jeden účastník a lektor</p>
          <h4 className="font-display mt-1 text-2xl font-extrabold text-[var(--magic-ink)]">
            Individuálně 1:1
          </h4>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-slate-900">
            {formatCzk(prices.individualCourseCzk)} za celý kurz (
            {formatCzk(prices.individualPerLessonCzk)} za lekci)
          </p>
          <p className="mt-1 text-sm text-slate-600">{lessons} lekcí po 60 minutách</p>
        </article>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {site.pricing.vatNote} Cena je konečná.
      </p>
    </div>
  );
}

const safety = [
  {
    icon: "bot" as const,
    text: "Účastníci pracují s AI pod vedením lektora a vědí, co do nástroje nepatří.",
  },
  {
    icon: "lock" as const,
    text: "Lekce jsou online. Odkaz na hodinu dostanou jen přihlášení, a to před začátkem.",
  },
  {
    icon: "shield" as const,
    text: "Z lekcí neděláme veřejné záznamy. Když lekci nahráváme, je to jen pro kontrolu kvality a jen s vaším souhlasem.",
  },
];

export function SafetySection() {
  return (
    <section className="mt-16" aria-labelledby="safety-heading">
      <h2
        id="safety-heading"
        className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
      >
        Jak hlídáme bezpečí
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {safety.map((item) => (
          <li
            key={item.text}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-800">
              <Icon name={item.icon} />
            </span>
            <p className="mt-4 text-base leading-relaxed text-slate-800">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const learnItems = [
  {
    icon: "spark" as const,
    title: "Vibecoding",
    text: "Zadání pro AI, ze kterého vznikne funkční projekt, ne jen nápad na papíře.",
  },
  {
    icon: "message" as const,
    title: "Jak se AI správně ptát",
    text: "Říct nástroji, co přesně má udělat, a poznat, kdy odpověď nedává smysl.",
  },
  {
    icon: "gamepad" as const,
    title: "Návrh vlastní hry",
    text: "Společně vymyslí postavy, pravidla a úrovně a hru si spustí v prohlížeči.",
  },
  {
    icon: "image" as const,
    title: "Tvorba vizuálů",
    text: "K projektu si připraví grafiku, postavy a pozadí v jednotném stylu.",
  },
  {
    icon: "bot" as const,
    title: "Vlastní AI asistent",
    text: "Postaví asistenta na konkrétní úkol, třeba na přípravu do školy nebo na vlastní projekt.",
  },
  {
    icon: "shield" as const,
    title: "Bezpečnost a etika",
    text: "Ví, co se do AI smí napsat, co ne, a proč je potřeba výsledek ověřit.",
  },
];

export function LearnSection() {
  return (
    <section className="mt-16" aria-labelledby="learn-heading">
      <h2
        id="learn-heading"
        className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
      >
        Co se v kroužku dělá
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
        Každé téma končí hotovou věcí. Programovat předem není potřeba.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learnItems.map((item) => (
          <li
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
              <Icon name={item.icon} />
            </span>
            <h3 className="font-display mt-4 text-xl font-extrabold text-[var(--magic-ink)]">
              {item.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PilotStory() {
  const quote = pilotFeedbackQuotes[0];
  return (
    <section className="mt-16" aria-labelledby="pilot-heading">
      <h2
        id="pilot-heading"
        className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
      >
        Co vzniklo v pilotním kurzu
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-800 sm:text-lg">
        Na jaře 2026 jsme kurz vyzkoušeli s patnáctiletým žákem. Během první
        lekce měl hotovou jednoduchou hru v prohlížeči a do konce kurzu si
        postavil vlastní web.
      </p>
      <div className="ref-card mt-6 grid items-start gap-6 rounded-3xl border border-white/10 bg-[#100d18] p-5 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
        <ReferenceScene />
        <div>
          <ul className="space-y-3 text-base leading-relaxed text-white/80">
            <li>
              <span className="font-bold text-white">Co vytvořil. </span>
              Jednoduchou hru v prohlížeči hned na první lekci a do konce kurzu vlastní web.
            </li>
            <li>
              <span className="font-bold text-white">Co se naučil. </span>
              Skládat zadání tak, aby z obecného nápadu vznikl konkrétní plán, a ověřovat, jestli odpověď AI dává smysl.
            </li>
            <li>
              <span className="font-bold text-white">Co řekl. </span>
              „{quote.answer}“
            </li>
          </ul>
          <p className="mt-4 text-sm text-white/60">
            Anonymní zpětná vazba absolventa pilotu, 15 let.{" "}
            <Link href="/co-deti-tvori" className="font-bold text-orange-300 underline decoration-orange-400/40 underline-offset-4">
              Celý příběh kurzu
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "1",
    title: "Vyplníte přihlášku",
    text: "Zabere to asi minutu. Napíšete údaje o účastníkovi a kontakt na sebe.",
  },
  {
    n: "2",
    title: "Ozveme se a potvrdíme skupinu",
    text: "Podle věku složíme skupinu a napíšeme vám, jestli termín běží.",
  },
  {
    n: "3",
    title: "Pošleme fakturu a odkaz",
    text: "Jakmile je skupina plná, pošleme fakturu a před první lekcí odkaz na hodinu.",
  },
];

export function AfterSignup() {
  return (
    <section className="mt-16" aria-labelledby="after-heading">
      <h2
        id="after-heading"
        className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
      >
        Jak to proběhne po přihlášce
      </h2>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-display text-sm font-extrabold text-violet-700">Krok {step.n}</p>
            <h3 className="font-display mt-2 text-xl font-extrabold text-[var(--magic-ink)]">
              {step.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FinalCta({ hasRuns }: { hasRuns: boolean }) {
  return (
    <section className="mt-16 rounded-3xl bg-gradient-to-br from-violet-800 to-indigo-900 px-6 py-12 text-center sm:px-10 sm:py-14">
      <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
        {hasRuns ? "Vyberte termín a přihlaste se" : "Dejte nám vědět, až otevřeme jaro"}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-violet-100 sm:text-lg">
        {hasRuns
          ? "Do potvrzení skupiny nic neplatíte. Přihlášku do té doby zrušíte e-mailem."
          : "Nechte kontakt u termínů výše. Ozveme se vám, ještě než jarní běh zveřejníme."}
      </p>
      <Link
        href={hasRuns ? "/registrace" : "#terminy"}
        className="btn-magic mt-8 w-full max-w-sm sm:w-auto"
      >
        {hasRuns ? "Přihlásit na kroužek" : "Chci vědět o termínech"}
      </Link>
    </section>
  );
}
