// @ts-check
import { execSync } from 'node:child_process';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

/**
 * Build-time metadata. Cloudflare Pages exposes CF_PAGES_COMMIT_SHA; locally
 * we shell out to git. Falls back to "dev" if neither works (e.g. CI without
 * git history). Build time is ISO so the footer can render it however it likes.
 */
function resolveGitSha() {
  if (process.env['CF_PAGES_COMMIT_SHA']) {
    return process.env['CF_PAGES_COMMIT_SHA'].slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
}

const GIT_SHA = resolveGitSha();
const BUILD_TIME = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
  site: 'https://leandrolugaresi.com.br',
  integrations: [react()],

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Orbitron',
      cssVariable: '--font-orbitron',
      weights: ['400 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
    {
      provider: fontProviders.google(),
      name: 'Rajdhani',
      cssVariable: '--font-rajdhani',
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_GIT_SHA': JSON.stringify(GIT_SHA),
      'import.meta.env.PUBLIC_BUILD_TIME': JSON.stringify(BUILD_TIME),
    },
  },
});
