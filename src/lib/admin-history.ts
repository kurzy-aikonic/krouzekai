import type {
  AdminHistoryEntry,
  RegistrationEmailLogEntry,
  RegistrationRecord,
} from "@/types/registration";
import { registrationStatusLabelsCs } from "@/types/registration";

const MAX_HISTORY = 40;
const MAX_EMAIL_LOG = 30;

export function appendAdminHistory(
  record: RegistrationRecord,
  entry: Omit<AdminHistoryEntry, "at">,
): RegistrationRecord {
  const at = new Date().toISOString();
  const prev = record.adminHistory ?? [];
  const next = [{ ...entry, at }, ...prev].slice(0, MAX_HISTORY);
  return { ...record, adminHistory: next };
}

export function appendEmailLog(
  record: RegistrationRecord,
  entry: Omit<RegistrationEmailLogEntry, "at">,
): RegistrationRecord {
  const at = new Date().toISOString();
  const prev = record.emailLog ?? [];
  const next = [{ ...entry, at }, ...prev].slice(0, MAX_EMAIL_LOG);
  return { ...record, emailLog: next };
}

export function historyForPatch(args: {
  actor: string;
  before: RegistrationRecord;
  patch: {
    status?: RegistrationRecord["status"];
    internalNotes?: string;
    runId?: string | null;
  };
}): AdminHistoryEntry | null {
  const changes: AdminHistoryEntry["changes"] = {};
  const { before, patch } = args;

  if (patch.status !== undefined && patch.status !== before.status) {
    changes.status = {
      from: registrationStatusLabelsCs[before.status],
      to: registrationStatusLabelsCs[patch.status],
    };
  }
  if (patch.internalNotes !== undefined) {
    const from = (before.internalNotes ?? "").trim();
    const to = patch.internalNotes.trim();
    if (from !== to) {
      changes.internalNotes = { from: from || "—", to: to || "—" };
    }
  }
  if (patch.runId !== undefined && patch.runId !== before.runId) {
    changes.runId = {
      from: before.runId ?? "—",
      to: patch.runId ?? "—",
    };
  }

  if (Object.keys(changes).length === 0) return null;

  const parts: string[] = [];
  if (changes.status) {
    parts.push(`stav ${changes.status.from} → ${changes.status.to}`);
  }
  if (changes.runId) {
    parts.push("termín");
  }
  if (changes.internalNotes) {
    parts.push("poznámka");
  }

  return {
    at: "",
    actor: args.actor,
    action: "registration.patch",
    summary: parts.join(", ") || "úprava",
    changes,
  };
}

export function historyForBulkStatus(args: {
  actor: string;
  previousStatus: RegistrationRecord["status"];
  newStatus: RegistrationRecord["status"];
}): AdminHistoryEntry {
  return {
    at: "",
    actor: args.actor,
    action: "registration.bulk_status",
    summary: `hromadně: ${registrationStatusLabelsCs[args.previousStatus]} → ${registrationStatusLabelsCs[args.newStatus]}`,
    changes: {
      status: {
        from: registrationStatusLabelsCs[args.previousStatus],
        to: registrationStatusLabelsCs[args.newStatus],
      },
    },
  };
}

export function historyForBulkRun(args: {
  actor: string;
  previousRunId: string | null;
  newRunId: string | null;
}): AdminHistoryEntry {
  return {
    at: "",
    actor: args.actor,
    action: "registration.bulk_run",
    summary: `hromadné přiřazení termínu`,
    changes: {
      runId: {
        from: args.previousRunId ?? "—",
        to: args.newRunId ?? "—",
      },
    },
  };
}
