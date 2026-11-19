import Image from "next/image";
import Link from "next/link";
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

export function HomeHero({ hasRuns }: { hasRuns: boolean }) {
  return (
    <header className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <h1 className="font-display max-w-3xl text-[2rem] font-extrabold leading-[1.12] tracking-tight text-[var(--magic-ink)] sm:text-5xl lg:text-[3.15rem]">
          Vlastní hra nebo web.{" "}
          <span className="text-violet-700">Postavené s AI.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-slate-800 sm:text-xl">
          Online kroužek pro teenagery od {site.audience.ageMin} do{" "}
          {site.audience.ageMax} let. Skupina nejvýš {site.pricing.groupMaxStudents}{" "}
          lidí, deset hodinových lekcí a na konci projekt, který jde ukázat doma
          i ve škole.
        </p>
        <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
          <Link
            href={hasRuns ? "#terminy" : "#terminy"}
            className="btn-magic w-full sm:w-auto"
          >
            {hasRuns ? "Vybrat termín" : "Chci vědět o termínech"}
          </Link>
          <Link href="/test-urovne-ai" className="btn-magic-outline w-full sm:w-auto">
            Zjistit úroveň zdarma
          </Link>
        </div>
        <p className="mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-slate-700 sm:text-base">
          Provozuje {site.company.legalName}
          {" · "}Skupiny podle věku
          {" · "}AI pod vedením lektora
          {" · "}Platba až po potvrzení skupiny
        </p>
      </div>
      <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
        <div className="overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-[0_20px_45px_-18px_rgba(109,40,217,0.45)]">
          <Image
            src={heroMedia.src}
            alt={heroMedia.alt}
            width={heroMedia.width}
            height={heroMedia.height}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="h-auto w-full"
            priority
          />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Ilustrační náhled. Takhle může vypadat hra z kroužku.
        </p>
      </div>
    </header>
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
      <div className="mt-6 grid items-start gap-6 rounded-3xl border border-violet-200 bg-white p-5 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
        <div className="overflow-hidden rounded-2xl border border-violet-100 bg-violet-50">
          <Image
            src="/projects/project-vlastni-web.png"
            alt="Ilustrace webové stránky, jakou si účastník v kurzu postavil"
            width={900}
            height={600}
            className="h-auto w-full"
          />
        </div>
        <div>
          <ul className="space-y-3 text-base leading-relaxed text-slate-800">
            <li>
              <span className="font-bold text-slate-950">Co vytvořil. </span>
              Jednoduchou hru v prohlížeči hned na první lekci a do konce kurzu vlastní web.
            </li>
            <li>
              <span className="font-bold text-slate-950">Co se naučil. </span>
              Skládat zadání tak, aby z obecného nápadu vznikl konkrétní plán, a ověřovat, jestli odpověď AI dává smysl.
            </li>
            <li>
              <span className="font-bold text-slate-950">Co řekl. </span>
              „{quote.answer}“
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Anonymní zpětná vazba absolventa pilotu, 15 let.{" "}
            <Link href="/co-deti-tvori" className="font-bold text-violet-800 underline decoration-violet-300 underline-offset-4">
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
