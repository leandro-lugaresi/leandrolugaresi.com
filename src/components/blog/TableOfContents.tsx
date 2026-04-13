import { useEffect, useState } from 'react';

export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: Props) {
  const items = headings.filter((h) => h.depth === 2 || h.depth === 3);
  const [activeId, setActiveId] = useState<string | null>(
    items[0]?.slug ?? null
  );

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) {
          current = item.slug;
        } else {
          break;
        }
      }
      setActiveId(current ?? items[0].slug);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-24">
      <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary/70">
        // Contents
      </p>
      <ol className="mt-4 space-y-2 border-l border-primary/20">
        {items.map((item) => {
          const active = item.slug === activeId;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                data-active={active}
                className={[
                  'block border-l-2 py-1 font-mono text-[11px] uppercase tracking-widest transition-colors',
                  item.depth === 3 ? 'pl-6' : 'pl-4',
                  active
                    ? '-ml-px border-primary text-primary'
                    : '-ml-px border-transparent text-foreground/50 hover:text-foreground/80',
                ].join(' ')}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
