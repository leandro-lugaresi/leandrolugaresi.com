/**
 * Hand-authored landing-page content.
 *
 * Source of truth: ../../../claude-get-me-a-job/outputs/cv-versions/
 * senior-backend-engineer.yaml. The CV is the canonical doc — when
 * roles, dates, projects, or stats change there, mirror them here.
 *
 * Everything is typed so a missing field at the call site shows up
 * at build time, not in production.
 */

// ─── Types ─────────────────────────────────────────────────────────

export interface HeroData {
  name: string;
  /** Short professional headline, e.g. "Backend & Systems Engineer". */
  headline: string;
  /** One-line tagline. The picked entry is `tagline`; alternates live below in comments. */
  tagline: string;
  /** Multi-paragraph bio for the About section. */
  bio: string[];
  /** Top-of-frame label, like "OPERATOR DOSSIER · 0001". */
  kicker: string;
}

export interface SystemMeta {
  location: string;
  status: string;
  role: string;
  build: string;
  posts: string;
  mode: string;
}

export interface SocialLink {
  label: string;
  href: string;
  external: boolean;
}

export interface StatCard {
  label: string;
  value: string;
  unit?: string;
  /** Optional sub-label rendered smaller below the number. */
  sub?: string;
}

export interface ExperienceJob {
  company: string;
  role: string;
  /** Display string like "2021 — present" or "2019 — 2021". */
  period: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface ProjectCard {
  name: string;
  description: string;
  /** Repo URL — used as the card link. */
  href: string;
  /** Approximate GitHub star count, used for the small star pill. */
  stars: number;
  language: string;
  tags: string[];
}

export interface TalkCard {
  title: string;
  /** Conference + city, e.g. "Gophercon Brazil 2016 · Florianópolis". */
  event: string;
  /** ISO date for the <time> tag. */
  date: string;
  description: string;
  slidesHref?: string;
  /** Full YouTube watch URL or null when the recording is lost. */
  videoHref?: string;
}

// ─── Hero ──────────────────────────────────────────────────────────

/*
 * Tagline drafts — pick one for `hero.tagline`. Keep the rest as a
 * paper trail; cycling through these is cheap and the alternates
 * are useful when copy gets stale.
 *
 *   1. Backend systems that prefer to keep running when nobody is watching.
 *   2. 13+ years moving bytes through pipelines that don't fall over.
 *   3. Notes from inside a 6-billion-record data catalog.
 *   4. Backend engineer. Go. TypeScript. Pipes that flow at 3am.
 *   5. Building data systems at the boundary of distributed and stubborn.
 *
 * Currently picked: #1 — leans into the "reliability over flash" voice
 * the rest of the chrome is already projecting.
 */

export const hero: HeroData = {
  name: "Leandro Lugaresi",
  headline: "Backend & Systems Engineer",
  tagline:
    "Backend systems that prefer to keep running when nobody is watching.",
  bio: [
    "Backend engineer with 13+ years building high-performance data systems, APIs, and event-driven architectures. Core expertise in Go and TypeScript/Node.js, with deep experience in data pipeline optimization, distributed messaging, and platform infrastructure.",
    "Currently owns a 6.4-billion-record TV/Film/Sports content catalog at BEN — daily incremental sync pipelines processing ~100K updates that used to take hours and now finish in under ten minutes. Open source contributor (148+ GitHub stars). Speaker at Gophercon Brazil 2016 and 2017.",
  ],
  kicker: "OPERATOR DOSSIER · 0001",
};

// ─── System strip ──────────────────────────────────────────────────

export const system: SystemMeta = {
  location: "Joinville · BR",
  status: "Open to ideas",
  role: "Senior backend",
  build: "OK",
  posts: "Pending",
  mode: "Dark / Clu",
};

// ─── Social ────────────────────────────────────────────────────────

export const social: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/leandro-lugaresi",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/leandrolugaresi/",
    external: true,
  },
  {
    label: "Speaker Deck",
    href: "https://speakerdeck.com/leandrolugaresi",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:leandro.l.lugaresi@gmail.com",
    external: false,
  },
  { label: "RSS", href: "/rss.xml", external: false },
];

// ─── Stats HUD ─────────────────────────────────────────────────────

export const stats: StatCard[] = [
  {
    label: "Years engineering",
    value: "13",
    unit: "+",
    sub: "shipping since 2013",
  },
  {
    label: "Sync speedup",
    value: "24",
    unit: "×",
    sub: "on a 6B-record catalog",
  },
  {
    label: "Zero-incident streak",
    value: "03",
    unit: " yrs",
    sub: "LEVEE rabbit topology",
  },
];

// ─── Experience ────────────────────────────────────────────────────

export const experience: ExperienceJob[] = [
  {
    company: "Branded Entertainment Network",
    role: "Senior Software Engineer",
    period: "2021 — present",
    location: "Utah, USA · Remote",
    summary:
      "Owns the core data integration layer for a TV / Film / Sports content catalog platform — 6.4B records (3.8B linear ratings + 2.6B streaming) ingesting from Luminate, Nielsen, and Gracenote. Team of 6 engineers.",
    highlights: [
      "Rebuilt the Snowflake → OpenSearch sync pipeline (own initiative). Migrated from full S3 export to delta-based incremental sync over Snowflake Streams, processing ~100K updates daily. Sync time: hours → under 10 minutes.",
      "Built the Snowflake infrastructure from scratch — migration system, function/procedure sync, CLI for users + environments, RSA key pair setup, zero-copy cloning for dev/staging.",
      "Built a custom Snowflake MCP server (TypeScript) for AI-assisted debug queries and data exploration. Improved query accuracy across the whole codebase.",
    ],
  },
  {
    company: "LEVEE",
    role: "Software Developer",
    period: "2019 — 2021",
    location: "São Paulo, Brazil · Remote",
    summary:
      "Built event-driven microservices for one of Latin America's largest HR platforms at the time (5–10M users), in Go, Ruby on Rails, RabbitMQ, and PostgreSQL.",
    highlights: [
      "Rebuilt the RabbitMQ messaging topology across ~20 microservices. Three years of zero incidents after the redesign — directly led to open-sourcing the rabbids Go library.",
      "Replaced Google geocoding APIs in under a month when pricing changed, saving ~$15K/month (~$180K/year). Built the replacement using Brazilian public address data and Who's On First spatial data.",
      "Maintained Ruby microservices alongside implementing new Go services for the platform.",
    ],
  },
  {
    company: "Coderockr",
    role: "Developer",
    period: "2014 — 2018",
    location: "Joinville, Brazil",
    summary:
      "Consulting engineer embedded with client teams. Built greenfield systems for startups and improved reliability of existing platforms. Early Go adopter in Brazil — started learning Go here, which led to two Gophercon Brazil talks.",
    highlights: [],
  },
];

// ─── Projects ──────────────────────────────────────────────────────

export const projects: ProjectCard[] = [
  {
    name: "hub",
    description:
      "High-performance Message/Event Hub for Go using publish/subscribe. Topics with RabbitMQ-style exchanges, no allocations on the hot path.",
    href: "https://github.com/leandro-lugaresi/hub",
    stars: 148,
    language: "Go",
    tags: ["pub/sub", "event hub", "no-deps"],
  },
  {
    name: "rabbids",
    description:
      "Go wrapper around the AMQP client for RabbitMQ. Reconnect with exponential backoff, channel APIs, delayed-message support, and middlewares.",
    href: "https://github.com/leveeml/rabbids",
    stars: 14,
    language: "Go",
    tags: ["amqp", "rabbitmq", "middleware"],
  },
  {
    name: "typesafe-config",
    description:
      "TypeScript library for type-safe configuration. Pulls from multiple sources, merges them, validates against a schema. The boring config layer you actually want.",
    href: "https://github.com/leandro-lugaresi/typesafe-config",
    stars: 0,
    language: "TypeScript",
    tags: ["config", "zod-friendly", "node/bun"],
  },
];

// ─── Speaking ──────────────────────────────────────────────────────

export const speaking: TalkCard[] = [
  {
    title: "Pipelines em Go",
    event: "Gophercon Brazil 2017 · Florianópolis",
    date: "2017-11-18",
    description:
      "Concurrency patterns and pipelines in Go: how to use them efficiently across IO and CPUs, and how their use reduced a legacy data export from 5 hours to 7 minutes.",
    slidesHref: "https://speakerdeck.com/leandrolugaresi/pipelines-em-go",
    // Recording lost — slides only.
  },
  {
    title: "Realtime applications using gRPC",
    event: "Gophercon Brazil 2016 · Florianópolis",
    date: "2016-11-20",
    description:
      "An introduction to gRPC and how to use it to build better applications in a realtime world. Spoke at the very first edition of Gophercon Brazil.",
    slidesHref: "https://speakerdeck.com/leandrolugaresi/introducao-a-grpc",
    videoHref: "https://www.youtube.com/watch?v=osaj1SbRL_k",
  },
];
