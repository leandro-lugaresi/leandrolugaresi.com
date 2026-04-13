import type { ShikiTransformer } from 'shiki';
import type { Element, Root } from 'hast';

/**
 * Shiki transformer that wraps the highlighted <pre> in the Tron-style
 * chrome used across the blog: scanline overlay, corner brackets, and
 * a header bar with the filename (or language) on the left.
 *
 * Extracts `filename="..."` from the fenced-block meta string:
 *
 *     ```ts filename="example.ts"
 *     …
 *     ```
 */

const CHROME_CLASSES = [
  'tron-code-block',
  'relative',
  'not-prose',
  'my-6',
  'overflow-hidden',
  'rounded',
  'border',
  'border-primary/30',
  'bg-card/80',
  'backdrop-blur-sm',
  'shadow-[0_0_15px_color-mix(in_oklch,var(--glow)_8%,transparent)]',
].join(' ');

function parseFilename(meta: string | undefined): string | undefined {
  if (!meta) return undefined;
  const match = meta.match(/filename=(?:"([^"]+)"|'([^']+)'|(\S+))/);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function chromeCorners(): Element[] {
  const base =
    'pointer-events-none absolute h-4 w-4 border-primary/40';
  const corners: Array<[string, string]> = [
    ['top-0 left-0', 'border-l-2 border-t-2'],
    ['top-0 right-0', 'border-r-2 border-t-2'],
    ['bottom-0 left-0', 'border-b-2 border-l-2'],
    ['bottom-0 right-0', 'border-b-2 border-r-2'],
  ];
  return corners.map(([pos, sides]) => ({
    type: 'element',
    tagName: 'div',
    properties: {
      'aria-hidden': 'true',
      className: `${base} ${pos} ${sides}`,
    },
    children: [],
  }));
}

function scanlineOverlay(): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      'aria-hidden': 'true',
      className:
        'pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]',
    },
    children: [],
  };
}

function headerBar(label: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className:
        'relative flex h-9 items-center justify-between border-b border-primary/15 bg-black/40 px-3 py-1.5',
    },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className:
            'font-mono text-[10px] uppercase tracking-widest text-foreground/50',
        },
        children: [{ type: 'text', value: label }],
      },
    ],
  };
}

export function shikiTronChrome(): ShikiTransformer {
  return {
    name: 'tron-chrome',
    root(root: Root) {
      const pre = root.children.find(
        (n): n is Element => n.type === 'element' && n.tagName === 'pre'
      );
      if (!pre) return;

      // Shiki stashes the raw meta on this.options.meta.__raw
      const meta = (this.options.meta as { __raw?: string } | undefined)
        ?.__raw;
      const filename = parseFilename(meta);
      const language =
        typeof this.options.lang === 'string' ? this.options.lang : '';
      const label = filename || language;

      // Mark the pre as the code content surface and give it a stable class.
      const preProps = (pre.properties ??= {});
      const existing =
        typeof preProps.className === 'string'
          ? preProps.className
          : Array.isArray(preProps.className)
            ? preProps.className.join(' ')
            : '';
      preProps.className =
        `${existing} relative bg-transparent overflow-x-auto font-mono text-sm leading-5 !m-0 !p-4`.trim();

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          'data-slot': 'tron-code-block',
          className: CHROME_CLASSES,
        },
        children: [
          scanlineOverlay(),
          ...chromeCorners(),
          ...(label ? [headerBar(label)] : []),
          pre,
        ],
      };

      root.children = [wrapper];
    },
  };
}
