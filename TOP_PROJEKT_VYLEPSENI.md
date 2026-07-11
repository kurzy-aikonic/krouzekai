# TOP vylepseni projektu (roadmapa)

Tento dokument shrnuje doporuceni pro posun projektu na "top" uroven z pohledu produktu, provozu, bezpecnosti a rustu.

## 1) Nejvyssi priorita (nejvetsi dopad)

1. **Meritelny funnel od navstevy po platbu**
   - Nastroj: PostHog (eventy + funnel + session replay).
   - Sledovat: navsteva -> test urovne -> registrace -> kontaktovano -> zaplaceno.
   - Cil: rozhodovat podle dat, ne pocitu.

2. **Automatizace po registraci (CRM/workflow)**
   - Nastroj: n8n nebo Make.
   - Auto follow-up, SLA pripominky, interna upozorneni na "zaseknute" prihlasky.
   - Cil: vyssi konverze a rychlejsi reakce na rodice.

3. **ProdukcnI monitoring**
   - Nastroj: Sentry + uptime monitoring (Better Stack / Uptime Kuma).
   - Pokryt API chyby, email fail stavy, auth chyby, regresni nasazeni.
   - Cil: rychle odhalit problem driv, nez ho nahlasi uzivatel.

4. **Automaticke E2E testy kritickych flow**
   - Nastroj: Playwright.
   - Pokryt: registrace, potvrzeni, rodicovsky portal, zmena stavu v adminu.
   - Cil: bezpecne iterovat bez rozbijeni klicovych cest.

## 2) Rychle winy (1-2 tydny)

- Zavedeni PostHog eventu pro cele flow.
- Zapnuti Sentry (frontend + route handlers).
- Alert na `emailStatus=failed`.
- Playwright smoke test: registrace + rodic login + dashboard.
- Kontrolni Lighthouse CI v pipeline.

## 3) Strategicke vylepseni (1-2 mesice)

- Poloautomaticke/automaticke parovani plateb podle VS.
- Rodicovsky portal: "co dite vytvorilo" (milniky, mini portfolio).
- Doporucovaci program (referral) se sledovanim zdroje.
- A/B test hlavni stranky (hero, CTA, registracni krok).

## 4) Bezpecnost a compliance

- Prubezne hardening kontroly dle `SECURITY_HARDENING_CHECKLIST.md`.
- Pravidelne overeni dorucitelnosti e-mailu (SPF/DKIM/DMARC).
- Pravidelny audit zavislosti (`npm audit`) a incident runbook.
- Minimalizace PII v logach a dukladna rotace tajemstvi.

## 5) Produktove mezery specificke pro tento typ projektu (nalezeno pri auditu 07/2026)

Hotovo:

- **Cekaci listina na plny termin** — `/cekaci-listina`, `/api/waitlist`,
  admin prehled `/admin/waitlist`. Plny termin uz nekonci slepou ulickou.

Zbyva (serazeno podle dopadu):

1. **Realna online platba** (Stripe / GoPay / Comgate) — `src/lib/payment.ts`
   je zatim prazdny stub, vse jde pres rucni bankovni prevod. Nejvetsi treni
   v cele ceste od registrace k platbe.
2. **Video na homepage** — ukazka lekce / lektor mluvi. U online kurzu bez
   osobniho kontaktu jeden z nejsilnejsich konverznich prvku.
3. **Vic social proof primo na homepage** — konkretni cisla (pocet
   absolventu), vic citaci rodicu (dnes jen na `/co-deti-tvori`).
4. **Stranka s osnovou kurzu** (lekce 1-10, temata po tydnech) — snizuje
   nejistotu "co presne za ty penize dite dostane".
5. **E-mailova nurture sekvence** — dnes jen transakcni e-maily. Chybi:
   uvitaci e-mail "co si pripravit", pripominka den pred lekci, po kurzu
   zadost o recenzi.
6. **Certifikat/diplom po dokonceni kurzu** — silny "sdileci" moment pro
   rodice na socialni site (organicky marketing) + motivace pro dite.
7. **Kalendarova pozvanka (.ics)** k prvni lekci v potvrzovacim e-mailu.
8. **Zivy chat / WhatsApp tlacitko** — nizkoprahovy kontakt pred platbou,
   bezne u krouzku pro deti.
9. **Systematicky accessibility pass** — skip links, ARIA na zbylych
   interaktivnich prvcich (zaklady uz existuji: SiteHeader, RegistrationForm).
