import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { BrandSubtitle } from "@/components/layout/BrandSubtitle";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { site } from "@/lib/site-config";

const legal = [
  { href: "/obchodni-podminky", label: "Obchodní podmínky", e: "📜" },
  { href: "/ochrana-osobnich-udaju", label: "Ochrana údajů", e: "🔒" },
  { href: "/cookies", label: "Cookies", e: "🍪" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t-[3px] border-[var(--magic-ink)] bg-gradient-to-b from-[#fdf4ff] to-[#e0e7ff]">
      <svg
        className="absolute -top-px left-0 w-full text-white"
        viewBox="0 0 1440 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0 48V24c120 20 240 20 360 0s240-20 360 0 240 20 360 0 240-20 360 0v24H0z"
        />
      </svg>
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
        <div className="grid gap-10 text-center md:grid-cols-12 md:items-start md:gap-8 md:text-left">
          <div className="md:col-span-8 md:max-w-none">
            <p className="font-display text-2xl font-extrabold text-[var(--magic-ink)]">
              {site.name}
            </p>
            <BrandSubtitle className="mt-1.5 text-sm sm:text-base" />
            <p className="mt-2 text-base font-semibold text-violet-900/80">
              Online kroužek AI pro děti
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Pro děti {site.audience.ageMin}–{site.audience.ageMax} let;
              skupiny skládáme podle věku, aby tempo sedělo všem. Rodiče vidí
              přehledně, co dítě získá, jak výuka probíhá a jak zajišťujeme
              bezpečné prostředí.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2 md:items-start">
              <a
                href={`mailto:${site.contactEmail}`}
                className="inline-flex max-w-full items-center gap-2 break-words rounded-xl border-2 border-[var(--magic-ink)] bg-white px-4 py-2.5 font-display text-sm font-bold text-[var(--magic-ink)] shadow-[3px_3px_0_#312e81] transition-transform hover:-translate-y-0.5"
              >
                <span aria-hidden>✉️</span>
                <span className="min-w-0 break-all">{site.contactEmail}</span>
              </a>
              <a
                href={`tel:${site.company.phoneTel}`}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-200 bg-white/90 px-4 py-2 font-display text-sm font-bold text-violet-900 shadow-[2px_2px_0_#c4b5fd] transition-transform hover:-translate-y-0.5"
              >
                <span aria-hidden>📞</span>
                {site.company.phoneDisplay}
              </a>
            </div>
            <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600">
              {site.company.legalName}
              <br />
              IČO {site.company.ic} · {site.company.addressLine}
              <br />({site.company.addressNote})
            </p>
            <p className="mt-3 text-sm font-semibold text-violet-900/90">
              Součást značky{" "}
              <a
                href={site.parentSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-extrabold text-[var(--magic-ink)] underline decoration-wavy decoration-violet-400 hover:text-violet-600"
              >
                {site.parentSite.name}
              </a>
              {" — "}
              {site.parentSite.tagline}
            </p>
            <div className="mt-4 text-center md:text-left">
              <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-800">
                Sledujte nás
              </p>
              <SocialIcons className="mt-2 justify-center md:justify-start" />
            </div>
          </div>
          <nav
            className="flex flex-col items-center gap-3 border-t-2 border-violet-200/70 pt-6 text-center md:col-span-4 md:items-start md:border-t-0 md:border-l-2 md:pt-0 md:pl-6 md:text-left"
            aria-label="Důležité odkazy"
          >
            <p className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
              Důležité odkazy
            </p>
            <Link
              href="/aktualni-behy"
              className="flex items-center gap-2 font-display text-sm font-bold text-[var(--magic-ink)] hover:text-violet-600"
            >
              <span aria-hidden>📅</span>
              Aktuální termíny
            </Link>
            <Link
              href="/rodic/prihlaseni"
              className="flex items-center gap-2 font-display text-sm font-bold text-[var(--magic-ink)] hover:text-violet-600"
            >
              <span aria-hidden>📚</span>
              Přehled pro rodiče
            </Link>
            {legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 font-display text-sm font-bold text-[var(--magic-ink)] hover:text-violet-600"
              >
                <span aria-hidden>{item.e}</span>
                {item.label}
              </Link>
            ))}
            <p className="flex flex-wrap items-center justify-center gap-2 font-display text-sm font-bold text-[var(--magic-ink)] md:justify-start">
              <span aria-hidden>⚙️</span>
              <CookieSettingsButton />
            </p>
          </nav>
        </div>
      </div>
    </footer>
  );
}
