import { site } from "@/lib/site-config";

export function BrandSubtitle({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={`font-display text-[11px] font-medium tracking-wide sm:text-xs ${
        onDark ? "text-white/55" : "text-violet-700"
      } ${className}`}
    >
      {site.brandSubtitle.prefix}
      <a
        href={site.parentSite.url}
        target="_blank"
        rel="noopener noreferrer"
        className={
          onDark
            ? "underline decoration-dotted decoration-white/30 underline-offset-2 hover:text-white"
            : "underline decoration-dotted decoration-violet-400 underline-offset-2 hover:text-violet-900"
        }
      >
        {site.brandSubtitle.linkLabel}
      </a>
    </p>
  );
}
