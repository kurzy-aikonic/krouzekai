"use client";

import Link from "next/link";
import { useState } from "react";
import type { CourseRun } from "@/data/course-runs";
import { spotsLeft } from "@/data/course-runs";
import { site } from "@/lib/site-config";

type Props = {
  runs: CourseRun[];
};

export function RegistrationForm({ runs }: Props) {
  const [format, setFormat] = useState<"skupina" | "individual">("skupina");
  const [runId, setRunId] = useState(runs[0]?.id ?? "");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("12");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setPaymentUrl(null);

    const res = await fetch("/api/registrace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        format,
        runId: format === "skupina" ? runId : null,
        childName,
        childAge: Number(childAge),
        parentName,
        parentEmail,
        parentPhone,
        consentTerms,
        consentPrivacy,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      paymentUrl?: string;
      registrationId?: string;
    };

    if (!res.ok) {
      setStatus("error");
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
      className="card-playful mx-auto max-w-xl space-y-6 p-6 sm:p-8"
    >
      <fieldset className="space-y-3">
        <legend className="font-display text-base font-extrabold text-[var(--magic-ink)]">
          Formát kurzu
        </legend>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-violet-200 bg-violet-50/50 px-3 py-2 text-sm font-semibold text-slate-800 has-[:checked]:border-[var(--magic-ink)] has-[:checked]:bg-white">
          <input
            type="radio"
            name="format"
            checked={format === "skupina"}
            onChange={() => setFormat("skupina")}
            className="h-4 w-4 border-2 border-[var(--magic-ink)] text-violet-600"
          />
          Skupina (max. 6) — {site.pricing.skupinaCourse} Kč /{" "}
          {site.pricing.lessons} lekcí
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-violet-200 bg-violet-50/50 px-3 py-2 text-sm font-semibold text-slate-800 has-[:checked]:border-[var(--magic-ink)] has-[:checked]:bg-white">
          <input
            type="radio"
            name="format"
            checked={format === "individual"}
            onChange={() => setFormat("individual")}
            className="h-4 w-4 border-2 border-[var(--magic-ink)] text-violet-600"
          />
          Individuální 1:1 — {site.pricing.individualCourse} Kč /{" "}
          {site.pricing.lessons} lekcí
        </label>
      </fieldset>

      {format === "skupina" ? (
        <div>
          <label
            htmlFor="runId"
            className="block font-display text-sm font-extrabold text-[var(--magic-ink)]"
          >
            Termín
          </label>
          <select
            id="runId"
            required
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
            className="input-playful"
          >
            {runs.map((r) => (
              <option key={r.id} value={r.id} disabled={spotsLeft(r) <= 0}>
                {r.label}
                {spotsLeft(r) <= 0
                  ? " — plno"
                  : ` — volno ${spotsLeft(r)} / ${r.capacity}`}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Obsazenost uprav v souboru dat běhů nebo napoj admin.
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
            Věk (10–15)
          </label>
          <input
            id="childAge"
            type="number"
            required
            min={10}
            max={15}
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

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-magic w-full disabled:translate-y-0 disabled:opacity-50"
      >
        {status === "loading" ? "Odesílám… ✨" : "Odeslat přihlášku 🚀"}
      </button>

      {status === "success" ? (
        <div className="space-y-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-950">
          <p>{message}</p>
          {paymentUrl ? (
            <Link
              href={paymentUrl}
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-emerald-800 bg-emerald-600 px-4 py-3 text-center font-display font-extrabold text-white shadow-[3px_3px_0_#064e3b] hover:bg-emerald-700 sm:w-auto"
            >
              Pokračovat k platbě 💳
            </Link>
          ) : null}
        </div>
      ) : null}
      {status === "error" ? (
        <p className="rounded-2xl border-2 border-red-400 bg-red-50 px-4 py-3 text-sm font-bold text-red-900">
          {message}
        </p>
      ) : null}
    </form>
  );
}
