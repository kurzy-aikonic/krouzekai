"use client";

import { useState } from "react";
import type { WaitlistEntry, WaitlistStatus } from "@/types/waitlist";
import { waitlistStatuses, waitlistStatusLabelsCs } from "@/types/waitlist";

type Props = {
  initialItems: WaitlistEntry[];
};

const STATUS_BADGE: Record<WaitlistStatus, string> = {
  nova: "border-violet-300 bg-violet-50 text-violet-900",
  kontaktovano: "border-amber-300 bg-amber-50 text-amber-950",
  prevedeno: "border-emerald-300 bg-emerald-50 text-emerald-900",
  uzavreno: "border-slate-300 bg-slate-100 text-slate-600",
};

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function AdminWaitlistClient({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(id: string, status: WaitlistStatus) {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        item?: WaitlistEntry;
        error?: string;
      };
      if (!res.ok || !data.item) {
        setError(data.error ?? "Uložení se nepodařilo.");
        return;
      }
      setItems((prev) => prev.map((e) => (e.id === id ? data.item! : e)));
    } catch {
      setError("Nepodařilo se spojit se serverem.");
    } finally {
      setSavingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="mt-8 rounded-2xl border border-slate-200 bg-white/70 px-5 py-6 text-sm text-slate-600">
        Zatím žádní zájemci v čekací listině.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {error}
        </p>
      ) : null}
      {items.map((entry) => (
        <div
          key={entry.id}
          className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-sm font-extrabold text-slate-900">
                {entry.parentName}{" "}
                <span className="font-normal text-slate-500">
                  · {entry.parentEmail}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {entry.parentPhone ?? "bez telefonu"} · dítě:{" "}
                {entry.childName ?? "neuvedeno"}
              </p>
              <p className="mt-1 text-xs font-semibold text-violet-700">
                {entry.format === "skupina" ? "Skupinový kurz" : "Individuální 1:1"}
                {entry.runLabel ? ` — ${entry.runLabel}` : ""}
              </p>
              {entry.note ? (
                <p className="mt-2 max-w-xl text-sm text-slate-700">
                  „{entry.note}“
                </p>
              ) : null}
              <p className="mt-2 text-[11px] text-slate-400">
                Zapsáno: {formatDate(entry.receivedAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`rounded-full border-2 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${STATUS_BADGE[entry.status]}`}
              >
                {waitlistStatusLabelsCs[entry.status]}
              </span>
              <select
                value={entry.status}
                disabled={savingId === entry.id}
                onChange={(e) =>
                  updateStatus(entry.id, e.target.value as WaitlistStatus)
                }
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60"
              >
                {waitlistStatuses.map((s) => (
                  <option key={s} value={s}>
                    {waitlistStatusLabelsCs[s]}
                  </option>
                ))}
              </select>
              <a
                href={`mailto:${entry.parentEmail}`}
                className="text-xs font-semibold text-violet-700 underline"
              >
                Napsat e-mail
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
