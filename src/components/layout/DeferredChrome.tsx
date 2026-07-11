"use client";

import dynamic from "next/dynamic";

/**
 * Čistě klientské „ozdoby“ webu (toast, click sparkles) — `ssr:false` je dovolené
 * jen uvnitř Client Componenty, proto samostatný wrapper mimo root layout (Server Component).
 * Výsledek: vlastní JS chunk načtený až po hydrataci, ne součást hlavního bundle stránky.
 */
export const DeferredCourseSignupToast = dynamic(
  () => import("@/components/layout/CourseSignupToast").then((m) => m.CourseSignupToast),
  { ssr: false },
);

export const DeferredClickSparkles = dynamic(
  () => import("@/components/playful/LazyClickSparkles").then((m) => m.LazyClickSparkles),
  { ssr: false },
);
