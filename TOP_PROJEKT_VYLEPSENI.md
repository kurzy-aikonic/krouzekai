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
