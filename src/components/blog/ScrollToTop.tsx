import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded border border-primary/40 bg-background/80 text-primary backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_20px_color-mix(in_oklch,var(--glow)_45%,transparent)]"
    >
      <ChevronUp className="h-4 w-4" />
    </button>
  );
}
