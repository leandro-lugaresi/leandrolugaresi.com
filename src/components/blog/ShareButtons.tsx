import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

interface Props {
  url: string;
  title: string;
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard permission denied; ignore.
    }
  };

  const btn =
    'flex items-center gap-2 rounded border border-primary/30 bg-primary/5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground/70 transition-all hover:border-primary/60 hover:text-primary';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary/60">
        Share
      </span>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <XIcon className="h-3 w-3" />
        Twitter
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <LinkedinIcon className="h-3 w-3" />
        LinkedIn
      </a>
      <button type="button" onClick={copy} className={btn}>
        {copied ? (
          <>
            <Check className="h-3 w-3" aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Link2 className="h-3 w-3" aria-hidden="true" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
