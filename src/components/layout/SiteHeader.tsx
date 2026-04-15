import Link from "next/link";
import { BrandSubtitle } from "@/components/layout/BrandSubtitle";
import { site } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Kurz", emoji: "🎮" },
  { href: "/jak-probiha", label: "Jak to běží", emoji: "⚡" },
  { href: "/faq", label: "FAQ", emoji: "❓" },
  { href: "/kontakt", label: "Kontakt", emoji: "✉️" },
  { href: "/registrace", label: "Registrace", emoji: "🚀" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-[var(--magic-ink)] bg-white/90 shadow-[0_4px_0_rgba(49,46,129,0.15)] backdrop-blur-md">
      <div className="rainbow-strip h-1 w-full opacity-90" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <Link
            href="/"
            className="group mt-0.5 shrink-0 rounded-2xl border-2 border-transparent p-0.5 transition-transform hover:scale-[1.02]"
            aria-label={`${site.name} — úvod`}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-br from-[var(--magic-sun)] to-[var(--magic-coral)] text-xl shadow-[3px_3px_0_#312e81] transition-transform group-hover:-rotate-6"
              aria-hidden
            >
              ✨
            </span>
          </Link>
          <div className="min-w-0 pt-0.5">
            <Link
              href="/"
              className="group block font-display text-base font-extrabold leading-tight text-[var(--magic-ink)] transition-colors hover:text-violet-700 sm:text-lg"
            >
              {site.name}
            </Link>
            <BrandSubtitle className="mt-0.5" />
          </div>
        </div>
        <nav
          className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2"
          aria-label="Hlavní navigace"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display wiggle-hover flex items-center gap-1 rounded-xl border-2 border-[var(--magic-ink)] bg-white px-2.5 py-1.5 text-xs font-bold text-[var(--magic-ink)] shadow-[2px_2px_0_#312e81] sm:px-3 sm:text-sm"
            >
              <span aria-hidden>{item.emoji}</span>
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
