import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Přehled pro rodiče",
  description:
    "Přihlášení rodičů: přehled přihlášek, termínů a plateb u Kroužku umělé inteligence.",
  path: "/rodic",
  noIndex: true,
});

export default function RodicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-shell text-slate-900">
      <header className="portal-header print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="min-w-0">
            <Link
              href="/rodic"
              className="font-display text-sm font-extrabold tracking-tight text-violet-900 hover:text-violet-700"
            >
              Přehled pro rodiče
            </Link>
            <p className="mt-0.5 hidden text-[11px] font-medium text-slate-500 sm:block">
              Termíny, platby, stav přihlášky
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:text-sm"
          >
            Úvod webu
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-2 sm:px-6 sm:pb-16 sm:pt-4">
        {children}
      </div>
    </div>
  );
}
