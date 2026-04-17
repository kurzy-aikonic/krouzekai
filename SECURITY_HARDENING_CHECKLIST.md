# Bezpečnostní checklist (hardening webu)

Tento dokument doplňuje technická opatření v kódu (HTTP hlavičky, CSP, `proxy` vrstva u `/api/*`, rate limiting, `no-store` u API). Slouží jako pravidelná kontrola před nasazením a po incidentech.

---

## 1. Konfigurace a tajemství

1. **Nikdy** necommitovat `.env` s reálnými klíči (`ADMIN_SECRET`, `PARENT_AUTH_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` atd.).
2. Na produkci (Vercel) používat **silné náhodné** hodnoty min. 16 znaků pro `ADMIN_SECRET` a `PARENT_AUTH_SECRET`.
3. Po úniku tajemství: **okamžitě rotovat** na hostingu i u třetích stran (Supabase, Resend, Cloudflare).
4. Ověřit, že `NEXT_PUBLIC_*` obsahuje jen veřejné hodnoty (site URL, GA ID, Turnstile site key).

---

## 2. Doprava a HTTP

1. Produční doména běží pouze přes **HTTPS** (HSTS je v `next.config.ts`).
2. Po změně **CSP** nebo domény ověřit v prohlížeči konzoli: žádné blokované skripty (GA po souhlasu, Turnstile widget).
3. Ověřit, že veřejné stránky fungují i s přísnými hlavičkami (OG, fonty z Google Fonts).

---

## 3. API a zneužití

1. **Rate limiting**: v produkci preferovat Supabase RPC `web_check_rate_limit` (viz `supabase-rate-limit.sql`) nebo Upstash Redis — paměť instance je jen záloha.
2. Po přidání nového endpointu pod `/api/*`:
   - použít `apiJson()` z `src/lib/api-response.ts` (jednotný JSON + `no-store`),
   - zvážit vlastní `RateLimitScope` v `src/lib/rate-limit.ts`,
   - u citlivých akcí držet přísnější limity než u veřejného čtení.
3. **Cross-site POST**: vrstva `src/proxy.ts` blokuje `Sec-Fetch-Site: cross-site` u měnících metod — nové klientské integrace musí volat API ze stejného originu (ne z cizích domén přes cookie).

---

## 4. Autentizace a session

1. Admin a rodičovské session cookies: **HttpOnly**, v produkci **Secure**, vhodné **SameSite**.
2. Pravidelně ověřit odhlášení (`/api/admin/logout`, `/api/rodic/auth/logout`) a že cookie zmizí.
3. Magic odkaz: krátká platnost tokenu je v kódu — nesharingovat odkazy ve veřejných kanálech.

---

## 5. Závislosti a supply chain

1. Před releasem: `npm audit` (a řešit high/critical).
2. Udržovat Next.js a runtime závislosti v rozumné aktuálnosti (bez zbytečného skoku na major bez testu).

---

## 6. Logy a osobní údaje

1. Logovat **minimální** údaje; nepřidávat do logů hesla, celé tokeny ani zbytečné PII.
2. Při šetření incidentu: kdo měl přístup k záznamům lekcí (viz GDPR text na webu).

---

## 7. Rychlý test po změně bezpečnosti

- [ ] `npm run lint` a `npm run build` bez chyb  
- [ ] Přihlášení admina, jedna změna v přihláškách, odhlášení  
- [ ] Rodič: magic odkaz z e-mailu (nebo simulace), přístup k `/rodic`  
- [ ] Registrace s Turnstile (pokud je zapnutý)  
- [ ] Veřejné `GET /api/course-runs` z prohlížeče  

---

*Doplněno podle stavu projektu: `next.config.ts`, `src/proxy.ts`, `src/lib/rate-limit.ts`, `src/lib/api-response.ts`.*
