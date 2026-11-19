/**
 * Lektor na veřejném webu.
 *
 * Sem doplní Radek údaje, až je bude mít. Sekce se na webu ukáže až ve chvíli,
 * kdy jsou vyplněné `name` i `bio`. Prázdná pole návštěvník nevidí.
 *
 * Fotku uložte do `public/lecturer/` (třeba `public/lecturer/portret.jpg`)
 * a do `photoSrc` dejte cestu `/lecturer/portret.jpg`.
 * `photoAlt` je krátký popis fotky pro čtečky, například „Portrét lektora Radka Nováka“.
 * `profileUrl` je volitelný odkaz (https://…). Prázdný řetězec znamená bez odkazu.
 */
export const lecturerProfile = {
  name: "",
  role: "Lektor",
  photoSrc: "",
  photoAlt: "",
  bio: "",
  profileUrl: "",
};

export function hasPublicLecturer(
  profile: typeof lecturerProfile = lecturerProfile,
): boolean {
  return profile.name.trim().length > 0 && profile.bio.trim().length > 0;
}
