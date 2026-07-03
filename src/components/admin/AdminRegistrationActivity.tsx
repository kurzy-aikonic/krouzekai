import type {
  AdminHistoryEntry,
  RegistrationEmailLogEntry,
} from "@/types/registration";

const EMAIL_KIND_LABELS: Record<RegistrationEmailLogEntry["kind"], string> = {
  confirmation: "Potvrzení přihlášky",
  status_change: "Změna stavu",
  resend_confirmation: "Znovu potvrzení",
  bulk_status_change: "Hromadná změna stavu",
};

type Props = {
  adminHistory?: AdminHistoryEntry[];
  emailLog?: RegistrationEmailLogEntry[];
};

export function AdminRegistrationActivity({ adminHistory, emailLog }: Props) {
  const history = adminHistory ?? [];
  const emails = emailLog ?? [];

  if (history.length === 0 && emails.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
          Historie a e-maily
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Zatím žádné záznamy — po první úpravě nebo odeslaném e-mailu se zobrazí
          zde.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {emails.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
            Odeslané e-maily
          </h2>
          <ul className="mt-4 space-y-3">
            {emails.map((e, i) => (
              <li
                key={`${e.at}-${i}`}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                      e.ok
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-red-100 text-red-900"
                    }`}
                  >
                    {e.ok ? "Odesláno" : "Chyba"}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {EMAIL_KIND_LABELS[e.kind]}
                  </span>
                </div>
                <p className="mt-1 text-slate-600">
                  {new Date(e.at).toLocaleString("cs-CZ")} · {e.to}
                  {e.actor ? ` · ${e.actor}` : ""}
                </p>
                {e.note ? (
                  <p className="mt-1 text-xs text-slate-500">{e.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {history.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
            Audit log
          </h2>
          <ul className="mt-4 space-y-3">
            {history.map((h, i) => (
              <li
                key={`${h.at}-${i}`}
                className="rounded-xl border border-slate-100 px-4 py-3 text-sm"
              >
                <p className="font-medium text-slate-900">{h.summary}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(h.at).toLocaleString("cs-CZ")} · {h.actor}
                </p>
                {h.changes ? (
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {Object.entries(h.changes).map(([field, diff]) => (
                      <li key={field}>
                        <strong>{field}:</strong>{" "}
                        {String(diff.from ?? "—")} → {String(diff.to ?? "—")}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
