# Security audit report (2026-07-04)

Audit pokryva web aplikaci, API endpointy a autentizaci (admin + rodicovsky portal).

## Rozsah

- `next.config.ts` (HTTP security headers, CSP)
- `src/proxy.ts` (cross-site blokace menicich API metod)
- `src/lib/rate-limit.ts` + auth endpointy
- `/api/admin/*` a `/api/rodic/auth/*` route handlery
- zavislosti (`npm audit --omit=dev`)

## Nalezy a stav

1. **Per-IP rate limit bez identity klíče** - stredni riziko  
   - Distribuovane pokusy proti stejnemu e-mailu mohly obchazet limity.
   - **Fix:** doplnen hashovany identifier (`ip + sha256(identifier)`) v `rateLimitResponse()`.
   - **Aplikace:** parent login/register/magic-request + admin magic-request.

2. **Timing side-channel pri parent login (existuje/neexistuje ucet)** - stredni riziko  
   - Vetveni "ucet neexistuje" mohlo mit odlisne casovani.
   - **Fix:** dummy bcrypt compare i pro neexistujici ucet.

3. **Admin login bez velikostniho limitu body** - nizke az stredni riziko  
   - Endpoint mohl prijmout prilis velke JSON telo.
   - **Fix:** pridan `rejectOversizedJsonBody()` do `/api/admin/login`.

4. **Chybejici cast doporucenych security hlavicek** - nizke riziko  
   - **Fix:** pridano:
     - `X-DNS-Prefetch-Control: off`
     - `X-Permitted-Cross-Domain-Policies: none`
     - `Origin-Agent-Cluster: ?1`

5. **Zavislosti (npm audit)** - zbyvajici nizke/stredni riziko  
   - Spusteno `npm audit fix`, lockfile aktualizovan.
   - Zbyva 1 advisories stopa (postcss pres ekosystem `next`), kterou npm navrhuje resit pouze `--force` s degradujicim/nesmyslnym targetem.
   - Stav je zaznamenan jako residual risk; dalsi krok je sledovat official patch release vetve `next`.

## Provedene zmeny v kodu

- `src/lib/rate-limit.ts`
  - novy volitelny parameter `identifier`
  - hashovani identifieru (`sha256`) a pouziti v Supabase/Redis/memory limiteru
- `src/app/api/rodic/auth/login/route.ts`
  - per-email rate-limit
  - dummy bcrypt compare proti user-enumeration timingu
- `src/app/api/rodic/auth/register/route.ts`
  - per-email rate-limit
- `src/app/api/rodic/auth/magic-request/route.ts`
  - per-email rate-limit
- `src/app/api/admin/magic-request/route.ts`
  - per-email rate-limit
- `src/app/api/admin/login/route.ts`
  - oversized body guard
- `next.config.ts`
  - doplnene security hlavicky
- `package-lock.json`
  - aktualizace po `npm audit fix`

## Ověření po úpravách

- `npm run lint` -> OK
- `npm run build` -> OK
- `npm audit --omit=dev` -> po fixech zbyvaji jen residual advisories navazane na upstream balicky

## Doporucene dalsi kroky (navazuji na hardening)

1. Zapnout produkcni monitoring (Sentry + alerty na auth/API chyby).
2. Pridat security e2e smoke testy (login brute-force, magic link flow, registrace).
3. Prubezne sledovat a aktualizovat `next` minor/patch verze kvuli bezpecnostnim advisory.
4. Zavedeni jednorazoveho "consumed token" storage pro magic odkazy (ochrana proti replay v ramci platnosti tokenu).
