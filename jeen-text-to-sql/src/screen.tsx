import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { C, FPS, SANS, useSpring } from "./brand";

/**
 * Edited screen recording: browser chrome cropped off, waiting time cut,
 * pre-scaled to exactly the on-screen size so it stays sharp (no zooms).
 */
export const SCREEN_W = 1240;
export const SCREEN_H = 600;
export const SCREEN_DURATION = 91.1;

export type ChipCue = { from: number; to: number; text: string };

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: C.maroon,
      color: "#fff",
      borderRadius: 999,
      padding: "12px 28px",
      fontFamily: SANS,
      fontSize: 28,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** A clip of the recording in a rounded window. `from` is in edited-clip seconds. */
export const ScreenClip: React.FC<{
  from: number;
  left: number;
  top: number;
  width?: number;
}> = ({ from, left, top, width = SCREEN_W }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height: (width * SCREEN_H) / SCREEN_W,
      borderRadius: 22,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 30px 80px rgba(74,11,38,0.18), 0 0 0 1px rgba(74,11,38,0.06)",
    }}
  >
    <OffthreadVideo
      src={staticFile("screen.mp4")}
      trimBefore={Math.round(from * FPS)}
      muted
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  </div>
);

/** The full walkthrough recording at native display size, chapter label above it. */
export const Screen: React.FC<{
  top: number;
  chapters?: ChipCue[];
  flashAt?: number[];
}> = ({ top, chapters = [], flashAt = [] }) => {
  const frame = useCurrentFrame();
  const e = frame / FPS;
  const enter = useSpring(0, 200, 20);
  const left = (1920 - SCREEN_W) / 2;
  const chapter = chapters.find((c) => e >= c.from && e < c.to);
  const chipIn = chapter
    ? interpolate(e, [chapter.from, chapter.from + 0.4], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const flash = flashAt.reduce(
    (m, t) =>
      Math.max(
        m,
        interpolate(e, [t - 0.1, t, t + 0.3], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    0,
  );
  return (
    <AbsoluteFill style={{ opacity: enter, transform: `translateY(${(1 - enter) * 30}px)` }}>
      <ScreenClip from={0} left={left} top={top} />
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 22,
          background: "#fff",
          opacity: flash * 0.85,
        }}
      />
      {chapter ? (
        <div
          style={{
            position: "absolute",
            left,
            top: top - 76,
            opacity: chipIn,
            transform: `translateY(${(1 - chipIn) * 10}px)`,
          }}
        >
          <Chip>{chapter.text}</Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
