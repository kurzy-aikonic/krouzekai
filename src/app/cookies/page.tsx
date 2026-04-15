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
        <h2>Nezbytné cookies a technologie</h2>
        <p>
          Nutné pro základní funkce webu (např. uložení volby v cookie liště,
          technický provoz aplikace). Tyto technologie používáme bez souhlasu,
          protože jsou nezbytné pro provoz služby.
        </p>
        <p>
          Na stránce <a href="/registrace">Registrace</a> může být pro ochranu
          formuláře před roboty načten widget <strong>Cloudflare Turnstile</strong>.
          Turnstile může v souvislosti s ověřením uložit vlastní cookies nebo
          podobné identifikátory v doméně Cloudflare; jde o zpracování podle
          pravidel společnosti Cloudflare a podle našich zásad ochrany osobních
          údajů (oprávněný zájem / plnění smlouvy a bezpečnost). Bez úspěšného
          ověření (pokud je Turnstile v prostředí zapnuto) nelze formulář v některých
          konfiguracích odeslat.
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
        <h2>Jaké nástroje aktuálně používáme</h2>
        <ul>
          <li>
            Volbu v cookie liště ukládáme do úložiště prohlížeče (localStorage,
            klíč <code className="rounded bg-slate-100 px-1">krouzek-cookie-consent</code>
            ).
          </li>
          <li>Bez souhlasu nenačítáme volitelnou analytiku.</li>
          <li>
            Transakční e-maily (potvrzení přihlášky, odkazy pro rodiče) zpracovává
            náš e-mailový dodavatel (např. Resend); nejde o cookies na tomto webu,
            ale o zpracování údajů u příjemce podle smlouvy o zpracování.
          </li>
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
