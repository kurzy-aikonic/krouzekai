/**
 * Zvětší hero B2 na šířku 2560 px a vyexportuje AVIF/WebP v několika šířkách.
 * Real-ESRGAN ncnn na tomhle stroji nespustí Vulkan (není GPU). Skript proto
 * zkusí CPU Real-ESRGAN, a když není, použije Lanczos v sharp.
 *
 * Zdroj: public/hero/b2-source.jpg (nebo HERO_SRC). Mezikroky jdou do /tmp/hero-build.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source =
  process.env.HERO_SRC || path.join(root, "public/hero/b2-source.jpg");
const outDir = path.join(root, "public/hero");
const workDir = process.env.HERO_WORK || "/tmp/hero-build";
const widths = [640, 960, 1280, 1920, 2560];
const targetWidth = 2560;

if (!existsSync(source)) {
  console.error(`Chybí zdrojový obrázek: ${source}`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
await mkdir(workDir, { recursive: true });

const masterPng = path.join(workDir, "hero-master.png");
const esrgan = "/tmp/realesrgan/realesrgan-ncnn-vulkan";
let method = "sharp-lanczos3";

const cpuScript = `
from PIL import Image
from realesrgan_ncnn_py import Realesrgan
src = ${JSON.stringify(source)}
dst = ${JSON.stringify(path.join(workDir, "hero-x4.png"))}
img = Image.open(src).convert("RGB")
# model 4 = realesrgan-x4plus, gpuid -1 = CPU. Vulkan na tomhle stroji není.
up = Realesrgan(gpuid=-1, tilesize=192, model=4)
out = up.process_pil(img)
out.save(dst)
print(out.size)
`;

const cpu = spawnSync("python3", ["-c", cpuScript], { stdio: "inherit" });
const up4 = path.join(workDir, "hero-x4.png");
if (cpu.status === 0 && existsSync(up4)) {
  await sharp(up4)
    .resize({ width: targetWidth, kernel: "lanczos3" })
    .png()
    .toFile(masterPng);
  method = "realesrgan-x4plus-cpu";
} else if (existsSync(esrgan)) {
  const run = spawnSync(
    esrgan,
    ["-i", source, "-o", up4, "-n", "realesrgan-x4plus", "-s", "4", "-f", "png"],
    { stdio: "inherit" },
  );
  if (run.status === 0 && existsSync(up4)) {
    await sharp(up4)
      .resize({ width: targetWidth, kernel: "lanczos3" })
      .png()
      .toFile(masterPng);
    method = "realesrgan-x4plus-vulkan";
  }
}

if (!existsSync(masterPng)) {
  await sharp(source)
    .resize({ width: targetWidth, kernel: "lanczos3" })
    .sharpen({ sigma: 0.6, m1: 0.4, m2: 0.6 })
    .png()
    .toFile(masterPng);
}

const meta = await sharp(masterPng).metadata();
console.log(`master ${meta.width}x${meta.height} via ${method}`);

for (const width of widths) {
  const pipeline = sharp(masterPng).resize({ width, kernel: "lanczos3" });
  await pipeline.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(outDir, `hero-${width}.webp`));
  await pipeline.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(outDir, `hero-${width}.avif`));
  await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, `hero-${width}.jpg`));
  console.log("wrote", width);
}
