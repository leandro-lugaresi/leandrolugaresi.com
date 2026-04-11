/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Short git SHA, injected at build time via vite.define. */
  readonly PUBLIC_GIT_SHA: string;
  /** ISO build timestamp, injected at build time via vite.define. */
  readonly PUBLIC_BUILD_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
