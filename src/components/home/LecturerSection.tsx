import { hasPublicLecturer, lecturerProfile } from "@/data/lecturer";
import { showCorporateReferences } from "@/lib/site-config";

const COMPANIES = ["Česká spořitelna", "ČEZ", "Škoda Auto"] as const;

function CompanyNote() {
  if (!showCorporateReferences) return null;
  return (
    <div className="mt-5 border-t border-white/10 pt-4">
      <p className="text-sm leading-relaxed text-white/70">
        Kroužek pořádá Aikonic training. Tým má za sebou přes 2&nbsp;500
        proškolených lidí v Česku a spolupráci s firmami jako{" "}
        {COMPANIES.join(", ").replace(/, ([^,]*)$/, " a $1")}.
      </p>
    </div>
  );
}

/** Sekce lektora. Fotka, jméno a bio se ukážou až po vyplnění v `src/data/lecturer.ts`. */
export function LecturerSection() {
  const lecturer = lecturerProfile;
  const visible = hasPublicLecturer(lecturer);
  const profileHref = lecturer.profileUrl.startsWith("http")
    ? lecturer.profileUrl
    : "";
  const initials = lecturer.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section className="mt-16" aria-labelledby="lecturer-heading">
      <h2
        id="lecturer-heading"
        className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
      >
        Kdo kroužek vede
      </h2>
      {visible ? (
        <div className="mt-6 flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#100d18] p-5 text-white shadow-sm sm:flex-row sm:p-7">
          {lecturer.photoSrc ? (
            <picture className="shrink-0">
              {lecturer.photoAvif ? (
                <source type="image/avif" srcSet={lecturer.photoAvif} />
              ) : null}
              <img
                src={lecturer.photoSrc}
                alt={lecturer.photoAlt || lecturer.name}
                width={960}
                height={1200}
                className="h-36 w-36 rounded-2xl border border-white/10 object-cover object-top shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:h-44 sm:w-44"
              />
            </picture>
          ) : (
            <div
              className="flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl border border-orange-400/40 bg-[#07060f] font-display text-3xl font-extrabold text-orange-400 sm:h-44 sm:w-44"
              aria-hidden
            >
              {initials}
            </div>
          )}
          <div>
            <p className="font-display text-xl font-extrabold text-white">
              {lecturer.name}
            </p>
            {lecturer.role ? (
              <p className="mt-1 text-sm font-semibold text-orange-300">
                {lecturer.role}
              </p>
            ) : null}
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85">
              {lecturer.bio}
            </p>
            {profileHref ? (
              <a
                href={profileHref}
                className="mt-3 inline-flex min-h-11 items-center font-bold text-orange-300 underline decoration-orange-400/40 underline-offset-4"
              >
                Web ElevAItion
              </a>
            ) : null}
            <CompanyNote />
          </div>
        </div>
      ) : (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-800">
          Lektora kroužku doplníme, jakmile bude potvrzený.
        </p>
      )}
    </section>
  );
}
