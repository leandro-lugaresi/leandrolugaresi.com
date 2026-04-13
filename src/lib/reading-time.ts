import { toString } from 'mdast-util-to-string';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

const WORDS_PER_MINUTE = 220;

/**
 * Remark plugin that measures reading time and injects it into
 * the post's frontmatter so Astro exposes it at `entry.data.readingTime`.
 */
export function remarkReadingTime() {
  return (tree: Root, file: VFile) => {
    const text = toString(tree);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    const data = (file.data as { astro?: { frontmatter?: Record<string, unknown> } })
      .astro;
    if (data?.frontmatter) {
      data.frontmatter['readingTime'] = {
        minutes,
        words,
        text: `${minutes} min read`,
      };
    }
  };
}
