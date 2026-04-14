// @ts-check
import { execSync } from "node:child_process";
import { defineConfig, fontProviders } from "astro/config";
import { loadEnv } from "vite";

// Pull .env / .env.<mode> into process.env so config-time helpers below
// (resolveSite, etc.) can read them. Astro exposes PUBLIC_* to the client
// via import.meta.env separately — this is only for build-config use.
const env = loadEnv(process.env["NODE_ENV"] ?? "", process.cwd(), "");
for (const [k, v] of Object.entries(env)) {
  if (process.env[k] === undefined) process.env[k] = v;
}

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import { remarkReadingTime } from "./src/lib/reading-time.ts";
import { shikiTronChrome } from "./src/lib/shiki-tron-chrome.ts";

/**
 * Build-time metadata. Cloudflare Pages exposes CF_PAGES_COMMIT_SHA; locally
 * we shell out to git. Falls back to "dev" if neither works (e.g. CI without
 * git history). Build time is ISO so the footer can render it however it likes.
 */
function resolveGitSha() {
  if (process.env["CF_PAGES_COMMIT_SHA"]) {
    return process.env["CF_PAGES_COMMIT_SHA"].slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

const GIT_SHA = resolveGitSha();
const BUILD_TIME = new Date().toISOString();

/**
 * Base URL for the site. Drives <link rel="canonical">, OG tags, sitemap,
 * and RSS. Precedence:
 *   1. SITE_URL — explicit override (local .env → http://localhost:4321)
 *   2. CF_PAGES_URL on non-production branches — preview deploys point
 *      at their unique *.pages.dev URL so previews are self-consistent
 *   3. Production canonical URL
 */
function resolveSite() {
  if (process.env["SITE_URL"]) return process.env["SITE_URL"];
  const cfUrl = process.env["CF_PAGES_URL"];
  const cfBranch = process.env["CF_PAGES_BRANCH"];
  const prodBranch = process.env["CF_PAGES_PRODUCTION_BRANCH"] ?? "master";
  if (cfUrl && cfBranch && cfBranch !== prodBranch) return cfUrl;
  return "https://www.leandrolugaresi.com.br";
}

// https://astro.build/config
export default defineConfig({
  site: resolveSite(),
  integrations: [react(), mdx(), sitemap()],

  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: "github-dark-default",
      transformers: [shikiTronChrome()],
    },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Orbitron",
      cssVariable: "--font-orbitron",
      weights: ["400 900"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
    },
    {
      provider: fontProviders.google(),
      name: "Rajdhani",
      cssVariable: "--font-rajdhani",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    define: {
      "import.meta.env.PUBLIC_GIT_SHA": JSON.stringify(GIT_SHA),
      "import.meta.env.PUBLIC_BUILD_TIME": JSON.stringify(BUILD_TIME),
    },
    // @resvg/resvg-js ships a prebuilt .node binary that esbuild can't
    // bundle. Keep it external in SSR and skip dep optimization so `astro
    // dev` doesn't try to pre-bundle it. Only the /og/*.png endpoint
    // imports it, and that runs in Node.
    ssr: { external: ['@resvg/resvg-js', 'satori'] },
    optimizeDeps: { exclude: ['@resvg/resvg-js', 'satori'] },
  },
});
