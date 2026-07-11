import { absoluteUrl, getSiteUrl } from "@/lib/seo";

type Props = {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
};

/** Article strukturovaná data pro články v průvodci (/pruvodce). */
export function ArticleJsonLd({ title, description, path, publishedAt, updatedAt }: Props) {
  const origin = getSiteUrl().toString().replace(/\/$/, "");
  const orgId = `${origin}/#organization`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    inLanguage: "cs-CZ",
    author: { "@id": orgId },
    publisher: { "@id": orgId },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
