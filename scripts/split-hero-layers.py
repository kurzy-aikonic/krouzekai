"""Oddělí vznášející se ostrov od pozadí hero B2 a plovoucí panely referenční fotky.

Ostrov je maska z jasných ploch, krystalů a úzké věže. Pozadí se doplní inpaintingem,
ať při posunu o pár pixelů neprosvítá druhý obrys.
"""
from __future__ import annotations

import cv2
import numpy as np
from PIL import Image


def island_mask(rgb: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    s = w / 1280.0
    r, g, b = [rgb[:, :, i].astype(np.int16) for i in range(3)]
    lum = ((r + g + b) / 3).astype(np.float32)
    sat = (
        np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    ).astype(np.float32)
    yy, xx = np.mgrid[0:h, 0:w]
    stone = (lum > 100) & (sat < 50) & (yy < 520 * s) & (xx > 430 * s)
    screen = (xx > 760 * s) & (xx < 1225 * s) & (yy > 145 * s) & (yy < 400 * s)
    thick = cv2.morphologyEx(
        stone.astype(np.uint8),
        cv2.MORPH_OPEN,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (max(3, int(5 * s)),) * 2),
    )
    stone = stone & ~(screen & (thick == 0))
    crystal = (
        (b > r + 20)
        & (b > g + 5)
        & (sat > 40)
        & (lum > 40)
        & (lum < 150)
        & (yy > 280 * s)
        & (yy < 500 * s)
        & (xx > 520 * s)
        & (xx < 1080 * s)
    )
    orange = (
        (r > g + 20)
        & (r > b + 35)
        & (r > 90)
        & (yy < 500 * s)
        & (xx > 500 * s)
        & (xx < 1180 * s)
    )
    seed = (stone | crystal | orange).astype(np.uint8)
    k = max(3, int(7 * s) | 1)
    grown = cv2.dilate(seed, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)), iterations=2)
    body = (lum > 28) & (yy < 540 * s) & (xx > 430 * s) & (
        ((b > r + 8) & (sat > 18) & (lum < 145)) | ((sat < 42) & (lum > 45))
    )
    mask = (grown > 0) & body
    blur = cv2.GaussianBlur(lum, (0, 0), 3 * s)
    var = cv2.GaussianBlur((lum - blur) ** 2, (0, 0), 3 * s)
    glow = (var < 18) & (lum < 85) & (sat > 10) & (b > r)
    mask = mask & ~glow
    screen_px = screen & (sat < 28) & (lum < 90)
    near = cv2.dilate(seed, np.ones((3, 3), np.uint8), 1) > 0
    mask = mask & ~(screen_px & ~near) & (yy < 545 * s)
    # Věž je tmavý kvádr před monitorem. Bereme celý sloupec, ať ve vrstvě nezůstane díra.
    shaft = (xx >= 888 * s) & (xx <= 1022 * s) & (yy >= 145 * s) & (yy <= 408 * s)
    mask = mask | shaft
    mask = mask & ~((yy < 160 * s) & ~shaft)
    mask_u = cv2.morphologyEx(
        mask.astype(np.uint8),
        cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (max(3, int(5 * s) | 1),) * 2),
    )
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask_u, 8)
    keep = np.zeros_like(mask_u)
    min_area = int(220 * s * s)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > min_area:
            keep[labels == i] = 1
    # Díry uvnitř ostrova (spodní plochy) doplníme, ať se při posunu nezdvojí.
    inv = np.where(keep > 0, 0, 255).astype(np.uint8)
    flood = inv.copy()
    cv2.floodFill(flood, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 128)
    holes = flood == 255
    keep[holes] = 1
    return keep


def main() -> None:
    src = cv2.imread("/tmp/hero-build/hero-master.png")
    rgb = cv2.cvtColor(src, cv2.COLOR_BGR2RGB)
    keep = island_mask(rgb)
    # Měkký okraj, ať řez nesvítí.
    alpha = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.1)
    alpha = np.clip(alpha, 0, 1)
    hard = (alpha > 0.42).astype(np.uint8) * 255
    hard = cv2.dilate(hard, np.ones((3, 3), np.uint8), 1)
    print("inpaint", rgb.shape, "mask", int(hard.mean()))
    filled = cv2.inpaint(src, hard, 5, cv2.INPAINT_TELEA)
    cv2.imwrite("/tmp/hero-build/hero-bg.png", filled)
    rgba = np.dstack([rgb, (alpha * 255).astype(np.uint8)])
    Image.fromarray(rgba, "RGBA").save("/tmp/hero-build/hero-island.png")
    # Náhled pro kontrolu
    preview = rgb.copy()
    preview[keep > 0] = (preview[keep > 0] * 0.45 + np.array([255, 40, 40]) * 0.55).astype(np.uint8)
    Image.fromarray(preview).resize((960, 540)).save("/tmp/hero-build/mask-preview.jpg", quality=70)
    print("wrote bg and island")


if __name__ == "__main__":
    main()
