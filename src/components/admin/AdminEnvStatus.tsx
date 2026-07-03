import type { AdminEnvCheck } from "@/lib/admin-env-status";

type Props = {
  checks: AdminEnvCheck[];
};

export function AdminEnvStatus({ checks }: Props) {
  const okCount = checks.filter((c) => c.ok).length;

  return (
    <div className="portal-card space-y-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
          Stav prostředí
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          {okCount}/{checks.length} v pořádku
        </p>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        Rychlá kontrola konfigurace hostingu — bez zobrazení tajných hodnot.
      </p>
      <ul className="space-y-2">
        {checks.map((c) => (
          <li
            key={c.id}
            className={`rounded-xl border px-4 py-3 text-sm ${
              c.ok
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/80"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                  c.ok
                    ? "bg-emerald-200 text-emerald-950"
                    : "bg-amber-200 text-amber-950"
                }`}
              >
                {c.ok ? "OK" : "Pozor"}
              </span>
              <span className="font-bold text-slate-900">{c.label}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {c.detail}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
