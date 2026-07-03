import { site } from "@/lib/site-config";
import { registrationStatusLabelsCs } from "@/types/registration";

export function AdminEmailTemplatesPreview() {
  return (
    <div className="portal-card space-y-4 p-5 sm:p-6">
      <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
        Náhled šablon e-mailů
      </h2>
      <p className="text-sm leading-relaxed text-slate-600">
        Texty, které rodič dostane automaticky z webu. Skutečné HTML může mít
        drobné odchylky v Resend.
      </p>

      <details className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <summary className="cursor-pointer text-sm font-bold text-violet-900">
          Potvrzení přihlášky (po registraci / resend)
        </summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
          <p>Dobrý den,</p>
          <p>
            děkujeme za přihlášku do kurzu <strong>{site.name}</strong>.
            Přihlášku jsme v pořádku přijali.
          </p>
          <p>
            Obsahuje číslo přihlášky, formát, částku, variabilní symbol a odkaz
            na stránku <strong>/platba</strong> jako orientační přehled.
          </p>
          <p className="text-xs text-slate-500">
            Odesílá se při nové přihlášce a tlačítkem „Znovu poslat potvrzení“ v
            detailu.
          </p>
        </div>
      </details>

      <details className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <summary className="cursor-pointer text-sm font-bold text-violet-900">
          Změna stavu přihlášky
        </summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
          <p>Dobrý den,</p>
          <p>
            stav vaší přihlášky u <strong>{site.shortName}</strong> se změnil.
          </p>
          <p>
            Uvádí nový stav z:{" "}
            {Object.values(registrationStatusLabelsCs).join(", ")}.
          </p>
          <p className="text-xs text-slate-500">
            Odesílá se při úpravě stavu v detailu nebo volitelně při hromadné
            změně.
          </p>
        </div>
      </details>
    </div>
  );
}
