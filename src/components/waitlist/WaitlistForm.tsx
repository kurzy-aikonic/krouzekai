"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { site } from "@/lib/site-config";

const turnstileSiteKey =
  typeof process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === "string"
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.trim()
    : "";
const turnstileEnabled = turnstileSiteKey.length > 0;
const TurnstileClient = dynamic(
  () => import("@marsidev/react-turnstile").then((m) => m.Turnstile),
  { ssr: false },
);

type Props = {
  format: "skupina" | "individual";
  runId?: string;
  runLabel?: string;
};

export function WaitlistForm({ format, runId, runLabel }: Props) {
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [note, setNote] = useState("");
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [hpCompany, setHpCompany] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (turnstileEnabled && !turnstileToken) {
      setError("Potvrďte prosím, že nejste robot.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          runId: runId ?? null,
          childName,
          parentName,
          parentEmail,
          parentPhone,
          note,
          consentPrivacy,
          formHoney: hpCompany,
          turnstileToken: turnstileEnabled ? turnstileToken : "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Něco se nepodařilo. Zkuste to znovu.");
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }
      setDone(true);
    } catch {
      setError("Nepodařilo se spojit se serverem. Zkuste to znovu.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card-playful border-emerald-200 bg-emerald-50/70 p-6 text-center">
        <p className="font-display text-lg font-extrabold text-emerald-900">
          Zapsáno do čekací listiny ✅
        </p>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">
          Na e-mail jsme poslali potvrzení. Ozveme se, jakmile se uvolní místo
          nebo otevřeme nový termín stejného formátu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/60 px-4 py-3 text-sm font-semibold text-violet-900">
        {runLabel
          ? `Čekací listina na termín: ${runLabel}`
          : format === "skupina"
            ? "Čekací listina — skupinový kurz"
            : "Čekací listina — individuální 1:1"}
      </div>

      <div>
        <label
          htmlFor="wl-childName"
          className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
        >
          Jméno dítěte (nepovinné)
        </label>
        <input
          id="wl-childName"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="input-playful"
          autoComplete="given-name"
        />
      </div>

      <div className="space-y-4 border-t border-dashed border-violet-200 pt-5">
        <p className="font-display text-base font-extrabold text-[var(--magic-ink)]">
          Zákonný zástupce
        </p>
        <div>
          <label
            htmlFor="wl-parentName"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Jméno a příjmení
          </label>
          <input
            id="wl-parentName"
            required
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="input-playful"
            autoComplete="name"
          />
        </div>
        <div>
          <label
            htmlFor="wl-parentEmail"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            E-mail
          </label>
          <input
            id="wl-parentEmail"
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
            htmlFor="wl-parentPhone"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Telefon (nepovinné)
          </label>
          <input
            id="wl-parentPhone"
            type="tel"
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
            className="input-playful"
            autoComplete="tel"
          />
        </div>
        <div>
          <label
            htmlFor="wl-note"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Poznámka (nepovinné)
          </label>
          <textarea
            id="wl-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input-playful"
            placeholder="Např. preferovaný den a čas."
          />
        </div>
      </div>

      {/* Honeypot: bez slov „firma“ / „company“ — jinak ho vyplní autofill. */}
      <div
        className="pointer-events-none absolute -left-[10000px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden
      >
        <label htmlFor="wl-form-hp">Nevyplňovat</label>
        <input
          id="wl-form-hp"
          type="text"
          name="wl-form-hp"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          value={hpCompany}
          onChange={(e) => setHpCompany(e.target.value)}
        />
      </div>

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
          a souhlasím se zpracováním údajů za účelem zápisu do čekací listiny a
          kontaktování ohledně volného termínu.
        </span>
      </label>

      {turnstileEnabled ? (
        <TurnstileClient
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken("")}
          options={{ theme: "light", size: "normal" }}
        />
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn-magic w-full justify-center disabled:opacity-60"
      >
        {submitting ? "Odesíláme…" : "Zapsat do čekací listiny"}
      </button>

      <p className="text-xs text-slate-500">
        Zápis do čekací listiny nic nestojí a nezavazuje k platbě. Dotazy na{" "}
        <a href={`mailto:${site.contactEmail}`} className="font-semibold underline">
          {site.contactEmail}
        </a>
        .
      </p>
    </form>
  );
}
