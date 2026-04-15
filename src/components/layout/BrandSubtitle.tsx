import { site } from "@/lib/site-config";

export function BrandSubtitle({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-display text-[11px] font-bold tracking-wide text-violet-700 sm:text-xs ${className}`}
    >
      {site.brandSubtitle.prefix}
      <a
        href={site.parentSite.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted decoration-violet-400 underline-offset-2 hover:text-violet-900"
      >
        {site.brandSubtitle.linkLabel}
      </a>
    </p>
  );
}
