"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { BrandSubtitle } from "@/components/layout/BrandSubtitle";
import { site } from "@/lib/site-config";

const nav = [
  { href: "/", label: "O kurzu" },
  { href: "/test-urovne-ai", label: "AI test" },
  { href: "/co-deti-tvori", label: "Co děti tvoří" },
  { href: "/jak-probiha", label: "Jak kroužek probíhá" },
  { href: "/faq", label: "Časté otázky" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
    <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
          <Link
            href="/"
            className="group mt-0.5 shrink-0 rounded-2xl border border-transparent p-0.5 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            aria-label={`${site.name} — úvod`}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-100 text-lg shadow-sm transition-transform group-hover:rotate-3 sm:h-11 sm:w-11 sm:text-xl"
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
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`font-display relative flex min-h-10 items-center whitespace-nowrap rounded-xl px-2.5 py-2 text-[11px] font-bold transition-colors lg:px-3 lg:text-sm ${
                isActive(item.href)
                  ? "text-violet-900"
                  : "text-slate-700 hover:text-violet-800"
              }`}
            >
              <span>{item.label}</span>
              {isActive(item.href) ? (
                <span
                  className="absolute inset-x-2.5 -bottom-[1px] h-[3px] rounded-full bg-violet-600 lg:inset-x-3"
                  aria-hidden
                />
              ) : null}
            </Link>
          ))}
          <Link href="/registrace" className="btn-magic ml-1 min-h-10 px-4 py-2 text-[11px] lg:px-5 lg:text-sm">
            Registrace
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link href="/registrace" className="btn-magic min-h-11 px-4 text-sm">
            Registrace
          </Link>
          <button
            type="button"
            className="font-display flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 shadow-sm"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
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
            className="absolute left-0 right-0 top-full z-50 max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto overscroll-contain border-b border-violet-100 bg-white px-3 py-3 shadow-xl md:hidden"
            aria-label="Hlavní navigace"
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`font-display flex min-h-12 items-center rounded-xl border px-4 py-3 text-base font-bold active:bg-violet-50 ${
                      isActive(item.href)
                        ? "border-violet-300 bg-violet-50 text-violet-900"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                    onClick={closeMenu}
                  >
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
