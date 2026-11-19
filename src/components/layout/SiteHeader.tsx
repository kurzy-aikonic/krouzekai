"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { Logo } from "@/components/layout/Logo";

const nav = [
  { href: "/jak-probiha", label: "O kroužku" },
  { href: "/aktualni-behy", label: "Termíny a ceny" },
  { href: "/co-deti-tvori", label: "Projekty studentů" },
  { href: "/faq", label: "Časté otázky" },
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07060f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <Logo tone="dark" />
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
              className={`font-display relative flex min-h-11 items-center whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-medium transition-colors lg:px-3 ${
                isActive(item.href)
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {isActive(item.href) ? (
                <span
                  className="absolute inset-x-2.5 -bottom-[1px] h-0.5 rounded-full bg-orange-400 lg:inset-x-3"
                  aria-hidden
                />
              ) : null}
            </Link>
          ))}
          <Link href="/registrace" className="btn-hero-outline ml-1 min-h-11 px-4 py-2 text-sm">
            Přihláška
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link href="/registrace" className="btn-hero-outline min-h-11 px-3 text-sm">
            Přihláška
          </Link>
          <button
            type="button"
            className="font-display flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-semibold text-white"
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
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            aria-label="Zavřít menu"
            onClick={closeMenu}
          />
          <nav
            id={menuId}
            className="absolute left-0 right-0 top-full z-50 max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto overscroll-contain border-b border-white/10 bg-[#0c0a14] px-3 py-3 shadow-xl md:hidden"
            aria-label="Hlavní navigace"
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`font-display flex min-h-12 items-center rounded-xl border px-4 py-3 text-base font-medium ${
                      isActive(item.href)
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-white/80"
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/kontakt"
                  className="font-display flex min-h-12 items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-medium text-white/80"
                  onClick={closeMenu}
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
