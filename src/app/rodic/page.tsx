import Link from "next/link";
import { redirect } from "next/navigation";
import type { CourseRun } from "@/data/course-runs";
import { ParentLogoutButton } from "@/components/rodic/ParentLogoutButton";
import { RegistrationStatusTimeline } from "@/components/rodic/RegistrationStatusTimeline";
import {
  getParentSessionEmail,
  parentAuthSecretConfigured,
} from "@/lib/parent-auth";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { variableSymbolFromRegistrationId } from "@/lib/payment";
import { listCourseRuns } from "@/lib/course-runs-store";
import { listRegistrationsByParentEmail } from "@/lib/registrations-store";
import { site } from "@/lib/site-config";
import { registrationStatusPillClassName } from "@/lib/registration-status-ui";
import type { RegistrationRecord } from "@/types/registration";
import type { RegistrationStatus } from "@/types/registration";
import { registrationStatusLabelsCs } from "@/types/registration";

export const dynamic = "force-dynamic";

const statusLabels: Record<RegistrationStatus, string> = {
  ...registrationStatusLabelsCs,
  nova: "Nová — čeká na kontakt",
};

function StatusPill({ status }: { status: RegistrationStatus }) {
  return (
    <span
      className={`inline-flex max-w-full rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${registrationStatusPillClassName(status)}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function RegistrationCard({
  r,
  runById,
}: {
  r: RegistrationRecord;
  runById: Map<string, CourseRun>;
}) {
  const code = getPublicRegistrationCode(r);
  const vs = variableSymbolFromRegistrationId(r.id);
  const platbaHref = `/platba?registrace=${encodeURIComponent(code)}`;
  const runCandidate = r.runId ? runById.get(r.runId) : undefined;
  const run =
    runCandidate && runCandidate.format === r.format
      ? runCandidate
      : undefined;

  return (
    <article className="rodic-print-card portal-card border-l-4 border-l-violet-500 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-900 sm:text-xl">
            {r.childName}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {r.childAge} let ·{" "}
            {r.format === "skupina" ? "Skupinový kurz" : "Individuální 1:1"}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="font-mono text-base font-bold tracking-wider text-violet-900 sm:text-lg">
            {code}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            číslo přihlášky
          </span>
        </div>
      </div>
      <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <dt className="shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500">
            Stav
          </dt>
          <dd className="sm:text-right">
            <StatusPill status={r.status} />
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Částka
          </dt>
          <dd className="font-semibold text-slate-800">
            {r.amountCzk} Kč ({site.pricing.vatNote})
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Variabilní symbol
          </dt>
          <dd className="font-mono text-sm font-semibold tracking-wide text-slate-900">
            {vs}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Termín
          </dt>
          <dd className="mt-0.5 text-slate-800">
            {run ? (
              <>
                <span className="font-medium">{run.label}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {run.description}
                </span>
              </>
            ) : r.runId ? (
              <span className="text-slate-600">
                Termín už není v aktuální nabídce ({r.runId}). Napište nám pro
                upřesnění.
              </span>
            ) : (
              <span className="text-slate-600">
                Zatím bez přiřazení — domluvíme s vámi.
              </span>
            )}
          </dd>
        </div>
      </dl>
      <RegistrationStatusTimeline status={r.status} />
      <div className="mt-6 flex flex-col gap-3 print:hidden sm:flex-row sm:flex-wrap">
        <Link
          href={platbaHref}
          className="btn-portal-primary sm:w-auto sm:min-w-[11rem]"
        >
          Platební přehled
        </Link>
        <Link
          href="/jak-probiha"
          className="btn-portal-outline sm:w-auto sm:min-w-[11rem]"
        >
          Jak probíhá lekce
        </Link>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500 print:hidden">
        Fakturu a finální instrukce k platbě vám pošleme po domluvě — údaje na
        webu jsou orientační.
      </p>
    </article>
  );
}

export default async function RodicDashboardPage() {
  if (!parentAuthSecretConfigured()) {
    return (
      <div className="portal-card mx-auto max-w-lg p-6 text-sm text-amber-950">
        <p className="font-bold text-amber-900">Chybí konfigurace</p>
        <p className="mt-2 leading-relaxed">
          Doplňte{" "}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">
            PARENT_AUTH_SECRET
          </code>{" "}
          do <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">web/.env</code>.
        </p>
      </div>
    );
  }

  const email = await getParentSessionEmail();
  if (!email) {
    redirect("/rodic/prihlaseni");
  }

  const registrations = await listRegistrationsByParentEmail(email);
  const courseRuns = await listCourseRuns();
  const runById = new Map(courseRuns.map((cr) => [cr.id, cr]));

  return (
    <div className="py-4 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Váš přehled
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Přihlášeno jako{" "}
            <span className="break-all font-semibold text-slate-800">{email}</span>
          </p>
          <p className="mt-2 hidden text-xs text-slate-500 print:block">
            Vytištěno z přehledu pro rodiče — {site.name}
          </p>
        </div>
        <div className="print:hidden">
          <ParentLogoutButton />
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="portal-card mt-10 p-6 text-sm leading-relaxed text-slate-700">
          <p>
            Pro tento e-mail zatím nemáme žádnou přihlášku v tomto systému. Pokud
            jste už kurz přihlásili, zkuste jiný e-mail nebo nás kontaktujte na{" "}
            <a
              className="font-bold text-violet-700 underline"
              href={`mailto:${site.contactEmail}`}
            >
              {site.contactEmail}
            </a>
            .
          </p>
          <Link
            href="/registrace"
            className="mt-5 inline-flex min-h-[2.75rem] items-center font-display text-sm font-extrabold text-violet-800 underline decoration-violet-300 decoration-2 underline-offset-4 hover:text-violet-950"
          >
            Přihláška na kurz
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6 sm:space-y-8">
          {registrations.map((r) => (
            <RegistrationCard key={r.id} r={r} runById={runById} />
          ))}
        </div>
      )}

      <nav
        className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-slate-200/80 pt-8 text-xs font-semibold text-slate-500 print:hidden"
        aria-label="Další stránky"
      >
        <a
          className="rounded-lg px-2 py-1 text-violet-800 underline decoration-violet-300 underline-offset-4 hover:bg-violet-50"
          href="/kontakt"
        >
          Kontakt
        </a>
        <a
          className="rounded-lg px-2 py-1 text-violet-800 underline decoration-violet-300 underline-offset-4 hover:bg-violet-50"
          href="/faq"
        >
          FAQ
        </a>
      </nav>
    </div>
  );
}
