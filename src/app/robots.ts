import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const base = site.baseUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/platba", "/admin", "/rodic"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
