import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Prose } from "@/components/ui/Prose";
import { metaDescriptions, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Zásady cookies",
  description: metaDescriptions.cookies,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Úvod", path: "/" },
          { name: "Zásady cookies", path: "/cookies" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Prose>
        <h1>Cookies a podobné technologie</h1>
        <p>
          Tento web používá cookies a obdobná úložiště v zařízení (např.
          localStorage). Zpracování probíhá v souladu s pravidly EU/CZ pro
          soukromí v elektronických komunikacích a s GDPR.
        </p>
        <h2>Nezbytné cookies</h2>
        <p>
          Nutné pro základní funkce webu (např. uložení volby v cookie liště a
          bezpečnostní funkce formuláře). Tyto technologie používáme bez
          souhlasu, protože jsou nezbytné pro provoz služby.
        </p>
        <h2>Analytické cookies</h2>
        <p>
          Slouží ke statistikám návštěvnosti. Používáme je pouze po udělení
          souhlasu. Pokud analytika není zapnutá, analytické cookies se
          neukládají.
        </p>
        <h2>Marketingové cookies</h2>
        <p>
          V současné chvíli marketingové cookies nepoužíváme. Pokud by se to
          změnilo, bude tato stránka aktualizována a marketingové cookies budou
          podmíněny souhlasem.
        </p>
        <h2>Jaký nástroj aktuálně používáme</h2>
        <ul>
          <li>
            Ukládáme volbu souhlasu uživatele do localStorage (`krouzek-cookie-consent`).
          </li>
          <li>Bez souhlasu nenačítáme volitelnou analytiku.</li>
        </ul>
        <h2>Jak volbu změnit</h2>
        <p>
          Svou volbu můžete změnit vymazáním dat webu v prohlížeči (cookies a
          localStorage). Po vymazání se cookie lišta zobrazí znovu a můžete
          provést novou volbu.
        </p>
        <h2>Kontakt</h2>
        <p>
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        </p>
        </Prose>
      </div>
    </>
  );
}
