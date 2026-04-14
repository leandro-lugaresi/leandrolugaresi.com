#!/usr/bin/env bun
/**
 * Rasterizes the static SVGs in public/ into PNG fallbacks.
 *
 * Run manually whenever the source SVGs change:
 *   bun run scripts/generate-static-images.ts
 *
 * Commit the resulting PNGs — CF Pages won't run this at build time.
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

interface Job {
  src: string;
  dst: string;
  width: number;
  height: number;
}

const JOBS: Job[] = [
  { src: 'public/og.svg', dst: 'public/og.png', width: 1200, height: 630 },
  { src: 'public/favicon.svg', dst: 'public/favicon.png', width: 32, height: 32 },
];

for (const job of JOBS) {
  const svg = await readFile(job.src);
  await sharp(svg, { density: 300 })
    .resize(job.width, job.height, { fit: 'fill' })
    .png()
    .toFile(job.dst);
  console.log(`✓ ${job.dst} (${job.width}×${job.height})`);
}
