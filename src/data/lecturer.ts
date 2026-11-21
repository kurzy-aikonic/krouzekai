/**
 * Lektor na veřejném webu. Sekce se ukáže, když jsou vyplněné `name` i `bio`.
 * Bez telefonu, e-mailu, IČO a adresy — ty na kroužek nepatří.
 */
export const lecturerProfile = {
  name: "Pavol Stuchlik",
  role: "Lektor kroužku",
  photoSrc: "/lecturer/pavol-stuchlik.webp",
  photoAvif: "/lecturer/pavol-stuchlik.avif",
  photoAlt: "Portrét lektora Pavola Stuchlika",
  bio: "Pavol vede kroužek a už učil jeho předchozí běh. Víc než dvacet let řídil týmy, provozy, technické projekty a firmy — jako projektový manažer, ředitel instalací, ředitel pro strategii a rozvoj, obchodní ředitel, technický ředitel i CEO. Poslední tři roky se umělé inteligenci věnuje každý den a pracuje s ChatGPT, Claude, Gemini a automatizacemi. Se studenty staví skutečné projekty a mluví k věci: co AI umí a kde je potřeba vlastní úsudek. Působí v Praze a domluví se česky, slovensky, německy i anglicky.",
  profileUrl: "https://elevaition.cz/",
};

export function hasPublicLecturer(
  profile: typeof lecturerProfile = lecturerProfile,
): boolean {
  return profile.name.trim().length > 0 && profile.bio.trim().length > 0;
}
