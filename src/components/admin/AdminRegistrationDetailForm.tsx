"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CourseRun } from "@/data/course-runs";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { registrationStatusPillClassName } from "@/lib/registration-status-ui";
import type { RegistrationRecord } from "@/types/registration";
import type { RegistrationStatus } from "@/types/registration";
import {
  registrationStatuses,
  registrationStatusLabelsCs,
} from "@/types/registration";

type Props = {
  record: RegistrationRecord;
  writable: boolean;
  courseRuns: CourseRun[];
};

export function AdminRegistrationDetailForm({
  record,
  writable,
  courseRuns,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<RegistrationStatus>(record.status);
  const [internalNotes, setInternalNotes] = useState(record.internalNotes ?? "");
  const [runId, setRunId] = useState<string>(record.runId ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setPending(true);
    const body: {
      status?: RegistrationStatus;
      internalNotes?: string;
      runId?: string | null;
    } = {
      status,
      internalNotes,
    };
    if (record.format === "skupina") {
      body.runId = runId === "" ? null : runId;
    }
    try {
      const res = await fetch(
        `/api/admin/registrations/${encodeURIComponent(getPublicRegistrationCode(record))}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
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
        setPending(false);
        return;
      }
      setMessage("Uloženo.");
      router.refresh();
    } catch {
      setError("Síťová chyba.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
          Údaje z přihlášky
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Dítě</dt>
            <dd className="mt-0.5 font-medium text-slate-900">
              {record.childName}, {record.childAge} let
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Formát</dt>
            <dd className="mt-0.5 text-slate-800">
              {record.format === "skupina" ? "Skupinový kurz" : "Individuální 1:1"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Rodič</dt>
            <dd className="mt-0.5 text-slate-800">{record.parentName}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">E-mail</dt>
            <dd className="mt-0.5">
              <a
                className="font-medium text-violet-700 underline"
                href={`mailto:${record.parentEmail}`}
              >
                {record.parentEmail}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Telefon</dt>
            <dd className="mt-0.5">
              <a className="text-slate-800" href={`tel:${record.parentPhone}`}>
                {record.parentPhone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Částka</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">
              {record.amountCzk} Kč · {record.paymentProduct}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Souhlasy</dt>
            <dd className="mt-0.5 text-slate-700">
              OP: {record.consentTerms ? "ano" : "ne"} · GDPR:{" "}
              {record.consentPrivacy ? "ano" : "ne"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-slate-500">Přijato</dt>
            <dd className="mt-0.5 text-slate-700">
              {record.receivedAt
                ? new Date(record.receivedAt).toLocaleString("cs-CZ")
                : "—"}
            </dd>
          </div>
          {record.updatedAt ? (
            <div>
              <dt className="text-xs font-bold uppercase text-slate-500">
                Naposledy upraveno
              </dt>
              <dd className="mt-0.5 text-slate-700">
                {new Date(record.updatedAt).toLocaleString("cs-CZ")}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
          Správa
        </h2>

        {!writable ? (
          <p className="mt-3 text-sm text-amber-800">
            Úpravy nejsou dostupné (webhook režim bez JSONL na serveru).
          </p>
        ) : null}

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500">
              Stav platby / workflow
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${registrationStatusPillClassName(status)}`}
              >
                {registrationStatusLabelsCs[status]}
              </span>
              <span className="text-xs text-slate-500">náhled podle výběru</span>
            </div>
            <select
              value={status}
              disabled={!writable}
              onChange={(e) => setStatus(e.target.value as RegistrationStatus)}
              className="input-portal mt-3 block w-full max-w-md disabled:opacity-50"
            >
              {registrationStatuses.map((k) => (
                <option key={k} value={k}>
                  {registrationStatusLabelsCs[k]}
                </option>
              ))}
            </select>
          </div>

          {record.format === "skupina" ? (
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">
                Skupinový termín
              </label>
              <select
                value={runId}
                disabled={!writable}
                onChange={(e) => setRunId(e.target.value)}
                className="input-portal mt-1.5 block max-w-xl disabled:opacity-50"
              >
                <option value="">— bez přiřazení —</option>
                {courseRuns.map((run) => (
                  <option key={run.id} value={run.id}>
                    {run.label}
                    {run.active === false ? " — zrušený" : ""} (ručně{" "}
                    {run.filled}/{run.capacity})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Přehled skutečných přihlášek podle termínů je v adminu na stránce{" "}
                <strong>Termíny</strong>. Zrušený termín lze přiřadit kvůli historii,
                na webu se nově nenabízí.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Individuální kurz nemá veřejný výběr termínu v kalendáři — přiřazení
              běhu řešíte mimo tento výběr (poznámka níže).
            </p>
          )}

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">
              Interní poznámky
            </label>
            <textarea
              value={internalNotes}
              disabled={!writable}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-violet-500 focus:ring-2 disabled:opacity-50"
              placeholder="Domluva, faktura, speciální požadavky…"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p>
        ) : null}

        <button
          type="button"
          disabled={!writable || pending}
          onClick={() => void save()}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Ukládám…" : "Uložit změny"}
        </button>
      </section>
    </div>
  );
}
