import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, FPS, SANS, useSpring } from "./brand";

/** Edited screen recording: browser chrome cropped off, 1812x876. */
export const SCREEN_W = 1812;
export const SCREEN_H = 876;
export const SCREEN_DURATION = 100.66;

/** [editedTime, scale, originX%, originY%] */
export type Zoom = [number, number, number, number];

const zoomAt = (zooms: Zoom[], e: number) => {
  if (zooms.length === 0) return { s: 1, ox: 50, oy: 50 };
  if (e <= zooms[0][0]) return { s: zooms[0][1], ox: zooms[0][2], oy: zooms[0][3] };
  for (let i = 0; i < zooms.length - 1; i++) {
    const [t0, s0, x0, y0] = zooms[i];
    const [t1, s1, x1, y1] = zooms[i + 1];
    if (e >= t0 && e <= t1) {
      const p = interpolate(e, [t0, t1], [0, 1], {
        easing: Easing.inOut(Easing.cubic),
      });
      return { s: s0 + (s1 - s0) * p, ox: x0 + (x1 - x0) * p, oy: y0 + (y1 - y0) * p };
    }
  }
  const last = zooms[zooms.length - 1];
  return { s: last[1], ox: last[2], oy: last[3] };
};

const Chip: React.FC<{ children: React.ReactNode; bg: string; color: string }> = ({
  children,
  bg,
  color,
}) => (
  <div
    style={{
      background: bg,
      color,
      borderRadius: 999,
      padding: "12px 28px",
      fontFamily: SANS,
      fontSize: 28,
      fontWeight: 600,
      whiteSpace: "nowrap",
      boxShadow: "0 8px 24px rgba(74,11,38,0.15)",
    }}
  >
    {children}
  </div>
);

export type ChipCue = { from: number; to: number; text: string };

/**
 * The product recording presented as a platform window.
 * `from` is the edited-clip second this scene starts at; zooms, chips and
 * fast-forward badges are given in edited-clip seconds.
 */
export const Screen: React.FC<{
  from: number;
  width: number;
  top: number;
  zooms?: Zoom[];
  chapters?: ChipCue[];
  fastForward?: ChipCue[];
  flashAt?: number[];
}> = ({ from, width, top, zooms = [], chapters = [], fastForward = [], flashAt = [] }) => {
  const frame = useCurrentFrame();
  const e = from + frame / FPS;
  const enter = useSpring(0, 200, 20);
  const h = (width * SCREEN_H) / SCREEN_W;
  const left = (1920 - width) / 2;
  const z = zoomAt(zooms, e);
  const chapter = chapters.find((c) => e >= c.from && e < c.to);
  const ff = fastForward.find((c) => e >= c.from && e < c.to);
  const flash = flashAt.reduce(
    (m, t) =>
      Math.max(
        m,
        interpolate(e, [t - 0.12, t, t + 0.35], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    0,
  );
  const chipIn = chapter
    ? interpolate(e, [chapter.from, chapter.from + 0.4], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left,
          top: top + (1 - enter) * 40,
          width,
          height: h,
          borderRadius: 26,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 30px 80px rgba(74,11,38,0.18), 0 0 0 1px rgba(74,11,38,0.06)",
          opacity: enter,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${z.s})`,
            transformOrigin: `${z.ox}% ${z.oy}%`,
          }}
        >
          <OffthreadVideo
            src={staticFile("screen.mp4")}
            trimBefore={Math.round(from * FPS)}
            muted
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.9 }} />
      </div>
      {chapter ? (
        <div
          style={{
            position: "absolute",
            left: left - 22,
            top: top - 26,
            opacity: chipIn,
            transform: `translateY(${(1 - chipIn) * 12}px)`,
          }}
        >
          <Chip bg={C.maroon} color="#fff">
            {chapter.text}
          </Chip>
        </div>
      ) : null}
      {ff ? (
        <div style={{ position: "absolute", right: left + 24, top: top + 24 }}>
          <Chip bg={C.orange} color={C.maroon}>
            {ff.text}
          </Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
