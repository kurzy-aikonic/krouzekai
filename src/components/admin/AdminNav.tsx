"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Přihlášky",
    match: (path: string) =>
      path === "/admin" || path.startsWith("/admin/registrations"),
  },
  {
    href: "/admin/course-runs",
    label: "Termíny",
    match: (path: string) => path.startsWith("/admin/course-runs"),
  },
  {
    href: "/admin/nastroje",
    label: "Nástroje",
    match: (path: string) => path.startsWith("/admin/nastroje"),
  },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-1 text-xs font-medium text-slate-600 sm:text-sm"
      aria-label="Admin navigace"
    >
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-2 py-1.5 transition ${
              active
                ? "bg-violet-100 font-bold text-violet-900"
                : "hover:bg-violet-50 hover:text-violet-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
