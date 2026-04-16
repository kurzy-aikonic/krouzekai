# SEO a technický checklist před / po spuštění

Postup je seřazený tak, aby každý krok navazoval na předchozí. Zaškrtávej v pořadí shora dolů.

---

## Fáze 0 — Prostředí a nasazení

1. **Produkční `.env` na hostingu** (Vercel / jiný) nastav stejně jako v `.env.example`, zejména:
   - `NEXT_PUBLIC_SITE_URL` = kanonická URL **včetně** `https://`, **bez** koncového lomítka (např. `https://krouzekumeleinteligence.cz`).
   - `NEXT_PUBLIC_CONTACT_EMAIL` = reálný kontaktní e-mail.
2. **Build a nasazení**  
   - Lokálně ověř: `npm run lint` a `npm run build`.  
   - Po deployi otevři web v anonymním okně a zkontroluj HTTPS a že neběží „stará“ verze (cache CDN).
3. **DNS**  
   - A / CNAME záznamy míří na hosting, TTL po ověření můžeš snížit.

---

## Fáze 1 — Technická kontrola na živé doméně

Otevři v prohlížeči (nahraď doménu, pokud je jiná):

| Co | URL |
|----|-----|
| Úvod | `https://krouzekumeleinteligence.cz/` |
| Sitemap | `https://krouzekumeleinteligence.cz/sitemap.xml` |
| Robots | `https://krouzekumeleinteligence.cz/robots.txt` |

**Kontrola:**

- V `robots.txt` je odkaz na `sitemap.xml` a jsou blokované `/api/` a `/platba`.
- Ve `sitemap.xml` jsou veřejné stránky (ne `/platba`).
- Hlavní stránky vrací **200**, kanonické URL v `<head>` odpovídají `NEXT_PUBLIC_SITE_URL`.

---

## Fáze 2 — Google Search Console

1. Jdi na [Google Search Console](https://search.google.com/search-console).
2. **Přidej majetek (property)** — preferovaně **doménová** property (`krouzekumeleinteligence.cz`) přes DNS TXT u registrátora, nebo aspoň **prefix URL** `https://krouzekumeleinteligence.cz/`.
3. **Ověření vlastnictví**  
   - Pokud použiješ metodu „HTML tag“, zkopíruj kód a vlož hodnotu do `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` v produkčním `.env`, znovu nasaď.  
   - V kódu se propisuje přes `metadata.verification.google` v `src/lib/seo.ts`.
4. Po ověření: **Sitemaps** → přidej `sitemap.xml` (stačí název `sitemap.xml` pokud je property na kořeni HTTPS).
5. **URL inspection** (Kontrola adresy URL)  
   - Otestuj `/`, `/registrace`, `/faq`.  
   - U důležitých stránek použij **Požádat o indexování** (omezený denní limit — prioritizuj úvod a registraci).

*Poznámka:* První indexace může trvat dny až týdny; sitemap a kvalitní odkazy z `aikonic.cz` pomáhají.

---

## Fáze 3 — Strukturovaná data (rich results)

1. **Rich Results Test**  
   - [Google Rich Results Test](https://search.google.com/test/rich-results)  
   - Vlož URL: `/`, `/faq` (FAQ + breadcrumbs), případně `/registrace`.  
   - Ověř, že nejsou kritické chyby u `Organization`, `WebSite`, `Course`, `FAQPage`, `BreadcrumbList`.
2. **Schema Markup Validator** (doplňkově)  
   - [validator.schema.org](https://validator.schema.org/) — vlož URL nebo zkopírovaný JSON-LD ze zdroje stránky.

---

## Fáze 4 — Open Graph a sdílení

1. **OG obrázek**  
   - Nahraj do `web/public/` např. `og.png` (**1200×630** px).  
   - V produkci nastav `NEXT_PUBLIC_OG_IMAGE=/og.png` (nebo plnou absolutní URL, pokud hostuješ obrázek jinde).  
   - Bez této proměnné se použije fallback obrázek z kódu; pro nejlepší náhled ve feedech stejně doporučujeme vlastní **banner 1200×630** a `NEXT_PUBLIC_OG_IMAGE=/og.png`.
2. **Facebook Sharing Debugger**  
   - [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)  
   - Zadej URL úvodní stránky, případně „Scrape Again“ po změně OG tagů.
3. **LinkedIn Post Inspector**  
   - [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)  
   - Stejná kontrola náhledu titulku, popisu a obrázku.

---

## Fáze 5 — Obsah a vnitřní SEO (rychlá kontrola)

- Titulky a popisy: jednotný tón, bez duplicit na klíčových stránkách (`metaDescriptions` v `src/lib/seo-copy.ts`).
- Odkaz z **aikonic.cz** na tento web (ideálně z kontextu „AI kroužek pro děti“) — pomáhá crawlům i uživatelům.
- Zkontroluj, že `/platba` zůstává **noindex** a v `robots.txt` je `Disallow` (už nastaveno).

---

## Fáze 6 — Po spuštění (první týdny)

1. V Search Console sleduj **Pokrytí**, **Výkon** (dotazy, imprese, CTR).  
2. Oprav **chyby 404** a případné problémy s mobilní použitelností (hlášení v GSC).  
3. Až zapneš analytiku (Plausible/Matomo/GA) — jen po **souhlasu v cookie liště**, aby to sedělo s textem na `/cookies`.

---

## Fáze 7 — Provoz: měření, indexace a vylepšování (doporučený režim)

Cíl je **stabilní signál pro Google** (technika + obsah) a **uzavřená smyčka**: data → úprava titulku/popisu nebo obsahu → ověření → sledování dopadu.

### 7.1 Týden 0–1 (hned po ověření GSC)

1. **Majetek v GSC**  
   - Preferuj **doménovou** property (`krouzekumeleinteligence.cz`), pokud to DNS dovolí — vidíš http/https i případné subdomény v jednom přehledu.  
   - Ujisti se, že kanonická adresa v kódu (`NEXT_PUBLIC_SITE_URL`) odpovídá tomu, co uživatelé i robot vidí v prohlížeči (bez zbytečného přesměrovacího řetězce www / non-www).
2. **Sitemap**  
   - Jednou odešli `sitemap.xml`. Chyby ve „Sitemaps“ řeš hned (404 sitemap, špatná doména).  
3. **Kontrola adresy URL** (priorita)  
   - `/`, `/registrace`, `/faq`, `/aktualni-behy`, `/jak-probiha`.  
   - **Požádat o indexování** použij střídmě (denní limit) — nejdřív úvod a registraci.  
4. **Rich Results**  
   - Znovu projdi `/` a `/faq` po každé větší úpravě JSON-LD nebo šablon stránky.

### 7.2 Týden 2–4 (první data)

1. **Výkon → Stránky**  
   - Seřaď podle **imprese** (ne jen kliky). Najdi stránky s vysokými impresemi a **nízkým CTR** — typicky pomůže zpřesnění `title` / `description` (už máte centrálně v `seo-copy.ts` a `pageMetadata`).  
2. **Výkon → Dotazy**  
   - Rozliš **značkové** dotazy (název kroužku, doména) vs **ne-značkové** (např. „online kroužek ai pro děti“). Na ne-značkové cílí obsah na úvodu / FAQ / „jak probíhá“.  
3. **Pokrytí**  
   - Sleduj „Vyloučeno z indexu“ vs „Chyba“ vs „V indexu“. U chyb řeš příčinu (404, noindex omylem, server 5xx).  
   - Stav „Objeveno – zatím není v indexu“ je častý u nových webů; pomáhá kvalitní **vnitřní prolinkování** z `aikonic.cz` a z úvodní stránky na registraci / termíny / FAQ.

### 7.3 Průběžně (měsíčně nebo po větších změnách)

1. **PageSpeed / Core Web Vitals** (vzorek URL: úvod, registrace, FAQ)  
   - [PageSpeed Insights](https://pagespeed.web.dev/) — řeš hlavně **LCP** a **CLS** na mobilu.  
2. **Sdílení a náhledy**  
   - Jakmile nasadíš `og.png` (1200×630) a `NEXT_PUBLIC_OG_IMAGE`, po každé změně OG znovu projdi Facebook Debugger a LinkedIn Post Inspector (cache náhledů).  
3. **Duplicity a kanonikál**  
   - V GSC ověř, že důležité URL nemají duplicitní kanonikál mimo vlastní doménu.  
4. **Analytika vs GDPR**  
   - Metriky z GA ber jen jako orientační, pokud část návštěvníků nesouhlasí s cookies — doplň interpretaci o **GSC Výkon** (agregát bez cookies na straně uživatele).

### 7.4 Bing (volitelné, nízká nákladová přidaná hodnota)

- [Bing Webmaster Tools](https://www.bing.com/webmasters) — import z GSC nebo ruční ověření, odeslání stejné sitemap.

### 7.5 Off-page (rozumně, bez spamu)

- Trvalý **kontextový odkaz** z `aikonic.cz` (stránka kurzů / blog / patička), ideálně s přirozeným kotvícím textem.  
- Partneři / školy / rodičovské komunity jen tam, kde dává odkaz smysl — kvalita > počet.

---

## Rychlý odkaz — nástroje

- [Search Console](https://search.google.com/search-console)  
- [Rich Results Test](https://search.google.com/test/rich-results)  
- [Schema Validator](https://validator.schema.org/)  
- [PageSpeed Insights](https://pagespeed.web.dev/) (LCP, CLS, mobil)  
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)  
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

*Poslední aktualizace checklistu: Next.js App Router, JSON-LD, sitemap.ts, robots.ts; doplněna fáze 7 (provoz a měření).*
