import type { CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import type { RegistrationRecord } from "@/types/registration";

export type AdminDashboardStats = {
  novaCount: number;
  last7d: number;
  fullRuns: { id: string; label: string; format: string }[];
  orphanCount: number;
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
    .filter((run) => {
      const occ = countedOccupancyForRun(run.id, run.format, items);
      return spotsLeftEffective(run, occ) <= 0;
    })
    .map((run) => ({
      id: run.id,
      label: run.label,
      format: run.format === "skupina" ? "Skupina" : "1:1",
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
    recentNova,
  };
}
