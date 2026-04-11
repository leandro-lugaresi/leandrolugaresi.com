# v2 redesign — implementation plan

Personal site rebuild. Hugo → Astro + Gridcn (Clu) on Cloudflare Pages.
Domain: `leandrolugaresi.com.br`.

## Goals
- Blog-first revival; old site discarded entirely.
- Landing page doubles as CV showcase.
- Cloudflare-first stack; play with CF services post-launch via "playground" posts.

## Stack
- Astro 5 (static), TypeScript strict, bun
- React 19 via `@astrojs/react` (islands; minimize `client:*`)
- Tailwind 4 (Vite plugin, CSS-first `@theme`)
- shadcn/ui + Gridcn (Clu palette, dark-only)
- MDX content collections (`@astrojs/mdx`)
- Astro Fonts API: Orbitron / Rajdhani / Geist Mono, self-hosted, Latin + Latin Extended
- Cloudflare Pages, Cloudflare DNS, Cloudflare Web Analytics
- v1 = pure static. No Workers, KV, D1, R2, newsletter.

## Architecture cliffnotes
- 4 templates: `index.astro`, `posts/index.astro`, `posts/[slug].astro`, `404.astro`
- URL pattern: `/posts/[slug]`
- Content collection: `.mdx` only, frontmatter has `lang` future-proofed (unused in v1)
- Drafts via `draft: true` frontmatter, filtered when `NODE_ENV=production`
- Custom `<CodeBlock>` (forked from `TronCodeBlock` minus `CopyButton`); rehype plugin rewrites fenced blocks
- Hand-authored `src/data/home.ts` for landing-page facts (CV is reference, not data source)
- Cutover model: preview-then-flip; merge `v2` → `master` on cutover day; `master` stays the prod-tracking branch

## Repo layout (target)
```
leandrolugaresi.com/
├── astro.config.mjs
├── components.json          # shadcn config
├── package.json             # bun
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── favicon.png          # 32px fallback
│   ├── og.png               # 1200x630 static fallback
│   ├── robots.txt
│   └── slides/              # if any local; speaker deck links instead
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn primitives
│   │   ├── thegridcn/       # gridcn components (managed by CLI)
│   │   └── blog/
│   │       └── CodeBlock.tsx  # SSR fork
│   ├── content/
│   │   ├── config.ts        # collection schema
│   │   └── blog/            # *.mdx posts
│   ├── data/
│   │   └── home.ts          # typed CV-derived facts
│   ├── layouts/
│   │   └── Base.astro       # head, og, fonts, analytics
│   ├── lib/
│   │   ├── rehype-codeblock.ts  # fenced → <CodeBlock>
│   │   └── reading-time.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts
│   │   └── posts/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── globals.css      # @theme + Clu tokens
└── .reference/
    └── the-grid-blog-template.tsx  # design spec, not built
```

---

## Phases

Tracer-bullet ordering. Each phase ships something visible end-to-end.
DNS work runs in parallel, starting day 1.

### Phase 0 — DNS migration (parallel, day 1)
- Add `leandrolugaresi.com.br` as a Cloudflare zone
- Recreate current Registro.br DNS records inside Cloudflare (A/CNAME/MX/TXT — copy *exactly*)
- Change NS records at Registro.br → Cloudflare nameservers
- Wait for propagation (24–48h worst case)
- Verify: `dig +short NS leandrolugaresi.com.br` returns Cloudflare NS; site still loads from Netlify; no DNS errors
- **Done**: DNS managed in Cloudflare, old Netlify site still serving correctly via new DNS path
- **Critical**: must finish *before* Phase 11. Start now.

### Phase 1 — Tracer bullet: scaffold + first deploy
- On `v2`: deinit submodules (`git submodule deinit -f .`), `git rm -rf` Hugo files, `.gitmodules`, `themes/`, `config.toml`, `content/`, `layouts/`, `static/`, `data/`, `README.md`
- `mkdir .reference && git mv the-grid-blog-template.tsx .reference/`
- `bun create astro@latest .` → Empty template, TypeScript strict, bun
- Add `@astrojs/react`
- Stub `index.astro`: `<h1>Leandro Lugaresi · v2</h1>`
- Commit: `feat: scaffold astro v2`
- Push `v2`
- Create CF Pages project `leandrolugaresi-com-br`, connect repo, prod branch = `v2`
- Build settings: `bun run build`, output `dist/`, root `/`, `nodejs_compat` flag
- **Done**: stub renders at `*.pages.dev` URL; auto-deploy on push to `v2` works
- **Risk gate**: confirm bun runtime works on CF Pages build. If it doesn't, fall back to npm/pnpm.

### Phase 2 — Tailwind 4 + shadcn + Gridcn (Clu)
- Install Tailwind 4 (Vite plugin path)
- `src/styles/globals.css` with `@import "tailwindcss"` + `@theme` block
- `bunx shadcn@latest init` (TypeScript, RSC=no, base color=neutral, CSS variables yes)
- Apply Clu theme tokens to `globals.css` (verify against gridcn docs at install time)
- `bunx shadcn@latest add @thegridcn/glow-container @thegridcn/breadcrumb-nav @thegridcn/code-block` (and others as needed)
- Astro Fonts API in `astro.config.mjs`: Orbitron, Rajdhani, Geist Mono, subsets `[latin, latin-ext]`, variable where available
- Smoke test: render `<GlowContainer>` on stub home with Orbitron heading
- **Done**: stub home uses Clu theme + correct fonts + 1 gridcn component renders
- **Risk gate**: Tailwind 4 + shadcn compat — should be supported but verify `bunx shadcn` doesn't error
- **Risk gate**: gridcn Clu preset — confirm a Clu preset exists in the registry; if not, hand-paint the CSS variables

### Phase 3 — Base layout + home page chrome
- `src/layouts/Base.astro`: `<head>` (title, description, og, fonts, favicon, canonical), `<body>` slot, footer
- Top bar component: monogram + nav (`HOME` / `POSTS`) + `TRANSMISSION #<git-sha>` (Vite `import.meta.env` for sha at build)
- Hero component: name, headline, tagline placeholder, meta row, CTAs
- Footer: socials, colophon, git sha + build timestamp, copyright
- All copy stubbed; no content yet
- **Done**: home page looks like a Gridcn landing, with placeholder text

### Phase 4 — Home content from `src/data/home.ts`
- Hand-author `home.ts` (typed): hero, stats, experience, projects, speaking, social
- Stats HUD section (6 cards)
- Experience timeline (3 jobs: BEN, LEVEE, Coderockr — Magrathea dropped)
- Projects grid (hub, rabbids, typesafe-config)
- Speaking cards (2016 with slides + video, 2017 with slides only)
- Recent Posts section: hidden when 0 posts (returns null from getCollection)
- Draft 3–5 tagline options inline as comments in `home.ts`; pick one
- **Done**: home matches blueprint, all 8 sections rendered with real content

### Phase 5 — Content collection + post detail + custom CodeBlock
- `src/content/config.ts`: blog collection schema (title, description, pubDate, updatedDate?, tags[], draft, lang, heroImage?, heroImageAlt?)
- Install `@astrojs/mdx`
- `src/components/blog/CodeBlock.tsx`: fork `TronCodeBlock`, drop `CopyButton`, verify `CodeBlockShiki` SSRs
  - **If `CodeBlockShiki` is browser-only**: replace with direct `shiki` Node import (`getHighlighter` at module load); cache the highlighter
- `src/lib/rehype-codeblock.ts`: walks AST, finds `<pre><code class="language-*">`, parses meta string for `filename="..."`, rewrites to `<CodeBlock>` JSX
- Wire rehype plugin in `astro.config.mjs` under `markdown.rehypePlugins`
- `src/lib/reading-time.ts`: remark plugin, computes `readingTime` from rendered MD
- `src/pages/posts/[slug].astro`: port from `.reference/the-grid-blog-template.tsx`
  - Drop: `NewsletterForm`, fake views counter (`Transmission #4,291`)
  - Keep: TOC scroll-spy (`client:visible`), scroll-to-top (`client:visible`), share buttons (`client:idle`), breadcrumbs, tags, author box, hero placeholder, related articles
- Add `src/content/blog/sample.mdx` (lorem + a code block + a heading) for smoke testing
- **Done**: `/posts/sample` renders with full chrome, code block has Tron style + zero client JS for the block itself
- **Risk gate**: verify `dist/posts/sample/index.html` contains the highlighted code as static HTML (no shiki JS shipped)

### Phase 6 — Posts index + Recent Posts wiring
- `src/pages/posts/index.astro`: paginated list of published posts (10 per page); each card = title, date, reading time, tags, excerpt
- Wire Recent Posts section on home: top 3 published posts
- **Done**: `/posts/` lists posts, home shows them

### Phase 7 — SEO + RSS + sitemap + robots + favicon + OG
- `@astrojs/rss` → `src/pages/rss.xml.ts` (full content, not excerpts)
- `@astrojs/sitemap` integration
- `public/robots.txt` (allow all + sitemap link)
- `public/favicon.svg` + `favicon.png` (LL monogram, Clu amber on dark — placeholder OK for v1)
- `public/og.png` (1200×630 static fallback — design in any vector tool, ~30 min)
- Wire og:image, og:title, og:description, og:type in `Base.astro`
- `<link rel="alternate" type="application/rss+xml" href="/rss.xml">` in head
- `<link rel="canonical">` per page
- `astro.config.mjs`: `site: 'https://leandrolugaresi.com.br'`
- **Done**: lighthouse SEO ≥95, RSS validates, sitemap validates

### Phase 8 — 404 page
- `src/pages/404.astro`: Gridcn TRANSMISSION LOST design
- HUD chrome top, big `404` Orbitron, mono sub-copy, two CTAs (`RETURN TO BASE` / `BROWSE TRANSMISSIONS`)
- **Done**: 404 visually on-brand

### Phase 9 — Analytics + first real content
- Add Cloudflare Web Analytics token to `Base.astro` (Pages dashboard generates the snippet)
- Replace placeholder copy on home (final tagline pick, polished bullets)
- Write the first real post (proposed: "Rebuilding leandrolugaresi.com.br with Astro + Gridcn") — also serves as Phase 13 setup material
- Update `home.ts` if needed
- **Done**: analytics live, ≥1 real post published

### Phase 10 — Pre-cutover verification
- Lighthouse all pages (home, posts index, sample post, 404): perf/seo/a11y/best-practices ≥90
- Manual QA checklist:
  - All pages load
  - All internal links work
  - All external links open in new tab where intended
  - RSS feed validates (`https://validator.w3.org/feed/`)
  - Sitemap validates
  - 404 triggers on bad URL
  - All Gridcn components render in Clu
  - Fonts load (no FOUT/FOIT)
  - No console errors
  - Mobile layout passes (375px / 768px / 1024px breakpoints)
  - Cmd-View-Source confirms code blocks are static HTML, not JS-rendered
- DNS sanity: confirm `leandrolugaresi.com.br` still resolves to Netlify (no premature flip)
- **Done**: checklist passes; site ready

### Phase 11 — Cutover
- `git checkout master && git reset --hard v2 && git push --force origin master` (single destructive overwrite — confirm before pushing)
- Tag the commit *before* the reset as `v1-hugo`: `git tag v1-hugo <pre-reset-sha>` and `git push origin v1-hugo`
- CF Pages dashboard: change production branch from `v2` → `master`
- CF Pages dashboard: attach custom domain `leandrolugaresi.com.br` (apex)
- Cloudflare DNS: add CNAME `leandrolugaresi.com.br` → `<project>.pages.dev` (CNAME flattening on apex)
- Cloudflare DNS: CNAME `www` → `leandrolugaresi.com.br` + Pages redirect rule `www → apex 301`
- Verify HTTPS cert provisioned (auto, ~minutes)
- Verify `https://leandrolugaresi.com.br` serves new site
- **Done**: site is live on production domain
- **Risk gate**: never `git push --force` to master without first verifying `git log v2` matches what you expect

### Phase 12 — Post-cutover verification
- Verify all routes serve under custom domain
- Verify HTTPS, HSTS (if enabled in CF settings)
- Verify CF Web Analytics receiving data
- Submit `https://leandrolugaresi.com.br/sitemap-index.xml` to Google Search Console (one-time, manual)
- Wait 1–2 weeks; monitor for issues
- If clean: delete Netlify project + tear down Netlify DNS records (already migrated, but double-check)
- **Done**: old infra decommissioned

### Phase 13 — First playground post
- Implement Satori-based per-post OG image generation as a build-time hook
- Write the post about doing it ("How I added per-post OG images via Satori on Cloudflare Pages")
- Publish
- **Done**: every post gets a unique OG image; first playground post live

---

## Risk gates & verification (running list)
- **R1 / Tailwind 4 + shadcn + gridcn compatibility** → smoke-test in Phase 2 with a single component install
- **R2 / Clu theme preset availability** → verify in Phase 2; hand-paint CSS variables if missing
- **R3 / `CodeBlockShiki` SSR-ability** → check in Phase 5; replace with direct `shiki` Node call if browser-only
- **R4 / Custom rehype plugin correctness** → verify rendered HTML in Phase 5 build output
- **R5 / Bundle size on post detail page** → check in Phase 5; goal <30KB JS for the whole page
- **R6 / Bun runtime on CF Pages build** → verify in Phase 1; fall back to npm if broken
- **R7 / DNS propagation** → start Phase 0 *now*; do not begin Phase 11 until Phase 0 has been settled for ≥7 days
- **R8 / Force push to master** → manual diff verification before pushing in Phase 11

## Deferred (post-launch playground posts)
- Per-post OG images via Satori (Phase 13)
- View counters via Cloudflare KV
- Site search via Cloudflare Vectorize
- Image CDN via Cloudflare Images
- Custom Clu-tinted Shiki theme
- Webmentions support
- `/uses/` page
- `/now/` page
- Obsidian → MDX sync pipeline (separate subproject)
- Light mode (only if anyone asks)

## Deferred (content writing tasks)
- Tagline copy (3–5 drafts in Phase 4)
- Hero meta row exact wording
- Stat HUD label/number micro-copy
- Experience bullet prose (rewrite from CV bullets)
- 404 micro-copy
- Footer colophon final wording
- First real blog post (Phase 9)

## Out of scope (v1)
- Newsletter / mailing list / signup
- Comments
- Multi-author
- i18n routing / language switcher / Portuguese content
- `/tags/` taxonomy routes
- `/itemized/*` redirects from old site
- Talks/projects as separate routes (folded into home)
- Contact form
- Light mode toggle
- Photo / avatar in hero
- Categories
- Search
- Per-post OG images
- Cloudflare Workers / KV / D1 / R2

## Open questions (require user input before/during execution)
1. **Bun on CF Pages build**: confirmed supported but unverified for *this* project — verify in Phase 1
2. **Clu preset in gridcn registry**: does it exist as a one-command install, or do we hand-paint CSS vars?
3. **Tagline copy**: deferred to Phase 4 — I draft, you pick
4. **First real blog post topic**: proposed "rebuilding the site"; alternatives welcome
5. **CV YAML `website:` field fix**: you said you'd handle separately; not blocking
6. **Slides for 2017 talk**: confirmed local on Speaker Deck only (no video, recording lost)
7. **OG image design**: simple text-on-background or something more elaborate? Affects ~30 min vs ~2 hours
8. **Favicon design**: monogram `LL` is the recommendation — confirm before Phase 7, or accept placeholder and design later
