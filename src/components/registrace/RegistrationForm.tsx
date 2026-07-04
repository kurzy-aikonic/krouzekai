"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import type { CourseRun } from "@/data/course-runs";
import { CourseRunCapacityStatus } from "@/components/course-run/CourseRunCapacityStatus";
import { CourseRunPriceLabel } from "@/components/course-run/CourseRunPriceLabel";
import { CourseRunPublicMeta } from "@/components/course-run/CourseRunPublicMeta";
import type { AiSkillLevel } from "@/lib/ai-skill-test";
import { AI_SKILL_LEVEL_LABELS, parseAiSkillLevel } from "@/lib/ai-skill-test";
import { courseRunPublicStatus } from "@/lib/course-run-public-status";
import { site } from "@/lib/site-config";

const turnstileSiteKey =
  typeof process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === "string"
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.trim()
    : "";
const turnstileEnabled = turnstileSiteKey.length > 0;
const TurnstileClient = dynamic(
  () =>
    import("@marsidev/react-turnstile").then((m) => m.Turnstile),
  { ssr: false },
);
type Props = {
  groupRuns: CourseRun[];
  individualRuns: CourseRun[];
  /** Počty přihlášek počítané do kapacity (bez zrušených / reklamací), podle `run.id`. */
  occupancyByRunId: Record<string, number>;
  /** Předvybraný termín z URL (?run=id). */
  preferredRunId?: string;
  /** Předvyplněná úroveň z AI testu (?aiLevel=...). */
  initialAiSkillLevel?: AiSkillLevel | null;
  /** Aktuální ceny z adminu. */
  pricing: {
    skupinaCourseCzk: number;
    individualCourseCzk: number;
    skupinaPerLessonCzk: number;
    individualPerLessonCzk: number;
  };
};

function resolveInitialSelection(
  preferredRunId: string | undefined,
  groupRuns: CourseRun[],
  individualRuns: CourseRun[],
): {
  format: "skupina" | "individual";
  groupRunId: string;
  individualRunId: string;
} {
  const id = preferredRunId?.trim();
  if (!id) {
    return { format: "skupina", groupRunId: "", individualRunId: "" };
  }
  if (groupRuns.some((r) => r.id === id)) {
    return { format: "skupina", groupRunId: id, individualRunId: "" };
  }
  if (individualRuns.some((r) => r.id === id)) {
    return { format: "individual", groupRunId: "", individualRunId: id };
  }
  return { format: "skupina", groupRunId: "", individualRunId: "" };
}

export function RegistrationForm({
  groupRuns,
  individualRuns,
  occupancyByRunId,
  preferredRunId,
  initialAiSkillLevel,
  pricing,
}: Props) {
  const router = useRouter();
  const initial = resolveInitialSelection(
    preferredRunId,
    groupRuns,
    individualRuns,
  );
  const [format, setFormat] = useState<"skupina" | "individual">(
    initial.format,
  );
  /** Prázdný řetězec = bez výběru konkrétního termínu. */
  const [groupRunId, setGroupRunId] = useState(initial.groupRunId);
  const [individualRunId, setIndividualRunId] = useState(
    initial.individualRunId,
  );
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("12");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentAiTools, setConsentAiTools] = useState(false);
  const [consentEarlyServiceStart, setConsentEarlyServiceStart] = useState(false);
  const [aiSkillLevel, setAiSkillLevel] = useState<AiSkillLevel | "">(
    initialAiSkillLevel ?? "",
  );
  const [aiSkillLevelSource, setAiSkillLevelSource] = useState<
    "self-test" | "manual" | ""
  >(initialAiSkillLevel ? "self-test" : "");
  /** Neviditelné pole — nechte prázdné (antispam). */
  const [hpCompany, setHpCompany] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (turnstileEnabled && !turnstileToken.trim()) {
      setStatus("error");
      setMessage("Dokončete prosím ověření „Nejsem robot“.");
      return;
    }
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/registrace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        format,
        runId:
          format === "skupina" && groupRunId.trim()
            ? groupRunId.trim()
            : format === "individual" && individualRunId.trim()
              ? individualRunId.trim()
              : null,
        childName,
        childAge: Number(childAge),
        parentName,
        parentEmail,
        parentPhone,
        consentTerms,
        consentPrivacy,
        consentAiTools,
        consentEarlyServiceStart,
        aiSkillLevel: aiSkillLevel || null,
        aiSkillLevelSource: aiSkillLevel ? aiSkillLevelSource || "manual" : null,
        formHoney: hpCompany,
        turnstileToken: turnstileEnabled ? turnstileToken : "",
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      paymentUrl?: string;
      registrationId?: string;
      registrationCode?: string;
      emailStatus?: "sent" | "skipped" | "failed";
      format?: "skupina" | "individual";
      runId?: string | null;
      runLabel?: string | null;
      amountCzk?: number;
    };

    if (!res.ok) {
      setStatus("error");
      if (turnstileEnabled) {
        setTurnstileToken("");
        turnstileRef.current?.reset();
      }
      if (res.status === 429) {
        setMessage(
          data.error ??
            "Příliš mnoho pokusů o odeslání. Zkuste to za chvíli znovu.",
        );
        return;
      }
      setMessage(data.error ?? "Něco se pokazilo.");
      return;
    }

    setStatus("success");
    setMessage(data.message ?? "Odesláno.");
    const params = new URLSearchParams();
    if (data.registrationCode) params.set("code", data.registrationCode);
    if (data.format) params.set("format", data.format);
    if (typeof data.amountCzk === "number") {
      params.set("amountCzk", String(data.amountCzk));
    }
    if (data.runId) params.set("runId", data.runId);
    if (data.runLabel) params.set("runLabel", data.runLabel);
    if (data.emailStatus) params.set("emailStatus", data.emailStatus);
    const qs = params.toString();
    router.push(`/registrace/potvrzeni${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto max-w-xl space-y-6 rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <fieldset className="space-y-3">
        <legend className="font-display text-base font-extrabold text-[var(--magic-ink)]">
          Formát kurzu
        </legend>
        <p className="text-xs font-medium text-slate-600">
          Kurz probíhá vždy online — každá lekce {site.pricing.lessonMinutes}{" "}
          minut, cyklus má {site.pricing.lessons} lekcí.
        </p>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/60 px-3 py-2 text-base font-semibold text-slate-800 has-[:checked]:border-violet-400 has-[:checked]:bg-white sm:text-sm">
          <input
            type="radio"
            name="format"
            checked={format === "skupina"}
            onChange={() => {
              setFormat("skupina");
              setGroupRunId("");
              setIndividualRunId("");
            }}
            className="h-4 w-4 border-2 border-[var(--magic-ink)] text-violet-600"
          />
          Skupina (max. {site.pricing.groupMaxStudents}) —{" "}
          {pricing.skupinaCourseCzk.toLocaleString("cs-CZ")} Kč /{" "}
          {site.pricing.lessons} lekcí
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-violet-50/60 px-3 py-2 text-base font-semibold text-slate-800 has-[:checked]:border-violet-400 has-[:checked]:bg-white sm:text-sm">
          <input
            type="radio"
            name="format"
            checked={format === "individual"}
            onChange={() => {
              setFormat("individual");
              setGroupRunId("");
              setIndividualRunId("");
            }}
            className="h-4 w-4 border-2 border-[var(--magic-ink)] text-violet-600"
          />
          Individuální 1:1 —{" "}
          {pricing.individualCourseCzk.toLocaleString("cs-CZ")} Kč /{" "}
          {site.pricing.lessons} lekcí
        </label>
        <p className="text-xs font-medium leading-relaxed text-slate-600">
          Skupinový kurz spouštíme až po naplnění kapacity termínu (100 % míst).
          Do té doby je přihláška nezávazná. Individuál:{" "}
          {pricing.individualPerLessonCzk} Kč / lekce.
        </p>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/40 px-4 py-4 sm:px-5">
        <legend className="font-display px-1 text-sm font-extrabold text-[var(--magic-ink)]">
          Zařazení podle AI dovedností (doporučeno)
        </legend>
        <p className="text-xs font-medium leading-relaxed text-slate-600">
          Nejlepší je nejdřív vyplnit krátký test. Podle výsledku dítě lépe
          zařadíme do úrovně, která mu bude sedět.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/test-urovne-ai" className="btn-magic-outline text-sm">
            Spustit AI test zdarma 🧠
          </Link>
        </div>
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
          Výsledek úrovně (volitelné)
        </label>
        <select
          value={aiSkillLevel}
          onChange={(e) => {
            const value = parseAiSkillLevel(e.target.value);
            setAiSkillLevel(value ?? "");
            setAiSkillLevelSource(value ? "manual" : "");
          }}
          className="input-playful mt-0"
        >
          <option value="">Zatím neuvedeno</option>
          <option value="beginner">{AI_SKILL_LEVEL_LABELS.beginner}</option>
          <option value="advanced">{AI_SKILL_LEVEL_LABELS.advanced}</option>
          <option value="professional">{AI_SKILL_LEVEL_LABELS.professional}</option>
        </select>
        {aiSkillLevel ? (
          <p className="text-xs font-semibold text-violet-900">
            Vybraná úroveň: {AI_SKILL_LEVEL_LABELS[aiSkillLevel]}
            {aiSkillLevelSource === "self-test" ? " (z AI testu)" : " (ručně zadaná)"}
          </p>
        ) : null}
      </fieldset>

      {format === "skupina" && groupRuns.length > 0 ? (
        <fieldset className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/50 px-4 py-4 sm:px-5">
          <legend className="font-display px-1 text-sm font-extrabold text-[var(--magic-ink)]">
            Termín skupiny (volitelně)
          </legend>
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            Vyberte termín, který vám sedí. Kurz v daném termínu startuje až po
            naplnění všech míst — u každého vidíte, kolik míst už je obsazeno.
            Přihláška je do té doby nezávazná.
          </p>
          <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-violet-200 bg-white/90 px-3 py-2.5 text-base font-semibold text-slate-800 has-[:checked]:border-violet-400 sm:text-sm">
            <input
              type="radio"
              name="skupina-run"
              checked={groupRunId === ""}
              onChange={() => setGroupRunId("")}
              className="mt-0.5 h-4 w-4 shrink-0 border-2 border-[var(--magic-ink)] text-violet-600"
            />
            <span>Zatím nevybráno — termín domluvíme</span>
          </label>
          {groupRuns.map((run) => {
            const counted = occupancyByRunId[run.id] ?? 0;
            const status = courseRunPublicStatus(run, counted);
            const full = !status.acceptsRegistration;
            return (
              <label
                key={run.id}
                className={`flex cursor-pointer flex-col gap-2 rounded-xl border px-3 py-2.5 has-[:checked]:border-violet-400 sm:text-sm ${
                  full
                    ? "cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-500"
                    : "border-violet-200 bg-white/90 text-slate-800 has-[:checked]:bg-white"
                }`}
              >
                <span className="flex items-start gap-2 text-base font-semibold">
                  <input
                    type="radio"
                    name="skupina-run"
                    checked={groupRunId === run.id}
                    onChange={() => setGroupRunId(run.id)}
                    disabled={full}
                    className="mt-0.5 h-4 w-4 shrink-0 border-2 border-[var(--magic-ink)] text-violet-600 disabled:opacity-40"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{run.label}</span>
                    <CourseRunPublicMeta run={run} compact />
                    <CourseRunPriceLabel
                      run={run}
                      defaults={{
                        skupinaCourseCzk: pricing.skupinaCourseCzk,
                        individualCourseCzk: pricing.individualCourseCzk,
                      }}
                      compact
                    />
                    <span className="mt-0.5 block text-xs font-medium leading-relaxed text-slate-600">
                      {run.description}
                    </span>
                  </span>
                </span>
                <div className="pl-6">
                  <CourseRunCapacityStatus
                    run={run}
                    registrationCount={counted}
                    compact
                  />
                </div>
              </label>
            );
          })}
        </fieldset>
      ) : null}
      {format === "skupina" && groupRuns.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/60 px-4 py-3">
          <p className="text-sm font-semibold text-violet-900">
            Konkrétní termíny zatím nejsou vypsané.
          </p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">
            Přihlášku můžete odeslat hned - konkrétní termín vám potvrdíme podle
            zájmu a věkové skupiny.
          </p>
        </div>
      ) : null}

      {format === "individual" && individualRuns.length > 0 ? (
        <fieldset className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/50 px-4 py-4 sm:px-5">
          <legend className="font-display px-1 text-sm font-extrabold text-[var(--magic-ink)]">
            Časový slot 1:1 (volitelně)
          </legend>
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            Pokud máme vypsaný konkrétní slot, můžete ho vybrat - jinak nechte
            pole prázdné a čas domluvíme.
          </p>
          <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-violet-200 bg-white/90 px-3 py-2.5 text-base font-semibold text-slate-800 has-[:checked]:border-violet-400 sm:text-sm">
            <input
              type="radio"
              name="individual-run"
              checked={individualRunId === ""}
              onChange={() => setIndividualRunId("")}
              className="mt-0.5 h-4 w-4 shrink-0 border-2 border-[var(--magic-ink)] text-violet-600"
            />
            <span>Zatím nevybráno — domluvíme čas</span>
          </label>
          {individualRuns.map((run) => {
            const counted = occupancyByRunId[run.id] ?? 0;
            const status = courseRunPublicStatus(run, counted);
            const full = !status.acceptsRegistration;
            return (
              <label
                key={run.id}
                className={`flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2.5 text-base font-semibold has-[:checked]:border-violet-400 sm:text-sm ${
                  full
                    ? "cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-500"
                    : "border-violet-200 bg-white/90 text-slate-800 has-[:checked]:bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="individual-run"
                  checked={individualRunId === run.id}
                  onChange={() => setIndividualRunId(run.id)}
                  disabled={full}
                  className="mt-0.5 h-4 w-4 shrink-0 border-2 border-[var(--magic-ink)] text-violet-600 disabled:opacity-40"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{run.label}</span>
                  <CourseRunPublicMeta run={run} compact />
                  <CourseRunPriceLabel
                    run={run}
                    defaults={{
                      skupinaCourseCzk: pricing.skupinaCourseCzk,
                      individualCourseCzk: pricing.individualCourseCzk,
                    }}
                    compact
                  />
                  <span className="mt-0.5 block text-xs font-medium leading-relaxed text-slate-600">
                    {run.description}
                  </span>
                  <span className="mt-1 block text-[11px] font-bold uppercase tracking-wide text-violet-700">
                    {full ? "Slot obsazen" : "Volný slot"}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>
      ) : null}
      {format === "individual" && individualRuns.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/60 px-4 py-3">
          <p className="text-sm font-semibold text-violet-900">
            Veřejné 1:1 sloty zatím nejsou vypsané.
          </p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-700">
            Přihlášku můžete odeslat - konkrétní čas kurzu s vámi domluvíme.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="childName"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Jméno dítěte
          </label>
          <input
            id="childName"
            required
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="input-playful"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label
            htmlFor="childAge"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Věk ({site.audience.ageMin}–{site.audience.ageMax})
          </label>
          <input
            id="childAge"
            type="number"
            required
            min={site.audience.ageMin}
            max={site.audience.ageMax}
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            className="input-playful"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-dashed border-violet-200 pt-6">
        <p className="font-display text-base font-extrabold text-[var(--magic-ink)]">
          Zákonný zástupce
        </p>
        <div>
          <label
            htmlFor="parentName"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Jméno a příjmení
          </label>
          <input
            id="parentName"
            required
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="input-playful"
            autoComplete="name"
          />
        </div>
        <div>
          <label
            htmlFor="parentEmail"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            E-mail
          </label>
          <input
            id="parentEmail"
            type="email"
            required
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="input-playful"
            autoComplete="email"
          />
        </div>
        <div>
          <label
            htmlFor="parentPhone"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Telefon
          </label>
          <input
            id="parentPhone"
            type="tel"
            required
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
            className="input-playful"
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Honeypot: bez slov „firma“ / „company“ — jinak ho vyplní autofill. */}
      <div
        className="pointer-events-none absolute -left-[10000px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden
      >
        <label htmlFor="reg-form-hp">Nevyplňovat</label>
        <input
          id="reg-form-hp"
          type="text"
          name="reg-form-hp"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          value={hpCompany}
          onChange={(e) => setHpCompany(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            required
            checked={consentTerms}
            onChange={(e) => setConsentTerms(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-2 border-[var(--magic-ink)] text-violet-600"
          />
          <span>
            Souhlasím s{" "}
            <a
              href="/obchodni-podminky"
              className="font-bold text-violet-600 underline"
            >
              obchodními podmínkami
            </a>
            , potvrzuji, že jsem zákonným zástupcem přihlašovaného dítěte a
            uzavírám smlouvu jeho jménem.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            required
            checked={consentPrivacy}
            onChange={(e) => setConsentPrivacy(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-2 border-[var(--magic-ink)] text-violet-600"
          />
          <span>
            Seznámil/a jsem se se{" "}
            <a
              href="/ochrana-osobnich-udaju"
              className="font-bold text-violet-600 underline"
            >
              zásadami ochrany osobních údajů
            </a>{" "}
            a souhlasím se zpracováním údajů za účelem registrace a komunikace o
            kurzu, včetně interního nahrávání online lekcí pro bezpečnost,
            kontrolu kvality a případné řešení reklamací (bez veřejného šíření
            či prodeje záznamů).
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            required
            checked={consentAiTools}
            onChange={(e) => setConsentAiTools(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-2 border-[var(--magic-ink)] text-violet-600"
          />
          <span>
            Souhlasím s tím, aby mé dítě v rámci výuky používalo AI nástroje
            třetích stran (např. ChatGPT, Claude), a beru na vědomí jejich
            věková pravidla a podmínky použití.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            required
            checked={consentEarlyServiceStart}
            onChange={(e) => setConsentEarlyServiceStart(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-2 border-[var(--magic-ink)] text-violet-600"
          />
          <span>
            Výslovně žádám o zahájení poskytování služby i před uplynutím
            14denní lhůty pro odstoupení od smlouvy.
          </span>
        </label>
      </div>

      {turnstileEnabled ? (
        <div className="rounded-2xl border border-violet-200 bg-white/90 px-3 py-4">
          <p className="mb-3 text-xs font-medium leading-relaxed text-slate-600">
            Jednorázové ověření chrání formulář před spamem (Cloudflare Turnstile).
          </p>
          <TurnstileClient
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            onSuccess={(t) => setTurnstileToken(t)}
            onExpire={() => {
              setTurnstileToken("");
              turnstileRef.current?.reset();
            }}
            onError={() => {
              setTurnstileToken("");
              turnstileRef.current?.reset();
            }}
            options={{ theme: "light" }}
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={
          status === "loading" ||
          (turnstileEnabled && turnstileToken.trim().length === 0)
        }
        className="btn-magic w-full disabled:translate-y-0 disabled:opacity-50"
      >
        {status === "loading" ? "Odesílám… ✨" : "Odeslat přihlášku 🚀"}
      </button>
      <p className="text-center text-xs font-semibold text-slate-600">
        Odeslání přihlášky je nezávazné. Po potvrzení otevřených termínů vám
        pošleme dostupné varianty.
      </p>

      {status === "error" ? (
        <p
          role="alert"
          aria-live="assertive"
          className="alert-error font-bold"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
