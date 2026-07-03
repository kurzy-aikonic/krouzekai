"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CourseRun } from "@/data/course-runs";
import { registrationsToCsv } from "@/lib/admin-registrations-csv";
import { isAwaitingPayment } from "@/lib/admin-payment-stats";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { variableSymbolFromRegistrationId } from "@/lib/payment";
import { registrationStatusPillClassName } from "@/lib/registration-status-ui";
import type {
  RegistrationRecord,
  RegistrationStatus,
} from "@/types/registration";
import {
  registrationStatuses,
  registrationStatusLabelsCs,
} from "@/types/registration";

function runLabel(r: RegistrationRecord, courseRuns: CourseRun[]): string {
  if (!r.runId) return "—";
  return (
    courseRuns.find((cr) => cr.id === r.runId && cr.format === r.format)
      ?.label ?? r.runId
  );
}

type Props = {
  initialItems: RegistrationRecord[];
  writable: boolean;
  courseRuns: CourseRun[];
  initialStatusFilter?: RegistrationStatus | "vse";
  initialFormat?: "vse" | "skupina" | "individual";
  initialRunFilter?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialQuery?: string;
  initialAwaitingPayment?: boolean;
};

export function AdminRegistrationsClient({
  initialItems,
  writable,
  courseRuns,
  initialStatusFilter = "vse",
  initialFormat = "vse",
  initialRunFilter = "vse",
  initialDateFrom = "",
  initialDateTo = "",
  initialQuery = "",
  initialAwaitingPayment = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQuery);
  const [status, setStatus] = useState<RegistrationStatus | "vse">(
    initialStatusFilter,
  );
  const [format, setFormat] = useState<"vse" | "skupina" | "individual">(
    initialFormat,
  );
  const [runFilter, setRunFilter] = useState<string>(initialRunFilter);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  const [awaitingPayment, setAwaitingPayment] = useState(
    initialAwaitingPayment,
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [bulkStatus, setBulkStatus] = useState<RegistrationStatus>(
    initialStatusFilter !== "vse" ? initialStatusFilter : "kontaktovano",
  );
  const [bulkSendEmails, setBulkSendEmails] = useState(false);
  const [bulkPending, setBulkPending] = useState(false);
  const [bulkRunId, setBulkRunId] = useState<string>("");
  const [bulkRunPending, setBulkRunPending] = useState(false);
  const [bulkMsg, setBulkMsg] = useState<string | null>(null);
  const [bulkErr, setBulkErr] = useState<string | null>(null);

  const kpi = useMemo(() => {
    const byStatus = Object.fromEntries(
      registrationStatuses.map((s) => [s, 0]),
    ) as Record<RegistrationStatus, number>;
    for (const r of initialItems) {
      byStatus[r.status] += 1;
    }
    return { byStatus, total: initialItems.length };
  }, [initialItems]);

  useEffect(() => {
    setSelected(new Set());
  }, [q, status, format, runFilter, dateFrom, dateTo, awaitingPayment]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "vse") params.set("status", status);
    if (format !== "vse") params.set("format", format);
    if (runFilter !== "vse") params.set("run", runFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    if (q.trim()) params.set("q", q.trim());
    if (awaitingPayment) params.set("view", "ceka_platbu");
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `/admin?${next}` : "/admin", { scroll: false });
    }
  }, [
    status,
    format,
    runFilter,
    dateFrom,
    dateTo,
    q,
    awaitingPayment,
    router,
    searchParams,
  ]);

  useEffect(() => {
    if (status !== "vse") setBulkStatus(status);
  }, [status]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return initialItems.filter((r) => {
      if (awaitingPayment && !isAwaitingPayment(r.status)) return false;
      if (status !== "vse" && r.status !== status) return false;
      if (format !== "vse" && r.format !== format) return false;
      if (runFilter === "__none__") {
        if (r.runId?.trim()) return false;
      } else if (runFilter !== "vse" && r.runId !== runFilter) {
        return false;
      }
      if (dateFrom) {
        const day = r.receivedAt?.slice(0, 10);
        if (!day || day < dateFrom) return false;
      }
      if (dateTo) {
        const day = r.receivedAt?.slice(0, 10);
        if (!day || day > dateTo) return false;
      }
      if (!needle) return true;
      const hay = [
        r.id,
        getPublicRegistrationCode(r),
        r.parentEmail,
        r.parentName,
        r.parentPhone,
        r.childName,
        String(r.childAge),
        r.internalNotes ?? "",
        runLabel(r, courseRuns),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [initialItems, q, status, format, runFilter, dateFrom, dateTo, awaitingPayment, courseRuns]);

  const filtersActive =
    q.trim().length > 0 ||
    status !== "vse" ||
    format !== "vse" ||
    runFilter !== "vse" ||
    dateFrom.length > 0 ||
    dateTo.length > 0 ||
    awaitingPayment;

  function toggleRow(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleAllFiltered() {
    const allOn =
      filtered.length > 0 && filtered.every((r) => selected.has(r.id));
    setSelected((prev) => {
      const n = new Set(prev);
      if (allOn) {
        for (const r of filtered) n.delete(r.id);
      } else {
        for (const r of filtered) n.add(r.id);
      }
      return n;
    });
  }

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((r) => selected.has(r.id));

  async function applyBulkStatus() {
    if (selected.size === 0) return;
    const label = registrationStatusLabelsCs[bulkStatus];
    const emailNote = bulkSendEmails
      ? "\n\nRodičům u změněných přihlášek se pošle e-mail o novém stavu."
      : "\n\nE-maily rodičům se neposílají (zaškrtněte volbu níže pro odeslání).";
    if (
      !window.confirm(
        `Změnit stav u ${selected.size} přihlášek na „${label}“?${emailNote}`,
      )
    ) {
      return;
    }
    setBulkMsg(null);
    setBulkErr(null);
    setBulkPending(true);
    const lookups = Array.from(selected)
      .map((id) => initialItems.find((r) => r.id === id))
      .filter((r): r is RegistrationRecord => r != null)
      .map((r) => getPublicRegistrationCode(r));
    try {
      const res = await fetch("/api/admin/registrations/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lookups,
          status: bulkStatus,
          sendEmails: bulkSendEmails,
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
            : "Akce se nezdařila.";
        setBulkErr(msg);
        return;
      }
      const updated =
        typeof data === "object" &&
        data &&
        "updated" in data &&
        typeof (data as { updated?: unknown }).updated === "number"
          ? (data as { updated: number }).updated
          : 0;
      const already =
        typeof data === "object" &&
        data &&
        "alreadyHadStatus" in data &&
        typeof (data as { alreadyHadStatus?: unknown }).alreadyHadStatus ===
          "number"
          ? (data as { alreadyHadStatus: number }).alreadyHadStatus
          : 0;
      const nf =
        typeof data === "object" &&
        data &&
        "notFound" in data &&
        Array.isArray((data as { notFound?: unknown }).notFound)
          ? (data as { notFound: string[] }).notFound
          : [];
      const emailsSent =
        typeof data === "object" &&
        data &&
        "emailsSent" in data &&
        typeof (data as { emailsSent?: unknown }).emailsSent === "number"
          ? (data as { emailsSent: number }).emailsSent
          : undefined;
      setBulkMsg(
        `Změněno záznamů: ${updated}. Už měly tento stav: ${already}.${nf.length ? ` Nenalezeno: ${nf.join(", ")}.` : ""}${emailsSent != null ? ` E-mailů odesláno: ${emailsSent}.` : ""}`,
      );
      setSelected(new Set());
      router.refresh();
    } catch {
      setBulkErr("Síťová chyba.");
    } finally {
      setBulkPending(false);
    }
  }

  async function applyBulkRun() {
    if (selected.size === 0) return;
    const label =
      bulkRunId === ""
        ? "bez termínu"
        : (courseRuns.find((r) => r.id === bulkRunId)?.label ?? bulkRunId);
    if (
      !window.confirm(
        `Přiřadit termín „${label}“ u ${selected.size} přihlášek?`,
      )
    ) {
      return;
    }
    setBulkMsg(null);
    setBulkErr(null);
    setBulkRunPending(true);
    const lookups = Array.from(selected)
      .map((id) => initialItems.find((r) => r.id === id))
      .filter((r): r is RegistrationRecord => r != null)
      .map((r) => getPublicRegistrationCode(r));
    try {
      const res = await fetch("/api/admin/registrations/bulk-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lookups,
          runId: bulkRunId === "" ? null : bulkRunId,
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
            : "Akce se nezdařila.";
        setBulkErr(msg);
        return;
      }
      const updated =
        typeof data === "object" &&
        data &&
        "updated" in data &&
        typeof (data as { updated?: unknown }).updated === "number"
          ? (data as { updated: number }).updated
          : 0;
      const skipped =
        typeof data === "object" &&
        data &&
        "skippedFormat" in data &&
        typeof (data as { skippedFormat?: unknown }).skippedFormat === "number"
          ? (data as { skippedFormat: number }).skippedFormat
          : 0;
      setBulkMsg(
        `Termín přiřazen u ${updated} přihlášek.${skipped ? ` Přeskočeno (jiný formát): ${skipped}.` : ""}`,
      );
      setSelected(new Set());
      router.refresh();
    } catch {
      setBulkErr("Síťová chyba.");
    } finally {
      setBulkRunPending(false);
    }
  }

  function downloadFilteredCsv() {
    const csv = registrationsToCsv(filtered, (r) => runLabel(r, courseRuns));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prihlasky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="portal-card p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Celkem {kpi.total} · podle stavu
        </p>
        <ul className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
          {registrationStatuses.map((s) => (
            <li
              key={s}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${registrationStatusPillClassName(s)}`}
            >
              {registrationStatusLabelsCs[s]}: {kpi.byStatus[s]}
            </li>
          ))}
        </ul>
      </div>

      {!writable ? (
        <div className="portal-card border-l-4 border-amber-400 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          <strong>Jen pro čtení.</strong> Přihlášky můžete prohlížet, ale stav,
          poznámky a termín upravovat v tomto režimu nelze.
        </div>
      ) : null}

      <div className="portal-card flex flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-end sm:p-5">
        <div className="min-w-[200px] flex-1">
          <label
            htmlFor="admin-reg-filter-q"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Hledat
          </label>
          <input
            ref={searchRef}
            id="admin-reg-filter-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jméno, e-mail, telefon, id…"
            className="input-portal mt-1.5"
            autoComplete="off"
          />
          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Zkratka: klávesa <kbd className="rounded border border-slate-200 bg-slate-50 px-1">/</kbd>{" "}
            zaměří vyhledávání (mimo textové pole).
          </p>
        </div>
        <div>
          <label
            htmlFor="admin-reg-filter-status"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Stav platby
          </label>
          <select
            id="admin-reg-filter-status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as RegistrationStatus | "vse")
            }
            className="input-portal mt-1.5 block min-w-[160px]"
          >
            <option value="vse">Všechny</option>
            {registrationStatuses.map((s) => (
              <option key={s} value={s}>
                {registrationStatusLabelsCs[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="admin-reg-filter-format"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Formát
          </label>
          <select
            id="admin-reg-filter-format"
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as "vse" | "skupina" | "individual")
            }
            className="input-portal mt-1.5 block min-w-[140px]"
          >
            <option value="vse">Vše</option>
            <option value="skupina">Skupina</option>
            <option value="individual">Individuál</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="admin-reg-filter-run"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Termín
          </label>
          <select
            id="admin-reg-filter-run"
            value={runFilter}
            onChange={(e) => setRunFilter(e.target.value)}
            className="input-portal mt-1.5 block min-w-[180px] max-w-xs"
          >
            <option value="vse">Všechny</option>
            <option value="__none__">Bez termínu</option>
            {courseRuns.map((run) => (
              <option key={run.id} value={run.id}>
                {run.label}
                {run.active === false ? " (skrytý)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="admin-reg-filter-from"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Přijato od
          </label>
          <input
            id="admin-reg-filter-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input-portal mt-1.5 block min-w-[140px]"
          />
        </div>
        <div>
          <label
            htmlFor="admin-reg-filter-to"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Přijato do
          </label>
          <input
            id="admin-reg-filter-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input-portal mt-1.5 block min-w-[140px]"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={awaitingPayment}
            onChange={(e) => setAwaitingPayment(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-violet-600"
          />
          Jen čeká na platbu
        </label>
        <div className="flex flex-col gap-2 sm:ml-auto sm:items-end sm:self-center">
          <p className="text-xs text-slate-500">
            Zobrazeno {filtered.length} z {initialItems.length}
          </p>
          <button
            type="button"
            onClick={() => downloadFilteredCsv()}
            disabled={filtered.length === 0}
            className="btn-portal-outline max-w-[12rem] py-2 text-xs disabled:opacity-40"
          >
            Export CSV (filtr)
          </button>
        </div>
      </div>

      {writable && selected.size > 0 ? (
        <div className="portal-card space-y-3 border-violet-200 p-4 sm:p-5">
          <p className="text-sm font-medium text-slate-800">
            Vybráno <strong>{selected.size}</strong> přihlášek.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div>
              <label
                htmlFor="admin-bulk-status"
                className="text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Nový stav
              </label>
              <select
                id="admin-bulk-status"
                value={bulkStatus}
                onChange={(e) =>
                  setBulkStatus(e.target.value as RegistrationStatus)
                }
                className="input-portal mt-1.5 block min-w-[200px]"
              >
                {registrationStatuses.map((s) => (
                  <option key={s} value={s}>
                    {registrationStatusLabelsCs[s]}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={bulkSendEmails}
                onChange={(e) => setBulkSendEmails(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-violet-600"
              />
              Poslat e-mail rodičům (u změněných)
            </label>
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => void applyBulkStatus()}
              className="btn-portal-primary max-w-xs"
            >
              {bulkPending ? "Ukládám…" : "Použít stav"}
            </button>
            <div>
              <label
                htmlFor="admin-bulk-run"
                className="text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                Termín
              </label>
              <select
                id="admin-bulk-run"
                value={bulkRunId}
                onChange={(e) => setBulkRunId(e.target.value)}
                className="input-portal mt-1.5 block min-w-[200px]"
              >
                <option value="">— bez termínu —</option>
                {courseRuns.map((run) => (
                  <option key={run.id} value={run.id}>
                    {run.label}
                    {run.active === false ? " (skrytý)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={bulkRunPending}
              onClick={() => void applyBulkRun()}
              className="btn-portal-outline max-w-xs"
            >
              {bulkRunPending ? "Ukládám…" : "Přiřadit termín"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(new Set());
                setBulkMsg(null);
                setBulkErr(null);
              }}
              className="btn-portal-ghost text-xs"
            >
              Zrušit výběr
            </button>
          </div>
          {bulkErr ? (
            <p className="alert-error text-sm" role="alert">
              {bulkErr}
            </p>
          ) : null}
          {bulkMsg ? (
            <p className="alert-success text-sm">{bulkMsg}</p>
          ) : null}
        </div>
      ) : null}

      <div className="portal-card overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-10 px-2 py-3">
                {writable ? (
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={() => toggleAllFiltered()}
                    aria-label="Vybrat vše zobrazené řádky"
                    className="h-4 w-4 rounded border-slate-300 text-violet-600"
                  />
                ) : null}
              </th>
              <th className="px-3 py-3">Přijato</th>
              <th className="px-3 py-3">Dítě</th>
              <th className="px-3 py-3">Rodič / kontakt</th>
              <th className="px-3 py-3">Formát</th>
              <th className="px-3 py-3">Stav</th>
              <th className="px-3 py-3">VS</th>
              <th className="px-3 py-3">Termín</th>
              <th className="px-3 py-3">Kód</th>
              <th className="px-3 py-3 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => {
              const pub = getPublicRegistrationCode(r);
              const detailHref = `/admin/registrations/${encodeURIComponent(pub)}`;
              return (
              <tr
                key={r.id}
                className="cursor-pointer hover:bg-violet-50/40"
                onClick={() => router.push(detailHref)}
              >
                <td
                  className="px-2 py-2 align-middle"
                  onClick={(e) => e.stopPropagation()}
                >
                  {writable ? (
                    <input
                      type="checkbox"
                      checked={selected.has(r.id)}
                      onChange={() => toggleRow(r.id)}
                      aria-label={`Vybrat přihlášku ${pub}`}
                      className="h-4 w-4 rounded border-slate-300 text-violet-600"
                    />
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                  {r.receivedAt
                    ? new Date(r.receivedAt).toLocaleString("cs-CZ")
                    : "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="font-semibold text-slate-800">{r.childName}</div>
                  <div className="text-xs text-slate-500">{r.childAge} let</div>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-slate-800">{r.parentName}</div>
                  <div className="text-xs text-slate-600">{r.parentEmail}</div>
                  <div className="text-xs text-slate-500">{r.parentPhone}</div>
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {r.format === "skupina" ? "Skupina" : "1:1"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex max-w-full rounded-full border px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${registrationStatusPillClassName(r.status)}`}
                  >
                    {registrationStatusLabelsCs[r.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-600">
                  {variableSymbolFromRegistrationId(r.id)}
                </td>
                <td className="max-w-[200px] px-3 py-2 text-xs text-slate-600">
                  {runLabel(r, courseRuns)}
                </td>
                <td className="px-3 py-2">
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {pub}
                  </span>
                </td>
                <td
                  className="px-3 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={detailHref}
                    className="font-bold text-violet-700 underline decoration-violet-200 underline-offset-2 hover:text-violet-900"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            {initialItems.length === 0
              ? "Zatím žádné přihlášky. Po první registraci na webu se zobrazí zde."
              : filtersActive
                ? "Filtru neodpovídá žádná přihláška. Zkuste upravit hledání nebo filtry."
                : "Žádné záznamy k zobrazení."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
