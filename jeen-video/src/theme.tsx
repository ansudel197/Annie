import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Bundled locally (variable font, weights 200-800) so renders work offline.
export const fontFamily = "Assistant";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/assistant-latin.woff2"),
  weight: "200 800",
  format: "woff2",
});

export const C = {
  bg: "#FBF6F3",
  plum: "#5B2D5E",
  plumDark: "#3D1F44",
  orange: "#F2A24A",
  coral: "#E5574A",
  lilac: "#E3A8E6",
  text: "#3B2340",
  muted: "#7A6680",
  line: "#EBDDE4",
};

export const FPS = 30;

/** Spring-driven entrance (0 → 1) that starts `delay` frames into the scene. */
export const useEnter = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, distance = 40, style, children }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pop: React.FC<{
  delay?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, style, children }) => {
  const p = useEnter(delay, 14);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Soft drifting lilac/orange blob, echoing the deck's cover art. */
export const Blob: React.FC<{
  x: number;
  y: number;
  size: number;
  opacity?: number;
}> = ({ x, y, size, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 60) * 30;
  const dy = Math.cos(frame / 75) * 25;
  const rot = frame / 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx - size / 2,
        top: y + dy - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        opacity,
        filter: "blur(70px)",
        background: `conic-gradient(from ${rot}deg, ${C.lilac}, ${C.orange}, ${C.coral}, ${C.lilac})`,
      }}
    />
  );
};

export const Logo: React.FC<{ scale?: number; color?: string }> = ({
  scale = 1,
  color = C.text,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14 * scale,
      fontFamily,
    }}
  >
    <div style={{ position: "relative", width: 56 * scale, height: 56 * scale }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 10 * scale,
          width: 26 * scale,
          height: 46 * scale,
          borderRadius: 6 * scale,
          background: C.lilac,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 30 * scale,
          top: 0,
          width: 26 * scale,
          height: 30 * scale,
          borderRadius: 6 * scale,
          background: C.coral,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 30 * scale,
          top: 34 * scale,
          width: 22 * scale,
          height: 22 * scale,
          borderRadius: 5 * scale,
          background: C.orange,
        }}
      />
    </div>
    <div
      style={{
        fontSize: 64 * scale,
        fontWeight: 400,
        color,
        letterSpacing: -1 * scale,
        lineHeight: 1,
      }}
    >
      Jeen
    </div>
  </div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = C.plum,
}) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 6,
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </div>
);

export const Accent: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = C.orange,
}) => <span style={{ color }}>{children}</span>;

export const GradientText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span
    style={{
      backgroundImage: `linear-gradient(90deg, #B75DBC 0%, #CF5E8E 50%, #E5822F 100%)`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

/** Standard slide frame: cream background, eyebrow, footer and corner accents. */
export const Slide: React.FC<{
  eyebrow?: string;
  children: React.ReactNode;
  dark?: boolean;
  blobs?: boolean;
}> = ({ eyebrow, children, dark = false, blobs = false }) => {
  const frame = useCurrentFrame();
  const barW = interpolate(frame, [0, 25], [0, 380], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: dark ? C.plumDark : C.bg,
        fontFamily,
        color: dark ? "#fff" : C.text,
        overflow: "hidden",
      }}
    >
      {blobs ? (
        <>
          <Blob x={1650} y={820} size={700} opacity={0.55} />
          <Blob x={150} y={120} size={420} opacity={0.3} />
        </>
      ) : null}
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 0,
          width: barW,
          height: 46,
          background: C.orange,
          borderRadius: "0 0 16px 16px",
          opacity: dark ? 0.9 : 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 120,
          height: 96,
          background: C.coral,
          borderRadius: "0 0 0 18px",
          transform: `translateX(${120 - (barW / 380) * 120}px)`,
        }}
      />
      {eyebrow ? (
        <div style={{ position: "absolute", left: 110, top: 80 }}>
          <Eyebrow color={dark ? C.lilac : C.plum}>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <AbsoluteFill style={{ padding: "150px 110px 110px" }}>
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 42,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 20,
          color: dark ? "#D9C7DD" : C.muted,
        }}
      >
        <Logo scale={0.38} color={dark ? "#fff" : C.text} />
        <span>· Governed AI, on Your Terms</span>
      </div>
    </AbsoluteFill>
  );
};
