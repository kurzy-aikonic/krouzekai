# Kroužek AI — co ještě dodělat

Dokument pro návrat k otevřeným úkolům kolem webu a provozu kurzu. Projekt běží ve složce `web/` (Next.js).

---

## Právo a obsah

- [ ] Doplnit **obchodní podmínky** a **GDPR** o konkrétní údaje: identifikace poskytovatele, IČO, sídlo, kontakt, právní základy zpracování, doby uchování.
- [ ] Nechat texty **zkontrolovat právníkem** před ostrým spuštěním.
- [ ] Doplnit stránku **Cookies** po nasazení analytiky (konkrétní nástroje, cookies třetích stran).

---

## Konfigurace a prostředí

- [ ] Nastavit produkční **`.env` / `.env.local`**:
  - `NEXT_PUBLIC_SITE_URL` — ostrá URL (kanonické odkazy, OG, e-maily)
  - `NEXT_PUBLIC_CONTACT_EMAIL`
  - `NEXT_PUBLIC_BANK_ACCOUNT`, `NEXT_PUBLIC_BANK_IBAN` (zobrazení na `/platba`)
  - volitelně `NEXT_PUBLIC_OG_IMAGE` — viz sekce **Co je og.png?** níže

---

## E-mail

- [ ] Zapnout **Resend** (nebo jiný SMTP): `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- [ ] Ověřit **doménu odesílatele** u Resend (nebo ekvivalent)
- [ ] Otestovat potvrzení přihlášky po registraci

---

## Platby

- [ ] Implementovat **`createCheckoutSession`** v `src/lib/payment.ts` (Stripe / GoPay / jiná brána)
- [ ] Nastavit **webhook** brány a aktualizovat stav přihlášky na „zaplaceno“
- [ ] Sladit s **obchodními podmínkami** (storno, splátky)

---

## Data a provoz

- [ ] **Produkční úložiště přihlášek**: databáze, Airtable, nebo spolehlivý webhook — nejen zápis do `data/registrations.jsonl` (na Vercelu soubor často nepersistuje)
- [ ] **Dohledání přihlášky** pro `/platba` a checkout API na serverless (dnes funguje hlavně s lokálním JSONL)
- [ ] **Kapacity běhů**: automaticky snížit / blokovat po platbě, nebo jednoduchý **admin** pro úpravu `filled` v `src/data/course-runs.ts`

---

## Bezpečnost před spuštěním (rychlý checklist)

- [ ] V produkčním hostingu nastavit `SUPABASE_URL` a `SUPABASE_SERVICE_ROLE_KEY` (rate limit přes Supabase)
- [ ] Ověřit, že v Supabase běží SQL z `supabase-rate-limit.sql` a vzniká tabulka `web_rate_limits`
- [ ] Zkontrolovat, že `service_role` klíč není nikde veřejný (`NEXT_PUBLIC_*`) ani v repozitáři
- [ ] Pokud používáš webhook přihlášek: nastavit `REGISTRATIONS_WEBHOOK_SECRET` a ověřovat `Authorization: Bearer ...` na přijímači
- [ ] Spustit před nasazením `npm run lint` a `npm run build` ve složce `web/`

---

## Cookies a měření

- [ ] Po rozhodnutí o nástroji: **Plausible / Matomo / jiné** — načítat jen po souhlasu v cookie liště
- [ ] Aktualizovat dokumentaci cookies a případně nastavení lišty

---

## Design a obsah webu

- [ ] Finální **vizuální styl** (barvy, typografie, ilustrace) — zatím je základní layout
- [ ] Přidat **OG obrázek** pro sdílení na sociálních sítích (viz níže)

### Co je `og.png`?

- **`og.png`** je jen běžný název souboru — jde o **náhledový obrázek pro sdílení odkazu** (Open Graph). Facebook, LinkedIn, Slack a další ho používají u příspěvků s odkazem na web.
- **Rozměr:** cca **1200 × 630 px** (PNG nebo JPG).
- **Kam uložit:** např. `web/public/og.png` → v prohlížeči cesta **`/og.png`**.
- **Jak zapnout:** v produkčním `.env` nastavit `NEXT_PUBLIC_OG_IMAGE=/og.png` (nebo plnou absolutní URL, pokud je obrázek jinde).
- **Bez něj:** sdílení funguje, ale často **bez velkého náhledu** (jen titulek a popis).
- Po nasazení otestovat: Facebook Sharing Debugger, LinkedIn Post Inspector (odkazy v `SEO_LAUNCH_CHECKLIST.md`).

---

## Nasazení a SEO

- [ ] Nasazení (**Vercel** nebo jiný hosting), **DNS**, **HTTPS**
- [ ] **Google Search Console**: přidat vlastnost, odeslat **sitemap** (`/sitemap.xml`), zkontrolovat `robots.txt`

---

## Volitelné rozšíření

- [ ] `REGISTRATIONS_WEBHOOK_URL` — Make/Zapier pro notifikace a zálohu mimo server
- [ ] Čekací listina při plné skupině
- [ ] Potvrzovací e-mail s šablonou v češtině (doladění copy)

---

*Poslední úprava: checklist odpovídá stavu vývoje webu; po dokončení úkolů je můžeš v tomto souboru odškrtnout nebo mazat.*
