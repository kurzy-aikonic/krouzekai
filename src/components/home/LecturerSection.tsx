import Image from "next/image";
import { hasPublicLecturer, lecturerProfile } from "@/data/lecturer";
import { showCorporateReferences } from "@/lib/site-config";

const COMPANIES = ["Česká spořitelna", "ČEZ", "Škoda Auto"] as const;

function CompanyChips() {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Firmy, se kterými tým spolupracuje">
      {COMPANIES.map((company) => (
        <li
          key={company}
          className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-violet-900"
        >
          {company}
        </li>
      ))}
    </ul>
  );
}

function Claims({ withLecturer }: { withLecturer: boolean }) {
  if (!showCorporateReferences) {
    if (withLecturer) return null;
    return (
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-800">
        Stejný tým školí zaměstnance českých firem.
      </p>
    );
  }

  if (withLecturer) {
    return (
      <div className="mt-4">
        <p className="max-w-2xl text-base leading-relaxed text-slate-800">
          Tým AIKONIC má za sebou přes 2&nbsp;500 proškolených lidí v Česku a
          spolupráci s firmami jako Česká spořitelna, ČEZ nebo Škoda Auto.
        </p>
        <CompanyChips />
      </div>
    );
  }

  return (
    <div className="mt-3">
      <p className="max-w-2xl text-base leading-relaxed text-slate-800">
        Kroužek vedou lektoři z týmu AIKONIC. Tým má za sebou přes 2&nbsp;500
        proškolených lidí v Česku a spolupráci s firmami jako Česká spořitelna,
        ČEZ nebo Škoda Auto. Na kroužku učíme stejným praktickým způsobem, bez
        zbytečné teorie, a dítě odchází s hotovým výsledkem.
      </p>
      <CompanyChips />
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

  return (
    <section className="mt-16" aria-labelledby="lecturer-heading">
      <h2
        id="lecturer-heading"
        className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
      >
        Kdo vaše dítě učí
      </h2>
      {visible ? (
        <div className="mt-6 flex flex-col gap-5 rounded-3xl border border-violet-200 bg-white p-5 shadow-sm sm:flex-row sm:p-7">
          {lecturer.photoSrc ? (
            <Image
              src={lecturer.photoSrc}
              alt={lecturer.photoAlt || lecturer.name}
              width={160}
              height={160}
              className="h-28 w-28 shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36"
            />
          ) : null}
          <div>
            <p className="font-display text-xl font-extrabold text-[var(--magic-ink)]">
              {lecturer.name}
            </p>
            {lecturer.role ? (
              <p className="mt-1 text-sm font-semibold text-violet-800">
                {lecturer.role}
              </p>
            ) : null}
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-800">
              {lecturer.bio}
            </p>
            {profileHref ? (
              <a
                href={profileHref}
                className="mt-3 inline-flex min-h-11 items-center font-bold text-violet-800 underline decoration-violet-300 underline-offset-4"
              >
                Profil lektora
              </a>
            ) : null}
            <Claims withLecturer />
          </div>
        </div>
      ) : (
        <Claims withLecturer={false} />
      )}
    </section>
  );
}
