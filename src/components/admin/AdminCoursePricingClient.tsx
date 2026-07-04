"use client";

import { useState } from "react";
import type { CoursePricing } from "@/lib/course-pricing-store";
import { perLessonCzk } from "@/lib/course-pricing-utils";
import { site } from "@/lib/site-config";

type Props = {
  initialPricing: CoursePricing;
  storage: string;
  lessons: number;
};

export function AdminCoursePricingClient({
  initialPricing,
  storage,
  lessons,
}: Props) {
  const [skupinaCourseCzk, setSkupinaCourseCzk] = useState(
    String(initialPricing.skupinaCourseCzk),
  );
  const [individualCourseCzk, setIndividualCourseCzk] = useState(
    String(initialPricing.individualCourseCzk),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/course-pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          skupinaCourseCzk: Number(skupinaCourseCzk),
          individualCourseCzk: Number(individualCourseCzk),
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : "Uložení se nezdařilo.";
        setError(msg);
        return;
      }
      setMessage(
        `Ceny uloženy (${storage}). Projeví se na webu, v registraci a u nových přihlášek.`,
      );
    } catch {
      setError("Síťová chyba.");
    } finally {
      setPending(false);
    }
  }

  const skupinaNum = Number(skupinaCourseCzk) || 0;
  const individualNum = Number(individualCourseCzk) || 0;

  return (
    <div className="portal-card space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
          Ceny kurzů
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Globální ceny za celý cyklus ({lessons} lekcí ×{" "}
          {site.pricing.lessonMinutes} min). Uloženo v:{" "}
          <strong>{storage}</strong>. Nové přihlášky dostanou tyto částky;
          existující záznamy se nemění.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="admin-price-skupina"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Skupinový kurz (za dítě)
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id="admin-price-skupina"
              type="number"
              min={100}
              max={500000}
              step={100}
              value={skupinaCourseCzk}
              onChange={(e) => setSkupinaCourseCzk(e.target.value)}
              className="input-portal w-full max-w-[10rem]"
            />
            <span className="text-sm font-semibold text-slate-600">Kč / kurz</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            ≈ {perLessonCzk(skupinaNum, lessons).toLocaleString("cs-CZ")} Kč /
            lekce
          </p>
        </div>
        <div>
          <label
            htmlFor="admin-price-individual"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Individuální 1:1 (za účastníka)
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id="admin-price-individual"
              type="number"
              min={100}
              max={500000}
              step={100}
              value={individualCourseCzk}
              onChange={(e) => setIndividualCourseCzk(e.target.value)}
              className="input-portal w-full max-w-[10rem]"
            />
            <span className="text-sm font-semibold text-slate-600">Kč / kurz</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            ≈ {perLessonCzk(individualNum, lessons).toLocaleString("cs-CZ")} Kč /
            lekce
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {site.pricing.vatNote} Ceny se zobrazí na homepage, v registraci, FAQ a
        v potvrzovacích e-mailech u nových přihlášek.
      </p>

      {error ? (
        <p className="alert-error text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="alert-success text-sm">{message}</p> : null}

      <button
        type="button"
        disabled={pending}
        onClick={() => void save()}
        className="btn-portal-primary max-w-xs"
      >
        {pending ? "Ukládám…" : "Uložit ceny"}
      </button>
    </div>
  );
}
