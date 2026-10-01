import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Fonts are bundled locally so renders work without network access.
export const SANS = "Figtree";
export const SERIF = "Instrument Serif";
loadFont({
  family: SANS,
  url: staticFile("fonts/figtree.woff2"),
  weight: "300 900",
  format: "woff2",
});
loadFont({
  family: SERIF,
  url: staticFile("fonts/instrument-serif-italic.woff2"),
  style: "italic",
  format: "woff2",
});

// Sampled from the Jeen brand video.
export const C = {
  cream: "#FFF8F4",
  maroon: "#4A0B26",
  red: "#FF4C2D",
  orange: "#FDAD33",
  pink: "#FFB0FB",
  purple: "#8F307C",
  muted: "#8A6A78",
  line: "#F1E2E6",
};

export const FPS = 30;

const GRADIENTS = [
  `linear-gradient(90deg, ${C.pink}, ${C.red})`,
  `linear-gradient(90deg, ${C.red}, ${C.orange})`,
  `linear-gradient(90deg, ${C.pink}, ${C.purple})`,
  `linear-gradient(90deg, ${C.orange}, ${C.purple})`,
  `linear-gradient(90deg, ${C.purple}, ${C.maroon})`,
];
const SOLIDS = [C.orange, C.red, C.pink, C.purple, C.maroon];

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */
export const Logo: React.FC<{ scale?: number; word?: boolean; color?: string }> = ({
  scale = 1,
  word = true,
  color = C.maroon,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 30 * scale }}>
    <div style={{ position: "relative", width: 150 * scale, height: 150 * scale }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 72 * scale,
          height: 150 * scale,
          borderRadius: 36 * scale,
          background: C.pink,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 78 * scale,
          top: 0,
          width: 72 * scale,
          height: 115 * scale,
          borderRadius: 36 * scale,
          background: C.red,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 78 * scale,
          top: 120 * scale,
          width: 72 * scale,
          height: 30 * scale,
          borderRadius: 15 * scale,
          background: C.orange,
        }}
      />
    </div>
    {word ? (
      <div
        style={{
          fontFamily: SANS,
          fontSize: 118 * scale,
          fontWeight: 400,
          color,
          letterSpacing: -2 * scale,
          lineHeight: 1,
          marginTop: -6 * scale,
        }}
      >
        Jeen
      </div>
    ) : null}
  </div>
);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
export const useSpring = (delay = 0, damping = 200, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping }, durationInFrames });
};

/** Word-by-word blur-in, like the reference video's headline reveal. */
export const BlurWords: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number) => React.CSSProperties | undefined;
}> = ({ text, delay = 0, stagger = 3, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={style}>
      {words.map((w, i) => {
        const p = interpolate(frame, [delay + i * stagger, delay + i * stagger + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              filter: `blur(${(1 - p) * 10}px)`,
              transform: `translateY(${(1 - p) * 14}px)`,
              marginRight: "0.26em",
              ...wordStyle?.(i),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Pill-wall opening                                                   */
/* ------------------------------------------------------------------ */
type Pill = { x: number; y: number; h: number; bg: string; col: number; idx: number };

const buildPills = (): Pill[] => {
  const pills: Pill[] = [];
  const pitch = 120;
  for (let col = 0; col < 16; col++) {
    let y = -40 - random(`off-${col}`) * 160;
    let idx = 0;
    while (y < 1100) {
      const tall = random(`tall-${col}-${idx}`) > 0.55;
      const h = tall ? 300 : 140;
      const r = random(`col-${col}-${idx}`);
      const bg =
        r < 0.3
          ? GRADIENTS[Math.floor(random(`g-${col}-${idx}`) * GRADIENTS.length)]
          : SOLIDS[Math.floor(random(`s-${col}-${idx}`) * SOLIDS.length)];
      pills.push({ x: col * pitch + 10, y, h, bg, col, idx });
      y += h + 10 + Math.floor(random(`gap-${col}-${idx}`) * 3) * 60;
      idx++;
    }
  }
  return pills;
};
const PILLS = buildPills();

/**
 * Pills pop in column by column from the left, hold, then pop away
 * at random to reveal `children`.
 * Timeline (frames): fill 0-36, hold to 66, clear 66-96.
 */
export const PillOpening: React.FC<{ children?: React.ReactNode; clearAt?: number }> = ({
  children,
  clearAt = 66,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: "hidden" }}>
      <AbsoluteFill>{children}</AbsoluteFill>
      {PILLS.map((p, i) => {
        const inDelay = p.col * 2 + p.idx * 1.2 + random(`d-${i}`) * 3;
        const grow = spring({
          frame: frame - inDelay,
          fps,
          config: { damping: 11, stiffness: 160, mass: 0.6 },
        });
        const outDelay = clearAt + random(`o-${i}`) * 26;
        const out = interpolate(frame, [outDelay, outDelay + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (grow <= 0.001 || out >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 100,
              height: p.h,
              borderRadius: 50,
              background: p.bg,
              transformOrigin: "50% 0%",
              transform: `scaleY(${Math.max(0.04, grow) * (1 - out * 0.5)}) scaleX(${interpolate(
                grow,
                [0, 1],
                [0.4, 1],
              )})`,
              opacity: 1 - out,
              filter: out > 0 ? `blur(${out * 8}px)` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Closing (logo, CTA, rising domes)                                   */
/* ------------------------------------------------------------------ */
export const Closing: React.FC<{ fadeOutFrames?: number }> = ({ fadeOutFrames = 18 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const logo = useSpring(0);
  const btn = useSpring(26);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const domes: { cx: number; d: number; top: number; bg: string; delay: number }[] = [
    { cx: 240, d: 560, top: 822, bg: `linear-gradient(180deg, ${C.red}, #FE5E50)`, delay: 4 },
    { cx: 890, d: 680, top: 826, bg: `linear-gradient(180deg, ${C.red}, #FE5E50)`, delay: 9 },
    { cx: 1500, d: 480, top: 828, bg: `linear-gradient(180deg, ${C.pink}, #FEA1DB)`, delay: 14 },
    { cx: 1870, d: 220, top: 832, bg: `linear-gradient(180deg, ${C.red}, #FE5E50)`, delay: 19 },
  ];
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: "hidden", opacity: fadeOut }}>
      {domes.map((d, i) => {
        const p = useSpring(d.delay, 18);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.cx - d.d / 2,
              top: d.top + (1 - p) * 300,
              width: d.d,
              height: d.d,
              borderRadius: "50%",
              background: d.bg,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", fontFamily: SANS, color: C.maroon }}>
        <div
          style={{
            marginTop: 150,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 30}px) scale(${0.9 + logo * 0.1})`,
          }}
        >
          <Logo scale={1} />
        </div>
        <BlurWords
          text="Ready to scale AI"
          delay={8}
          style={{ fontSize: 96, marginTop: 70, lineHeight: 1.1, letterSpacing: -1.5 }}
        />
        <BlurWords
          text="on your terms?"
          delay={16}
          style={{ fontSize: 96, lineHeight: 1.1, letterSpacing: -1.5 }}
          wordStyle={(i) => (i > 0 ? { fontWeight: 700 } : undefined)}
        />
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 56,
            opacity: btn,
            transform: `translateY(${(1 - btn) * 20}px)`,
          }}
        >
          <div
            style={{
              background: C.pink,
              borderRadius: 999,
              padding: "20px 40px",
              fontSize: 34,
              fontWeight: 500,
            }}
          >
            Request a demo
          </div>
          <div
            style={{
              border: `2px solid ${C.pink}`,
              borderRadius: 999,
              padding: "18px 38px",
              fontSize: 34,
              fontWeight: 500,
            }}
          >
            jeen.ai
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Captions                                                            */
/* ------------------------------------------------------------------ */
export type Line = { id: string; at: number; dur: number; text: string };

/** Splits each voiceover line into short phrases timed by character count. */
export const toChunks = (lines: Line[], maxChars = 62) => {
  const out: { from: number; to: number; text: string }[] = [];
  for (const l of lines) {
    const parts: string[] = [];
    let cur = "";
    for (const w of l.text.split(" ")) {
      const next = cur ? `${cur} ${w}` : w;
      const breakHere = /[.?!:]$/.test(cur) && cur.length > 18;
      if ((next.length > maxChars || breakHere) && cur) {
        parts.push(cur);
        cur = w;
      } else cur = next;
    }
    if (cur) parts.push(cur);
    const total = parts.reduce((s, p) => s + p.length, 0);
    let t = l.at;
    for (const p of parts) {
      const d = (p.length / total) * l.dur;
      out.push({ from: t, to: t + d, text: p });
      t += d;
    }
  }
  return out;
};

export const Captions: React.FC<{
  lines: Line[];
  offset?: number;
  style?: React.CSSProperties;
  maxChars?: number;
}> = ({ lines, offset = 0, style, maxChars }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS - offset;
  const chunk = toChunks(lines, maxChars).find((c) => t >= c.from - 0.05 && t < c.to + 0.15);
  if (!chunk) return null;
  const local = t - chunk.from;
  const o = interpolate(local, [0, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 40,
        fontWeight: 500,
        color: C.maroon,
        textAlign: "center",
        opacity: o,
        transform: `translateY(${(1 - o) * 8}px)`,
        ...style,
      }}
    >
      {chunk.text}
    </div>
  );
};
