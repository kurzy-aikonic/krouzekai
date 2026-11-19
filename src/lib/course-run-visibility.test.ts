import assert from "node:assert/strict";
import test from "node:test";
import {
  filterUpcomingCourseRuns,
  isUpcomingCourseRun,
} from "./course-run-visibility.ts";

const today = "2026-11-19";

test("propadlý termín se nezobrazí", () => {
  assert.equal(
    isUpcomingCourseRun({ active: true, startsOn: "2026-09-29" }, today),
    false,
  );
});

test("dnešní a budoucí termín se zobrazí", () => {
  assert.equal(
    isUpcomingCourseRun({ active: true, startsOn: "2026-11-19" }, today),
    true,
  );
  assert.equal(
    isUpcomingCourseRun({ active: true, startsOn: "2027-03-02" }, today),
    true,
  );
});

test("zrušený nebo rozbitý termín se nezobrazí", () => {
  assert.equal(
    isUpcomingCourseRun({ active: false, startsOn: "2027-03-02" }, today),
    false,
  );
  assert.equal(
    isUpcomingCourseRun({ startsOn: "jaro" }, today),
    false,
  );
});

test("filtr nechá jen budoucí běhy, takže se web sám přepne", () => {
  const runs = filterUpcomingCourseRuns(
    [
      { id: "old", active: true, startsOn: "2026-09-28" },
      { id: "spring", active: true, startsOn: "2027-04-06" },
    ],
    today,
  );
  assert.deepEqual(
    runs.map((run) => run.id),
    ["spring"],
  );
});
