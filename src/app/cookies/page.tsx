import type { Metadata } from "next";
import { Prose } from "@/components/ui/Prose";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Zásady cookies",
  description: `Jak ${site.shortName} používá cookies a podobné technologie.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Prose>
        <h1>Cookies a podobné technologie</h1>
        <p>
          Tento web používá cookies. Níže popisujeme základní kategorie. Po
          nasazení analytických nástrojů (např. Matomo, Plausible) text doplňte o
          konkrétní názvy cookies, dobu platnosti a třetí strany.
        </p>
        <h2>Nezbytné cookies</h2>
        <p>
          Nutné pro základní funkce webu (např. uložení volby v cookie liště,
          bezpečnostní tokeny relace). Tyto cookies nelze odmítnout, pokud chcete
          stránku normálně používat.
        </p>
        <h2>Analytické cookies</h2>
        <p>
          Slouží ke statistikám návštěvnosti. Zapínají se jen pokud v liště
          zvolíte &bdquo;Přijmout vše&ldquo; nebo pokud takové nastavení
          doplníte. Do doby napojení analytiky se žádné analytické cookies
          neukládají.
        </p>
        <h2>Jak volbu změnit</h2>
        <p>
          Svou volbu můžete změnit vymazáním úložiště pro web v prohlížeči nebo
          smazáním klíče v lokálním úložišti (např. klíč souhlasu v liště).
          Podrobnosti doplníme po finální implementaci analytiky.
        </p>
        <h2>Kontakt</h2>
        <p>
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        </p>
      </Prose>
    </div>
  );
}
