import type { CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import { findDuplicateGroups, type DuplicateGroup } from "@/lib/admin-duplicates";
import {
  countAwaitingPayment,
  sumAwaitingPaymentCzk,
} from "@/lib/admin-payment-stats";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import type { RegistrationRecord } from "@/types/registration";

export type AdminDashboardStats = {
  novaCount: number;
  last7d: number;
  fullRuns: { id: string; label: string; format: string; launchReady: boolean }[];
  orphanCount: number;
  awaitingPaymentCount: number;
  awaitingPaymentCzk: number;
  duplicateGroups: DuplicateGroup[];
  recentNova: {
    code: string;
    childName: string;
    receivedAt?: string;
  }[];
};

export function computeAdminDashboardStats(
  items: RegistrationRecord[],
  courseRuns: CourseRun[],
  last7d: number,
): AdminDashboardStats {
  const runIds = new Set(courseRuns.map((r) => r.id));
  const novaItems = items.filter((r) => r.status === "nova");

  const fullRuns = courseRuns
    .filter((r) => r.active !== false)
    .map((run) => {
      const occ = countedOccupancyForRun(run.id, run.format, items);
      return {
        run,
        occ,
        launchReady: spotsLeftEffective(run, occ) <= 0,
      };
    })
    .filter(({ launchReady }) => launchReady)
    .map(({ run, launchReady }) => ({
      id: run.id,
      label: run.label,
      format: run.format === "skupina" ? "Skupina" : "1:1",
      launchReady,
    }));

  const orphanCount = items.filter(
    (r) => r.runId?.trim() && !runIds.has(r.runId),
  ).length;

  const recentNova = [...novaItems]
    .sort((a, b) =>
      String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")),
    )
    .slice(0, 5)
    .map((r) => ({
      code: getPublicRegistrationCode(r),
      childName: r.childName,
      receivedAt: r.receivedAt,
    }));

  return {
    novaCount: novaItems.length,
    last7d,
    fullRuns,
    orphanCount,
    awaitingPaymentCount: countAwaitingPayment(items),
    awaitingPaymentCzk: sumAwaitingPaymentCzk(items),
    duplicateGroups: findDuplicateGroups(items),
    recentNova,
  };
}
