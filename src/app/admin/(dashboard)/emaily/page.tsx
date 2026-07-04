import Link from "next/link";
import { AdminEmailTemplatesClient } from "@/components/admin/AdminEmailTemplatesClient";
import {
  emailTemplatesPersistenceMode,
  getEmailTemplatesConfig,
} from "@/lib/email-templates-store";

export default async function AdminEmailyPage() {
  const config = await getEmailTemplatesConfig();
  const storage = emailTemplatesPersistenceMode();

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
      >
        ← Zpět na přihlášky
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
        E-mailové šablony
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
        Upravte texty všech automatických e-mailů bez zásahu do kódu. Placeholdery{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">{"{{klíč}}"}</code>{" "}
        se při odeslání nahradí skutečnými údaji. Po uložení platí pro nové
        odesílání okamžitě.
      </p>
      <div className="mt-8">
        <AdminEmailTemplatesClient
          initialTemplates={config.templates}
          storage={storage}
          updatedAt={config.updatedAt}
        />
      </div>
    </div>
  );
}
