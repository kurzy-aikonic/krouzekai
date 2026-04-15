"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
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
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    // Zavřít mobilní menu při změně stránky (jinak může zůstat body { overflow: hidden }).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- navigace Next.js
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className="relative sticky top-0 z-40 border-b-[3px] border-[var(--magic-ink)] bg-white/90 shadow-[0_4px_0_rgba(49,46,129,0.15)] backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="rainbow-strip h-1 w-full opacity-90" aria-hidden />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
          <Link
            href="/"
            className="group mt-0.5 shrink-0 rounded-2xl border-2 border-transparent p-0.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label={`${site.name} — úvod`}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-br from-[var(--magic-sun)] to-[var(--magic-coral)] text-lg shadow-[3px_3px_0_#312e81] transition-transform group-hover:-rotate-6 sm:h-11 sm:w-11 sm:text-xl"
              aria-hidden
            >
              ✨
            </span>
          </Link>
          <div className="min-w-0 pt-0.5">
            <Link
              href="/"
              className="group block font-display text-[0.95rem] font-extrabold leading-tight text-[var(--magic-ink)] transition-colors hover:text-violet-700 sm:text-lg"
            >
              {site.name}
            </Link>
            <BrandSubtitle className="mt-0.5 sm:mt-0.5" />
          </div>
        </div>

        <nav
          className="hidden flex-wrap items-center justify-end gap-1.5 md:flex md:gap-2"
          aria-label="Hlavní navigace"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display wiggle-hover flex min-h-10 items-center gap-1 rounded-xl border-2 border-[var(--magic-ink)] bg-white px-2.5 py-2 text-xs font-bold text-[var(--magic-ink)] shadow-[2px_2px_0_#312e81] sm:px-3 sm:text-sm"
            >
              <span aria-hidden>{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="font-display flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--magic-ink)] bg-white text-sm font-extrabold text-[var(--magic-ink)] shadow-[2px_2px_0_#312e81] md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/35 md:hidden"
            aria-label="Zavřít menu"
            onClick={closeMenu}
          />
          <nav
            id={menuId}
            className="absolute left-0 right-0 top-full z-50 max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto overscroll-contain border-b-[3px] border-[var(--magic-ink)] bg-white px-3 py-3 shadow-lg md:hidden"
            aria-label="Hlavní navigace"
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display flex min-h-12 items-center gap-3 rounded-xl border-2 border-[var(--magic-ink)] bg-white px-4 py-3 text-base font-bold text-[var(--magic-ink)] shadow-[2px_2px_0_#312e81] active:bg-violet-50"
                    onClick={closeMenu}
                  >
                    <span className="text-xl" aria-hidden>
                      {item.emoji}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
