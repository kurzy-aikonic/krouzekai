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
  - volitelně `NEXT_PUBLIC_OG_IMAGE` — obrázek cca 1200×630 (např. `/og.png` v `public/`)

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

## Cookies a měření

- [ ] Po rozhodnutí o nástroji: **Plausible / Matomo / jiné** — načítat jen po souhlasu v cookie liště
- [ ] Aktualizovat dokumentaci cookies a případně nastavení lišty

---

## Design a obsah webu

- [ ] Finální **vizuální styl** (barvy, typografie, ilustrace) — zatím je základní layout
- [ ] Přidat **OG obrázek** pro sdílení na sociálních sítích

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
