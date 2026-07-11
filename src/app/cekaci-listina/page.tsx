import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { getCourseRunById } from "@/lib/course-runs-store";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Čekací listina",
  description:
    "Zapište se do čekací listiny na plný termín AI kroužku — ozveme se, jakmile se uvolní místo nebo otevřeme nový běh.",
  path: "/cekaci-listina",
  noIndex: true,
});

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ run?: string; format?: string }>;
};

export default async function CekaciListinaPage({ searchParams }: PageProps) {
  const q = await searchParams;
  const runId = q.run?.trim() || undefined;
  const run = runId ? await getCourseRunById(runId) : undefined;
  const format = run?.format ?? (q.format === "individual" ? "individual" : "skupina");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-6 sm:py-16">
      <h1 className="page-h1">Čekací listina</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Vybraný termín je momentálně plný. Zanechte nám kontakt a ozveme se,
        jakmile se uvolní místo nebo otevřeme nový termín stejného formátu.
      </p>
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6">
        <WaitlistForm format={format} runId={run?.id} runLabel={run?.label} />
      </div>
    </div>
  );
}
