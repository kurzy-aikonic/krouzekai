import type { MetadataRoute } from "next";
import { guideArticles } from "@/data/guide-articles";
import { site } from "@/lib/site-config";

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/**
 * Fixní datum poslední skutečné obsahové změny stránky — vyhýbáme se
 * `new Date()` u statických stránek (Google penalizuje "změněno dnes" u
 * všeho při každém buildu).
 */
const routes: {
  path: string;
  changeFrequency: ChangeFreq;
  priority: number;
  lastModified: string;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1, lastModified: "2026-11-21" },
  { path: "/registrace", changeFrequency: "weekly", priority: 0.95, lastModified: "2026-11-21" },
  { path: "/test-urovne-ai", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-11-21" },
  { path: "/co-deti-tvori", changeFrequency: "monthly", priority: 0.87, lastModified: "2026-11-21" },
  { path: "/jak-probiha", changeFrequency: "monthly", priority: 0.85, lastModified: "2026-11-21" },
  { path: "/faq", changeFrequency: "monthly", priority: 0.85, lastModified: "2026-11-21" },
  { path: "/kontakt", changeFrequency: "yearly", priority: 0.7, lastModified: "2026-11-19" },
  { path: "/obchodni-podminky", changeFrequency: "yearly", priority: 0.4, lastModified: "2026-11-21" },
  { path: "/ochrana-osobnich-udaju", changeFrequency: "yearly", priority: 0.4, lastModified: "2026-11-21" },
  { path: "/pravidla-online-krouzku", changeFrequency: "yearly", priority: 0.35, lastModified: "2026-07-04" },
  { path: "/odstoupeni-od-smlouvy", changeFrequency: "yearly", priority: 0.35, lastModified: "2026-11-21" },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.35, lastModified: "2026-04-17" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.baseUrl.replace(/\/$/, "");

  const entries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${base}${r.path === "" ? "/" : r.path}`,
    lastModified: new Date(r.lastModified),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // /aktualni-behy je čistě dynamický výpis — datum odvozujeme z nejnovějšího
  // vypsaného termínu, ne z okamžiku buildu.
  entries.push({
    url: `${base}/aktualni-behy`,
    lastModified: new Date("2026-11-21"),
    changeFrequency: "weekly",
    priority: 0.88,
  });

  entries.push({
    url: `${base}/pruvodce`,
    lastModified: new Date("2026-07-11"),
    changeFrequency: "monthly",
    priority: 0.6,
  });

  for (const article of guideArticles) {
    entries.push({
      url: `${base}/pruvodce/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  return entries;
}
