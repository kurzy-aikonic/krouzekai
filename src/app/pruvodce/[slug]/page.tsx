import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getGuideArticleBySlug, guideArticles } from "@/data/guide-articles";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guideArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideArticleBySlug(slug);
  if (!article) return pageMetadata({ title: "Článek nenalezen", description: "", path: "/pruvodce" });

  return pageMetadata({
    title: article.metaTitle,
    description: article.description,
    path: `/pruvodce/${article.slug}`,
    keywords: article.keywords,
  });
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getGuideArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Průvodce pro rodiče", path: "/pruvodce" },
          { name: article.title, path: `/pruvodce/${article.slug}` },
        ]}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        path={`/pruvodce/${article.slug}`}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
      />
      <article className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
          Průvodce pro rodiče · {article.readingMinutes} min čtení
        </p>
        <h1 className="page-h1 mt-2">{article.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">{article.summary}</p>

        <div className="legal-prose mt-10 max-w-none">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-violet-200 bg-violet-50/60 p-6">
          <p className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
            Užitečné odkazy
          </p>
          <ul className="mt-3 space-y-2">
            {article.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-semibold text-violet-700 underline hover:text-violet-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-900 to-indigo-900 px-6 py-8 text-center sm:px-10">
          <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
            Chcete dítě přihlásit na kroužek AI?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-violet-100">
            Přihláška je nezávazná. Po registraci domluvíme formát, termín i
            tempo podle věku a úrovně dítěte.
          </p>
          <Link
            href="/registrace"
            className="btn-magic mt-5 inline-flex min-h-11 items-center justify-center px-8"
          >
            Nezávazně přihlásit dítě
          </Link>
        </div>

        <p className="mt-8">
          <Link href="/pruvodce" className="font-semibold text-violet-700 underline hover:text-violet-900">
            ← Zpět na přehled průvodce
          </Link>
        </p>
      </article>
    </>
  );
}
