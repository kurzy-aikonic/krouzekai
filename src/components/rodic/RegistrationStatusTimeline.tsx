import { site } from "@/lib/site-config";
import type { RegistrationStatus } from "@/types/registration";
import { registrationStatusLabelsCs } from "@/types/registration";

const NEGATIVE: RegistrationStatus[] = [
  "zruseno",
  "vraceny_penize",
  "reklamace",
];

const FLOW = ["nova", "kontaktovano", "zaplaceno"] as const;
type FlowStep = (typeof FLOW)[number];

const STEP_META: Record<FlowStep, { title: string; hint: string }> = {
  nova: {
    title: "Přihláška přijata",
    hint: "Máme vaše údaje, brzy se ozveme s dalšími kroky.",
  },
  kontaktovano: {
    title: "Kontaktováno",
    hint: "Domlouváme detaily, fakturu a případný termín kurzu.",
  },
  zaplaceno: {
    title: "Zaplaceno",
    hint: "Platba zaznamenána — potvrdíme organizaci kurzu.",
  },
};

type Props = {
  status: RegistrationStatus;
};

export function RegistrationStatusTimeline({ status }: Props) {
  if (NEGATIVE.includes(status)) {
    return (
      <div className="mt-5 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-950">
        <p className="font-display text-xs font-extrabold uppercase tracking-wide text-red-800">
          Stav přihlášky
        </p>
        <p className="mt-1 font-semibold">
          {registrationStatusLabelsCs[status]}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-red-900/90">
          Máte dotaz ke stavu? Napište nám na{" "}
          <a
            className="font-bold underline decoration-red-300"
            href={`mailto:${site.contactEmail}`}
          >
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  const activeIndex = (FLOW as readonly RegistrationStatus[]).indexOf(status);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Jak to u nás typicky pokračuje
      </p>
      <ol className="mt-4 space-y-0">
        {FLOW.map((key, i) => {
          const done = i < safeIndex;
          const current = i === safeIndex;
          const meta = STEP_META[key];
          const last = i === FLOW.length - 1;
          return (
            <li key={key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                    done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : current
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                {!last ? (
                  <div
                    className={`my-1 w-0.5 flex-1 min-h-[12px] ${
                      done ? "bg-emerald-300" : "bg-slate-200"
                    }`}
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className={`min-w-0 pb-6 ${last ? "pb-0" : ""}`}>
                <p
                  className={`text-sm font-extrabold ${
                    current ? "text-violet-900" : "text-slate-800"
                  }`}
                >
                  {meta.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                  {meta.hint}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
