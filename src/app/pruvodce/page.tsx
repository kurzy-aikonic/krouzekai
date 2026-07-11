import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { guideArticles } from "@/data/guide-articles";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Průvodce pro rodiče — AI a děti",
  description:
    "Praktické články pro rodiče o AI a dětech: bezpečnost ChatGPT, vibecoding, výběr online kroužku a další srozumitelně vysvětlená témata.",
  path: "/pruvodce",
  keywords: ["AI a děti průvodce", "chatgpt pro děti bezpečnost"],
});

export default function GuideIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Průvodce pro rodiče", path: "/pruvodce" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-6 sm:py-16">
        <h1 className="page-h1">Průvodce pro rodiče</h1>
        <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed">
          Krátké a srozumitelné články o AI, dětech a online vzdělávání — bez
          zbytečného žargonu.
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {guideArticles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/pruvodce/${article.slug}`}
                className="card-playful block h-full bg-white transition-transform hover:-translate-y-0.5"
              >
                <p className="font-display text-lg font-extrabold leading-snug text-[var(--magic-ink)]">
                  {article.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {article.summary}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-violet-700">
                  {article.readingMinutes} min čtení
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
