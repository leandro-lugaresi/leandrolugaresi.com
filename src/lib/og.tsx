import satori, { type SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Theme colors mirror src/styles/global.css. Satori doesn't evaluate
// color-mix() or CSS variables, so values are inlined.
const COLORS = {
  bg: '#0a0a0a',
  amber: '#ff8a3d',
  foreground: '#f5f5f5',
  mutedForeground: 'rgba(245, 245, 245, 0.65)',
  amberDim: 'rgba(255, 138, 61, 0.45)',
  amberFaint: 'rgba(255, 138, 61, 0.08)',
  amberGrid: 'rgba(255, 138, 61, 0.08)',
};

let fontCache: SatoriOptions['fonts'] | null = null;

async function loadFonts(): Promise<SatoriOptions['fonts']> {
  if (fontCache) return fontCache;
  const [orbitron900, orbitron700, mono400] = await Promise.all([
    readFile(require.resolve('@fontsource/orbitron/files/orbitron-latin-900-normal.woff')),
    readFile(require.resolve('@fontsource/orbitron/files/orbitron-latin-700-normal.woff')),
    readFile(require.resolve('@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff')),
  ]);
  fontCache = [
    { name: 'Orbitron', data: orbitron900, weight: 900, style: 'normal' },
    { name: 'Orbitron', data: orbitron700, weight: 700, style: 'normal' },
    { name: 'Geist Mono', data: mono400, weight: 400, style: 'normal' },
  ];
  return fontCache;
}

export interface OgInput {
  title: string;
  description?: string;
  /** Pre-formatted date, e.g. "Apr 14, 2026". */
  date: string;
  tags?: string[];
  /** Overline shown above the title. Defaults to "// TRANSMISSION". */
  kicker?: string;
}

function CornerBrackets() {
  const armLen = 40;
  const thickness = 3;
  const offset = 40;
  const common = { position: 'absolute' as const, background: COLORS.amber };
  return (
    <>
      {/* top-left */}
      <div style={{ ...common, top: offset, left: offset, width: armLen, height: thickness }} />
      <div style={{ ...common, top: offset, left: offset, width: thickness, height: armLen }} />
      {/* top-right */}
      <div style={{ ...common, top: offset, right: offset, width: armLen, height: thickness }} />
      <div style={{ ...common, top: offset, right: offset, width: thickness, height: armLen }} />
      {/* bottom-left */}
      <div style={{ ...common, bottom: offset, left: offset, width: armLen, height: thickness }} />
      <div style={{ ...common, bottom: offset, left: offset, width: thickness, height: armLen }} />
      {/* bottom-right */}
      <div style={{ ...common, bottom: offset, right: offset, width: armLen, height: thickness }} />
      <div style={{ ...common, bottom: offset, right: offset, width: thickness, height: armLen }} />
    </>
  );
}

function GridLines() {
  const rows = [80, 160, 240, 320, 400, 480, 560];
  return (
    <>
      {rows.map((y) => (
        <div
          key={`h-${y}`}
          style={{
            position: 'absolute',
            left: 0,
            top: y,
            width: 1200,
            height: 1,
            background: COLORS.amberGrid,
          }}
        />
      ))}
    </>
  );
}

function truncate(input: string, max: number) {
  return input.length <= max ? input : input.slice(0, max - 1).trimEnd() + '…';
}

function OgTemplate({ title, description, date, tags = [], kicker = '// TRANSMISSION' }: OgInput) {
  const safeTitle = truncate(title, 90);
  const safeDescription = description ? truncate(description, 180) : undefined;
  const displayTags = tags.slice(0, 4).map((t) => `#${t.toUpperCase()}`).join('   ');

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        background: COLORS.bg,
        fontFamily: 'Geist Mono',
        color: COLORS.foreground,
        position: 'relative',
      }}
    >
      <GridLines />

      {/* Outer frame */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 1120,
          height: 550,
          border: `1px solid ${COLORS.amberDim}`,
        }}
      />

      <CornerBrackets />

      {/* Top row: monogram chip + kicker */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 90,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            border: `1.5px solid ${COLORS.amberDim}`,
            background: COLORS.amberFaint,
            color: COLORS.amber,
            fontFamily: 'Orbitron',
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: 2,
          }}
        >
          LL
        </div>
        <div
          style={{
            fontSize: 18,
            color: COLORS.amber,
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          {kicker}
        </div>
      </div>

      {/* Main title block */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 90,
          right: 90,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: 'Orbitron',
            fontWeight: 900,
            fontSize: safeTitle.length > 48 ? 60 : 76,
            lineHeight: 1.05,
            color: COLORS.foreground,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textWrap: 'balance',
          }}
        >
          {safeTitle}
        </div>
        {safeDescription && (
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              lineHeight: 1.5,
              color: COLORS.mutedForeground,
              maxWidth: 960,
            }}
          >
            {safeDescription}
          </div>
        )}
      </div>

      {/* Bottom row: date + tags on left, url on right */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          bottom: 72,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 16,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}
      >
        <div style={{ display: 'flex', gap: 32, color: COLORS.mutedForeground }}>
          <div style={{ color: COLORS.amber }}>{date}</div>
          {displayTags && <div>{displayTags}</div>}
        </div>
        <div style={{ color: COLORS.amber }}>LEANDROLUGARESI.COM.BR</div>
      </div>
    </div>
  );
}

export async function generateOgImage(input: OgInput): Promise<Uint8Array> {
  const fonts = await loadFonts();
  const svg = await satori(<OgTemplate {...input} />, {
    width: 1200,
    height: 630,
    fonts,
  });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
