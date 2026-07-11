export const EMAIL_TEMPLATE_IDS = [
  "registration_confirmation",
  "registration_internal",
  "registration_status_change",
  "waitlist_confirmation",
  "waitlist_internal",
  "parent_magic_link",
  "admin_magic_link",
  "admin_test",
] as const;

export type EmailTemplateId = (typeof EMAIL_TEMPLATE_IDS)[number];

export type EmailTemplateContent = {
  subject: string;
  htmlBody: string;
};

export type EmailTemplateMeta = {
  id: EmailTemplateId;
  label: string;
  description: string;
  whenSent: string;
  audience: "rodič" | "interní" | "admin";
  placeholders: Array<{
    key: string;
    label: string;
    hint?: string;
  }>;
};

export const EMAIL_TEMPLATE_META: Record<EmailTemplateId, EmailTemplateMeta> = {
  registration_confirmation: {
    id: "registration_confirmation",
    label: "Potvrzení přihlášky",
    description: "Hlavní e-mail rodiči hned po odeslání registrace na webu.",
    whenSent: "Automaticky po registraci, nebo tlačítkem „Znovu poslat potvrzení“ v detailu přihlášky.",
    audience: "rodič",
    placeholders: [
      { key: "siteName", label: "Název kurzu / webu" },
      { key: "siteShortName", label: "Krátký název" },
      { key: "contactEmail", label: "Kontaktní e-mail" },
      { key: "registrationCode", label: "Veřejné číslo přihlášky" },
      { key: "formatLabel", label: "Formát (Skupinový / 1:1)" },
      { key: "lessons", label: "Počet lekcí" },
      { key: "lessonMinutes", label: "Délka lekce v minutách" },
      { key: "amountCzk", label: "Částka v Kč" },
      { key: "vatNote", label: "Poznámka k DPH" },
      {
        key: "runLineHtml",
        label: "Blok s termínem",
        hint: "Prázdný, nebo odstavec se zvoleným termínem. Nevymazávejte placeholder.",
      },
      { key: "variableSymbol", label: "Variabilní symbol" },
      { key: "paymentUrl", label: "Odkaz na /platba" },
    ],
  },
  registration_internal: {
    id: "registration_internal",
    label: "Interní kopie přihlášky",
    description: "Notifikace pro vás — nová přihláška z webu.",
    whenSent: "Současně s potvrzením rodiči (adresa RESEND_INTERNAL_TO).",
    audience: "interní",
    placeholders: [
      { key: "registrationCode", label: "Veřejné číslo přihlášky" },
      { key: "registrationUuid", label: "Technické UUID" },
      { key: "statusLabel", label: "Stav přihlášky" },
      { key: "parentName", label: "Jméno rodiče" },
      { key: "parentEmail", label: "E-mail rodiče" },
      { key: "parentPhone", label: "Telefon rodiče" },
      { key: "childName", label: "Jméno dítěte" },
      { key: "childAge", label: "Věk dítěte" },
      { key: "formatLabel", label: "Formát kurzu" },
      { key: "amountCzk", label: "Částka v Kč" },
      { key: "runLabel", label: "Termín (text)" },
      { key: "paymentUrl", label: "Odkaz na platbu" },
    ],
  },
  registration_status_change: {
    id: "registration_status_change",
    label: "Změna stavu přihlášky",
    description: "Upozornění rodiči, když v adminu změníte stav přihlášky.",
    whenSent: "Při úpravě stavu v detailu nebo volitelně při hromadné změně.",
    audience: "rodič",
    placeholders: [
      { key: "childName", label: "Jméno dítěte" },
      { key: "registrationCode", label: "Číslo přihlášky" },
      { key: "previousStatusLabel", label: "Předchozí stav (česky)" },
      { key: "newStatusLabel", label: "Nový stav (česky)" },
      { key: "paymentUrl", label: "Odkaz na platbu" },
      { key: "parentPortalUrl", label: "Odkaz na přehled pro rodiče" },
      { key: "contactEmail", label: "Kontaktní e-mail" },
      { key: "siteShortName", label: "Krátký název" },
    ],
  },
  waitlist_confirmation: {
    id: "waitlist_confirmation",
    label: "Potvrzení čekací listiny",
    description: "Rodiči hned po zápisu do čekací listiny na plný termín.",
    whenSent: "Automaticky po odeslání formuláře na /cekaci-listina.",
    audience: "rodič",
    placeholders: [
      { key: "siteName", label: "Název kurzu / webu" },
      { key: "siteShortName", label: "Krátký název" },
      { key: "contactEmail", label: "Kontaktní e-mail" },
      { key: "formatLabel", label: "Formát (Skupinový / 1:1)" },
      {
        key: "runLineHtml",
        label: "Blok s termínem",
        hint: "Prázdný, nebo odstavec s termínem, o který byl zájem. Nevymazávejte placeholder.",
      },
    ],
  },
  waitlist_internal: {
    id: "waitlist_internal",
    label: "Interní notifikace čekací listiny",
    description: "Notifikace pro vás — nový zájemce v čekací listině.",
    whenSent: "Současně s potvrzením zájemci (adresa RESEND_INTERNAL_TO).",
    audience: "interní",
    placeholders: [
      { key: "parentName", label: "Jméno rodiče" },
      { key: "parentEmail", label: "E-mail rodiče" },
      { key: "parentPhone", label: "Telefon rodiče" },
      { key: "childName", label: "Jméno dítěte" },
      { key: "formatLabel", label: "Formát kurzu" },
      { key: "runLabel", label: "Termín (text)" },
      { key: "note", label: "Poznámka zájemce" },
    ],
  },
  parent_magic_link: {
    id: "parent_magic_link",
    label: "Přihlášení rodiče (magic link)",
    description: "Jednorázový odkaz do přehledu /rodic po zadání e-mailu.",
    whenSent: "Po požadavku na přihlášení na stránce pro rodiče.",
    audience: "rodič",
    placeholders: [
      { key: "siteName", label: "Název kurzu" },
      { key: "siteShortName", label: "Krátký název" },
      { key: "magicUrl", label: "Jednorázový odkaz (URL)" },
      {
        key: "magicButtonHtml",
        label: "Tlačítko s odkazem",
        hint: "Hotové HTML tlačítko — lze nahradit vlastním textem s {{magicUrl}}.",
      },
    ],
  },
  admin_magic_link: {
    id: "admin_magic_link",
    label: "Přihlášení do adminu (magic link)",
    description: "Jednorázový odkaz pro přihlášení do administrace.",
    whenSent: "Po zadání e-mailu na /admin/login (ADMIN_EMAILS).",
    audience: "admin",
    placeholders: [
      { key: "siteName", label: "Název webu" },
      { key: "siteShortName", label: "Krátký název" },
      { key: "magicUrl", label: "Jednorázový odkaz (URL)" },
      { key: "magicButtonHtml", label: "Tlačítko s odkazem" },
    ],
  },
  admin_test: {
    id: "admin_test",
    label: "Testovací e-mail",
    description: "Ověření doručení z adminu (Resend, doména odesílatele).",
    whenSent: "Ručně z editoru šablon nebo z Nástrojů.",
    audience: "admin",
    placeholders: [
      { key: "siteName", label: "Název webu" },
      { key: "siteShortName", label: "Krátký název" },
    ],
  },
};
