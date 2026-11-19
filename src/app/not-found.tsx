import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stránka nenalezena",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-bold text-violet-800">Chyba 404</p>
      <h1 className="page-h1 mt-2">Tuhle stránku jsme nenašli</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">
        Adresa neexistuje, nebo jsme ji přesunuli. Vraťte se na úvod, podívejte
        se na termíny, nebo nám napište.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/" className="btn-magic">
          Na úvod
        </Link>
        <Link href="/aktualni-behy" className="btn-magic-outline">
          Termíny a ceny
        </Link>
        <Link href="/kontakt" className="btn-magic-outline">
          Kontakt
        </Link>
      </div>
    </div>
  );
}
