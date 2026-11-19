/**
 * Hero ilustrace. Soubory v `public/hero/` vznikají skriptem
 * `scripts/export-hero.mjs` ze zdroje `public/hero/b2-source.jpg`
 * (1280×720), po zvětšení na 2560 px.
 * Výměna: nahraďte zdroj a spusťte skript znovu.
 */
const widths = [640, 960, 1280, 1920, 2560] as const;
const islandWidths = [640, 960, 1280, 1920] as const;

function srcSet(ext: "avif" | "webp" | "jpg"): string {
  return widths.map((width) => `/hero/hero-${width}.${ext} ${width}w`).join(", ");
}

export const heroMedia = {
  src: "/hero/hero-1280.jpg",
  avifSrcSet: srcSet("avif"),
  webpSrcSet: srcSet("webp"),
  jpgSrcSet: srcSet("jpg"),
  islandSrc: "/hero/island-1280.webp",
  islandSrcSet: islandWidths.map((width) => `/hero/island-${width}.webp ${width}w`).join(", "),
  sizes: "(min-width: 1024px) 58vw, 100vw",
  width: 2560,
  height: 1440,
  alt: "Tmavý stůl s monitorem, klávesnicí a vznášejícím se ostrovem z fialových krystalů",
} as const;
