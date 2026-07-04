import Link from "next/link";
import { AdminCoursePricingClient } from "@/components/admin/AdminCoursePricingClient";
import { AdminEnvStatus } from "@/components/admin/AdminEnvStatus";
import { getAdminEnvChecks } from "@/lib/admin-env-status";
import {
  coursePricingPersistenceMode,
  getCoursePricing,
} from "@/lib/course-pricing-store";
import { site } from "@/lib/site-config";

export default async function AdminNastrojePage() {
  const envChecks = await getAdminEnvChecks();
  const pricing = await getCoursePricing();
  const storage = coursePricingPersistenceMode();

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
      >
        ← Zpět na přihlášky
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
        Nástroje
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Pomůcky pro provoz — bez vlivu na data přihlášek (kromě záměrných akcí na
        stránce přihlášek).
      </p>
      <div className="mt-8 max-w-2xl space-y-6">
        <AdminCoursePricingClient
          initialPricing={pricing}
          storage={storage}
          lessons={site.pricing.lessons}
        />
        <AdminEnvStatus checks={envChecks} />
        <div className="portal-card p-5 sm:p-6">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-violet-800">
            E-mailové šablony
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Texty potvrzení přihlášky, změny stavu, magic linků a testovací
            zprávy upravíte v editoru šablon — včetně náhledu a test odeslání.
          </p>
          <Link
            href="/admin/emaily"
            className="btn-portal-primary mt-4 inline-flex text-sm"
          >
            Otevřít editor e-mailů →
          </Link>
        </div>
      </div>
    </div>
  );
}
