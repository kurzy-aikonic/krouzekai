import "server-only";

import type { CourseFormat, CourseRun } from "@/data/course-runs";
import { getCoursePricing } from "@/lib/course-pricing-store";
import {
  effectiveRunPriceCzk,
  type DefaultCoursePrices,
} from "@/lib/course-run-pricing";

export async function resolveRegistrationAmountCzk(args: {
  format: CourseFormat;
  run?: CourseRun | null;
}): Promise<number> {
  const defaults = await getCoursePricing();
  const priceDefaults: DefaultCoursePrices = {
    skupinaCourseCzk: defaults.skupinaCourseCzk,
    individualCourseCzk: defaults.individualCourseCzk,
  };
  if (args.run) {
    return effectiveRunPriceCzk(args.run, priceDefaults);
  }
  return args.format === "individual"
    ? priceDefaults.individualCourseCzk
    : priceDefaults.skupinaCourseCzk;
}
