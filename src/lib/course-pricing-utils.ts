import { site } from "@/lib/site-config";

/** Odhad ceny za jednu lekci (informativně). */
export function perLessonCzk(
  courseTotalCzk: number,
  lessons: number = site.pricing.lessons,
): number {
  if (lessons <= 0) return courseTotalCzk;
  return Math.round(courseTotalCzk / lessons);
}

export function defaultCoursePricingValues(): {
  skupinaCourseCzk: number;
  individualCourseCzk: number;
} {
  return {
    skupinaCourseCzk: site.pricing.skupinaCourse,
    individualCourseCzk: site.pricing.individualCourse,
  };
}
