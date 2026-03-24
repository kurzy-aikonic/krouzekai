import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

const routes: { path: string; changeFrequency: ChangeFreq; priority: number }[] =
  [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/registrace", changeFrequency: "weekly", priority: 0.95 },
    { path: "/jak-probiha", changeFrequency: "monthly", priority: 0.85 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.85 },
    { path: "/kontakt", changeFrequency: "yearly", priority: 0.7 },
    { path: "/obchodni-podminky", changeFrequency: "yearly", priority: 0.4 },
    { path: "/ochrana-osobnich-udaju", changeFrequency: "yearly", priority: 0.4 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.35 },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.baseUrl.replace(/\/$/, "");
  const lastModified = new Date();

  return routes.map((r) => ({
    url: `${base}${r.path === "" ? "/" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
