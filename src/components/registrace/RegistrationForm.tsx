"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useRef, useState } from "react";
import type { CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import { site } from "@/lib/site-config";

const turnstileSiteKey =
  typeof process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === "string"
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.trim()
    : "";
const turnstileEnabled = turnstileSiteKey.length > 0;

type Props = {
  groupRuns: CourseRun[];
  individualRuns: CourseRun[];
  /** Počty přihlášek počítané do kapacity (bez zrušených / reklamací), podle `run.id`. */
  occupancyByRunId: Record<string, number>;
};

export function RegistrationForm({
  groupRuns,
  individualRuns,
  occupancyByRunId,
}: Props) {
  const [format, setFormat] = useState<"skupina" | "individual">("skupina");
  /** Prázdný řetězec = bez výběru konkrétního termínu. */
  const [groupRunId, setGroupRunId] = useState("");
  const [individualRunId, setIndividualRunId] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("12");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  /** Neviditelné pole — nechte prázdné (antispam). */
  const [hpCompany, setHpCompany] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
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
    setPaymentUrl(null);

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
    if (data.paymentUrl) setPaymentUrl(data.paymentUrl);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card-playful relative mx-auto max-w-xl space-y-6 p-6 sm:p-8"
    >
      <fieldset className="space-y-3">
        <legend className="font-display text-base font-extrabold text-[var(--magic-ink)]">
          Formát kurzu
        </legend>
        <p className="text-xs font-medium text-slate-600">
          Kurz probíhá vždy online — každá lekce {site.pricing.lessonMinutes}{" "}
          minut, cyklus má {site.pricing.lessons} lekcí.
        </p>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-violet-200 bg-violet-50/50 px-3 py-2 text-base font-semibold text-slate-800 has-[:checked]:border-[var(--magic-ink)] has-[:checked]:bg-white sm:text-sm">
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
          {site.pricing.skupinaCourse} Kč / {site.pricing.lessons} lekcí
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-violet-200 bg-violet-50/50 px-3 py-2 text-base font-semibold text-slate-800 has-[:checked]:border-[var(--magic-ink)] has-[:checked]:bg-white sm:text-sm">
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
          Individuální 1:1 — {site.pricing.individualCourse} Kč /{" "}
          {site.pricing.lessons} lekcí
        </label>
        <p className="text-xs font-medium leading-relaxed text-slate-600">
          Skupinový běh otevřeme od {site.pricing.groupMinStudentsToOpen}{" "}
          přihlášených (kapacita max. {site.pricing.groupMaxStudents} dětí na
          lekci). Individuál: {site.pricing.individualPerLesson} Kč / lekce.
        </p>
      </fieldset>

      {format === "skupina" && groupRuns.length > 0 ? (
        <fieldset className="space-y-3 rounded-2xl border-2 border-violet-200 bg-violet-50/50 px-4 py-4 sm:px-5">
          <legend className="font-display px-1 text-sm font-extrabold text-[var(--magic-ink)]">
            Termín skupiny (volitelně)
          </legend>
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            Můžeš vybrat konkrétní běh — nebo nechat prázdné a domluvíme se
            později.
          </p>
          <label className="flex cursor-pointer items-start gap-2 rounded-xl border-2 border-violet-200 bg-white/90 px-3 py-2.5 text-base font-semibold text-slate-800 has-[:checked]:border-[var(--magic-ink)] sm:text-sm">
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
            const free = spotsLeftEffective(run, counted);
            const full = free <= 0;
            return (
              <label
                key={run.id}
                className={`flex cursor-pointer items-start gap-2 rounded-xl border-2 px-3 py-2.5 text-base font-semibold has-[:checked]:border-[var(--magic-ink)] sm:text-sm ${
                  full
                    ? "cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-500"
                    : "border-violet-200 bg-white/90 text-slate-800 has-[:checked]:bg-white"
                }`}
              >
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
                  <span className="mt-0.5 block text-xs font-medium leading-relaxed text-slate-600">
                    {run.description}
                  </span>
                  <span className="mt-1 block text-[11px] font-bold uppercase tracking-wide text-violet-700">
                    {full
                      ? "Kapacita naplněna"
                      : `Ještě ${free} ${free === 1 ? "místo" : free < 5 ? "místa" : "míst"}`}
                  </span>
                </span>
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
            Přihlášku můžeš odeslat hned — konkrétní termín ti potvrdíme podle
            zájmu a věkové skupiny.
          </p>
        </div>
      ) : null}

      {format === "individual" && individualRuns.length > 0 ? (
        <fieldset className="space-y-3 rounded-2xl border-2 border-violet-200 bg-violet-50/50 px-4 py-4 sm:px-5">
          <legend className="font-display px-1 text-sm font-extrabold text-[var(--magic-ink)]">
            Časový slot 1:1 (volitelně)
          </legend>
          <p className="text-xs font-medium leading-relaxed text-slate-600">
            Pokud máme vypsaný konkrétní slot, můžeš ho vybrat — jinak nech
            prázdné a čas domluvíme.
          </p>
          <label className="flex cursor-pointer items-start gap-2 rounded-xl border-2 border-violet-200 bg-white/90 px-3 py-2.5 text-base font-semibold text-slate-800 has-[:checked]:border-[var(--magic-ink)] sm:text-sm">
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
            const free = spotsLeftEffective(run, counted);
            const full = free <= 0;
            return (
              <label
                key={run.id}
                className={`flex cursor-pointer items-start gap-2 rounded-xl border-2 px-3 py-2.5 text-base font-semibold has-[:checked]:border-[var(--magic-ink)] sm:text-sm ${
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
                  <span className="mt-0.5 block text-xs font-medium leading-relaxed text-slate-600">
                    {run.description}
                  </span>
                  <span className="mt-1 block text-[11px] font-bold uppercase tracking-wide text-violet-700">
                    {full
                      ? "Obsazeno"
                      : `Ještě ${free} ${free === 1 ? "místo" : free < 5 ? "místa" : "míst"}`}
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
            Přihlášku můžeš odeslat — konkrétní čas kurzu s tebou domluvíme.
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

      <div className="space-y-4 border-t-2 border-dashed border-violet-200 pt-6">
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
            .
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
            kurzu.
          </span>
        </label>
      </div>

      {turnstileEnabled ? (
        <div className="rounded-2xl border-2 border-violet-200 bg-white/90 px-3 py-4">
          <p className="mb-3 text-xs font-medium leading-relaxed text-slate-600">
            Jednorázové ověření chrání formulář před spamem (Cloudflare Turnstile).
          </p>
          <Turnstile
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

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="space-y-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-950"
        >
          <p>{message}</p>
          {paymentUrl ? (
            <Link
              href={paymentUrl}
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-emerald-800 bg-emerald-600 px-4 py-3 text-center font-display font-extrabold text-white shadow-[3px_3px_0_#064e3b] hover:bg-emerald-700 sm:w-auto"
            >
              Přehled k platbě (po domluvě) 💳
            </Link>
          ) : null}
        </div>
      ) : null}
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
