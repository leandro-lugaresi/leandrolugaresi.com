import * as React from "react";

interface AnimatedStatValueProps {
  value: string;
  duration?: number;
}

export function AnimatedStatValue({ value, duration = 1200 }: AnimatedStatValueProps) {
  const target = parseInt(value, 10);
  const pad = value.startsWith("0") ? value.length : 0;
  const isNumeric = Number.isFinite(target);

  const [display, setDisplay] = React.useState(isNumeric ? 0 : target);
  const ref = React.useRef<HTMLSpanElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (!isNumeric) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, isNumeric]);

  const text = isNumeric && pad > 0 ? String(display).padStart(pad, "0") : String(display);

  return <span ref={ref}>{text}</span>;
}
