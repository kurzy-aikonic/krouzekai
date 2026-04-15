import type { Metadata } from "next";
import Link from "next/link";
import { HomeInteractiveDemos } from "@/components/playful/HomeInteractiveDemos";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { Section } from "@/components/ui/Section";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: site.name,
  description: metaDescriptions.home,
  path: "/",
});

const learnItems = [
  {
    emoji: "🎨",
    title: "Vibecoding",
    text: "Řekneš AI, co chceš — a ona ti pomůže složit hru, appku nebo web.",
    example: "Např. „Udělej mi pixelovou hru, kde sbírám hvězdy.“",
    accent: "from-violet-400 to-fuchsia-400",
    border: "border-violet-500",
  },
  {
    emoji: "💬",
    title: "Prompt engineering",
    text: "Naučíš se mluvit s AI tak, aby rozuměla přesně tobě.",
    example: "Např. přidat pravidla stylu, délku odpovědi, bezpečnost.",
    accent: "from-sky-400 to-cyan-400",
    border: "border-sky-500",
  },
  {
    emoji: "🕹️",
    title: "AI game design",
    text: "Nápady na levely, postavy a mechaniky — s AI jako spoluhráčem.",
    example: "Např. generování nápadů na nepřátele a odměny.",
    accent: "from-amber-400 to-orange-400",
    border: "border-amber-500",
  },
  {
    emoji: "🖼️",
    title: "Tvorba vizuálů",
    text: "Grafika, postavy, pozadí — všechno pro tvůj vlastní projekt.",
    example: "Např. styl „komiksový vesmír“ pro celou hru.",
    accent: "from-emerald-400 to-teal-400",
    border: "border-emerald-500",
  },
  {
    emoji: "🤖",
    title: "Vlastní AI asistent",
    text: "Mini chatbot nebo pomocník na přesně to, co zrovna řešíš.",
    example: "Např. asistent na učení slovíček nebo plánování úkolů.",
    accent: "from-rose-400 to-pink-400",
    border: "border-rose-500",
  },
  {
    emoji: "🛡️",
    title: "Bezpečnost a etika",
    text: "Co je v pohodě sdílet, co ne — a kdy AI věřit.",
    example: "Např. fakt vs. halucinace, soukromí, respekt k druhým.",
    accent: "from-indigo-400 to-violet-400",
    border: "border-indigo-500",
  },
] as const;

const outcomes = [
  { t: "Vlastní appku, hru nebo web — bez psaní kódu řádek po řádku.", e: "🏆" },
  { t: "Jistotu v ChatGPT, Claude a dalších nástrojích.", e: "🧠" },
  { t: "Projekty, které ukážeš kamarádům, rodičům i učitelům.", e: "🌟" },
  { t: "Víš, kdy AI pomůže a kdy je potřeba myslet vlastní hlavou.", e: "⚖️" },
] as const;

export default function HomePage() {
  const p = site.pricing;
  return (
    <>
      <HomeJsonLd />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <header className="relative">
          <div className="float-slow absolute -right-4 top-0 text-4xl sm:right-8 sm:text-5xl" aria-hidden>
            🚀
          </div>
          <div className="float-delay absolute -left-2 top-24 text-3xl sm:left-4 sm:text-4xl" aria-hidden>
            🎮
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--magic-ink)] bg-white px-4 py-1.5 font-display text-sm font-bold text-[var(--magic-ink)] shadow-[3px_3px_0_#312e81]">
            <span aria-hidden>👨‍👩‍👧</span>
            Pro rodiče přehledně • Pro děti jako z arcade hry
          </div>

          <h1 className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient-magic">Postav si vlastní hru,</span>
            <br />
            <span className="text-[var(--magic-ink)]">appku nebo web</span>
            <br />
            <span className="text-2xl font-bold text-violet-700 sm:text-3xl lg:text-4xl">
              — s AI, bez nudného programování ✨
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-slate-800 sm:text-xl">
            Pro zvídavé tvůrce{" "}
            <span className="rounded-lg bg-[var(--magic-sun)] px-2 py-0.5 font-display text-[var(--magic-ink)]">
              {site.audience.ageMin}–{site.audience.ageMax} let
            </span>
            . Skupiny skládáme podle věku — tempo i témata ladíme na konkrétní
            segment, ne na jeden univerzální mix. Skupinka max.{" "}
            {p.groupMaxStudents} nebo kurz 1:1. Žádná suchá teorie — jen nápad,
            AI a{" "}
            <span className="underline decoration-wavy decoration-[var(--magic-pink)] decoration-2">
              hotová věc
            </span>
            , kterou si můžeš osahat.
          </p>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-violet-900 sm:text-base">
            Právě otevíráme první běhy — žádné vymyšlené recenze, jen jasná
            nabídka. Po přihlášce s vámi domluvíme termín a věkový blok
            individuálně.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/registrace" className="btn-magic">
              Chci se přihlásit 🚀
            </Link>
            <Link href="/jak-probiha" className="btn-magic-outline">
              Jak probíhá lekce
            </Link>
          </div>
        </header>

        {/* Rodičovský pruh */}
        <div className="mt-14 rounded-3xl border-[3px] border-dashed border-violet-400 bg-white/80 p-5 shadow-[6px_6px_0_rgba(49,46,129,0.12)] backdrop-blur-sm sm:p-6">
          <p className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-700">
            Psst, rodiče 👋
          </p>
          <p className="mt-2 text-base leading-relaxed text-slate-800">
            Tenhle web vypadá „dětsky“ schválně — stejně jako chceme, aby děti
            vnímaly kurz: hra, tvoření, radost. Pod kapotou je pořád všechno
            srozumitelně a bezpečně. Kroužky vedeme ve věkových blocích; přesné
            rozmezí k danému termínu vám potvrdíme — jde nám o to, aby byl kurz
            pro každého srozumitelný a zároveň dostatečně výživný. A ano —
            přesně takhle se dá dnes stavět web: barvy, animace, typografie… o
            tom na kroužku taky mluvíme. Kurzy teprve startujeme — až budeme mít
            první hotové běhy, přidáme na web férové ohlasy a ukázky projektů od
            dětí.
          </p>
        </div>

        <Section
          title="Jak to proběhne po přihlášce"
          intro="Jednoduše, krok za krokem. Bez složitostí."
          className="mt-16"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-playful bg-white">
              <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-700">
                Krok 1
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
                Odešlete přihlášku
              </p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
                Vyplníte dítě + kontakt na rodiče. Zabere to pár minut.
              </p>
            </div>
            <div className="card-playful bg-white">
              <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-700">
                Krok 2
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
                Ozveme se a doladíme termín
              </p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
                Podle věku, zájmu a dostupnosti domluvíme nejvhodnější běh.
              </p>
            </div>
            <div className="card-playful bg-white">
              <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-700">
                Krok 3
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
                Faktura, platba a start kurzu
              </p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
                Po domluvě zašleme fakturu; po úhradě potvrdíme místo a pošleme
                organizační info k první lekci.
              </p>
            </div>
          </div>
        </Section>

        <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-10">
          <Section
            title="Co se děti naučí"
            intro="Každý bod je jako level v hře — na konci máš skill, který použiješ na vlastním projektu."
            className="lg:col-span-2"
          >
            <ul className="grid gap-4 sm:grid-cols-2">
              {learnItems.map((item) => (
                <li
                  key={item.title}
                  className={`card-playful group relative overflow-hidden border-l-8 ${item.border}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-40 blur-2xl transition-opacity group-hover:opacity-60 ${item.accent}`}
                    aria-hidden
                  />
                  <div className="relative flex items-start gap-3">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--magic-ink)] bg-gradient-to-br text-2xl shadow-[2px_2px_0_#312e81] from-white to-violet-50"
                      aria-hidden
                    >
                      {item.emoji}
                    </span>
                    <div>
                      <p className="font-display text-lg font-extrabold text-[var(--magic-ink)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">
                        {item.text}
                      </p>
                      <p className="mt-3 rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/80 px-3 py-2 text-xs font-semibold leading-snug text-violet-900">
                        {item.example}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card-playful relative overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50">
              <div className="absolute -right-6 top-2 rotate-12 font-display text-6xl opacity-20" aria-hidden>
                💰
              </div>
              <h2 className="font-display text-xl font-extrabold text-[var(--magic-ink)]">
                Ceny
              </h2>
              <p className="mt-2 text-xs font-semibold text-violet-800">
                {p.lessons} lekcí × {p.lessonMinutes} min · vždy online
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                <span className="rounded-md bg-white/80 px-1">Skupina</span>{" "}
                {p.skupinaPerLesson} Kč / lekce →{" "}
                <span className="font-display text-lg text-violet-700">
                  {p.skupinaCourse} Kč
                </span>{" "}
                kurz
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                <span className="rounded-md bg-white/80 px-1">1:1</span>{" "}
                {p.individualPerLesson} Kč / lekce →{" "}
                <span className="font-display text-lg text-violet-700">
                  {p.individualCourse} Kč
                </span>{" "}
                kurz
              </p>
              <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600">
                Skupina: termín domluvíme po registraci. Kurz spustíme od{" "}
                {p.groupMinStudentsToOpen} přihlášených, ve skupině nejvýše{" "}
                {p.groupMaxStudents} dětí.
              </p>
              <p className="mt-2 text-xs font-medium text-slate-600">{p.vatNote}</p>
              <Link href="/registrace" className="btn-magic mt-5 w-full text-center">
                Jdu do toho!
              </Link>
            </div>

            <div className="card-playful bg-gradient-to-br from-cyan-50 to-sky-100">
              <h2 className="font-display flex items-center gap-2 text-xl font-extrabold text-[var(--magic-ink)]">
                <span aria-hidden>🎒</span> Co sbalit
              </h2>
              <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-800">
                <li className="flex items-center gap-2">
                  <span className="text-lg">💻</span> Notebook nebo tablet
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">⌨️</span> Umíš psát a klikat v prohlížeči
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">🚫</span> Žádný Python, žádný strach
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <Section
          title="Co si odneseš domů"
          intro="Cíl kurzu — něco, co půjde ukázat. Konkrétní projekt doladíme podle věku a tempa skupiny."
          className="mt-20"
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            {outcomes.map((o) => (
              <li
                key={o.t}
                className="flex gap-4 rounded-3xl border-[3px] border-[var(--magic-ink)] bg-white p-5 shadow-[5px_5px_0_#312e81] transition-transform hover:-translate-y-1"
              >
                <span className="text-3xl" aria-hidden>
                  {o.e}
                </span>
                <span className="font-medium leading-relaxed text-slate-800">
                  {o.t}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Pro koho to je" className="mt-20">
          <div className="rounded-3xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-r from-fuchsia-50 via-white to-amber-50 p-6 sm:p-8">
            <p className="text-lg font-medium leading-relaxed text-slate-800">
              Pro děti {site.audience.ageMin} až {site.audience.ageMax} let,
              které milují technologie a chtějí <strong>tvořit</strong>, ne jen
              scrollovat. Skupiny dělíme podle věku, aby úroveň seděla všem v
              kurzu — žádný univerzální „one size fits all“. Není to klasický
              kurz programování — tady stavíš věci s AI. Rodiče u toho dostanou
              klid: všechno vysvětlíme lidsky a bezpečně.
            </p>
          </div>
        </Section>

        <Section title="Kdo to vede" className="mt-20">
          <div className="card-playful max-w-2xl bg-gradient-to-br from-violet-50 to-indigo-100">
            <p className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-700">
              {site.lektor.role}
            </p>
            <p className="mt-3 font-medium leading-relaxed text-slate-800">
              {site.lektor.bioShort}
            </p>
            <p className="mt-4 font-medium leading-relaxed text-slate-800">
              S dětmi pracujeme nejradši — nemají zábrany a jdou do toho po
              hlavě. Přesně jak má být. 🎯
            </p>
          </div>
        </Section>

        {/* Meta: jak je web postavený */}
        <section className="mt-20 rounded-[2rem] border-[3px] border-[var(--magic-ink)] bg-[var(--magic-ink)] p-1 shadow-[8px_8px_0_rgba(0,0,0,0.2)]">
          <div className="rounded-[1.65rem] bg-gradient-to-br from-white via-violet-50 to-amber-50 px-6 py-8 sm:px-10 sm:py-10">
            <h2 className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl">
              Kouzlo tohohle webu? 🪄
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
              Animované pozadí, barevné karty, vlastní fonty, klikací hvězdičky —
              to všechno jsou stavební kameny moderního webu. Na kurzu ukážeme, jak
              podobné věci vznikají (a jak si podobné „kouzlo“ můžeš postavit ty
              s pomocí AI).
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {["Animace", "Barvy & gradienty", "Typografie", "Layout", "Interakce"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border-2 border-[var(--magic-ink)] bg-white px-3 py-1 font-display text-xs font-bold text-[var(--magic-ink)] shadow-[2px_2px_0_#312e81]"
                  >
                    {tag}
                  </span>
                ),
              )}
            </ul>
          </div>
        </section>

        <HomeInteractiveDemos />

        {/* CTA */}
        <div className="relative mt-20 overflow-hidden rounded-[2rem] text-center">
          <div className="rainbow-strip absolute inset-0 opacity-90" aria-hidden />
          <div className="relative m-[3px] rounded-[1.85rem] bg-[var(--magic-ink)] px-6 py-12 sm:px-10 sm:py-14">
            <h2 className="font-display text-2xl font-extrabold text-white sm:text-4xl">
              Přidej se k prvním běhům
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base font-medium text-violet-200">
              Vyplň přihlášku — ozveme se a domluvíme termín i formát. Jednoduchý
              quest. 🗺️
            </p>
            <Link
              href="/registrace"
              className="mt-8 inline-flex items-center justify-center rounded-2xl border-[3px] border-white bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 px-8 py-4 font-display text-lg font-extrabold text-[var(--magic-ink)] shadow-[4px_4px_0_rgba(255,255,255,0.5)] transition-transform hover:scale-[1.05] active:scale-[0.98]"
            >
              Start registrace! 🚀
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
