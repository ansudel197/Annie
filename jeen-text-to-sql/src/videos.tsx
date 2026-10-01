import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BlurWords,
  C,
  Captions,
  Closing,
  FPS,
  Line,
  Logo,
  PillOpening,
  SANS,
  SERIF,
  useSpring,
} from "./brand";
import { ChipCue, Screen, ScreenClip, SCREEN_DURATION } from "./screen";

const f = (s: number) => Math.round(s * FPS);

/* ------------------------------------------------------------------ */
/* Audio                                                               */
/* ------------------------------------------------------------------ */
const VoiceOver: React.FC<{ lines: Line[] }> = ({ lines }) => (
  <>
    {lines.map((l) => (
      <Sequence key={l.id} from={f(l.at)} durationInFrames={f(l.dur) + 10} layout="none">
        <Audio src={staticFile(`vo-n/${l.id}.wav`)} />
      </Sequence>
    ))}
  </>
);

/** Opening and ending sounds from the Jeen brand video (no narration). */
const BrandSounds: React.FC<{ endAt: number }> = ({ endAt }) => (
  <>
    <Sequence durationInFrames={f(3.3)} layout="none">
      <Audio src={staticFile("sfx-open.m4a")} volume={0.85} />
    </Sequence>
    <Sequence from={f(endAt)} layout="none">
      <Audio src={staticFile("sfx-end.m4a")} volume={0.85} />
    </Sequence>
  </>
);

/* ------------------------------------------------------------------ */
/* Title shown as the pill wall clears                                 */
/* ------------------------------------------------------------------ */
const TitleCard: React.FC<{ delay: number; headline: string; accent: string; sub?: string }> = ({
  delay,
  headline,
  accent,
  sub,
}) => {
  const logo = useSpring(delay - 4);
  const subIn = useSpring(delay + 22);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        color: C.maroon,
        textAlign: "center",
      }}
    >
      <div style={{ opacity: logo, transform: `scale(${0.85 + logo * 0.15})` }}>
        <Logo scale={0.55} />
      </div>
      <div
        style={{
          marginTop: 44,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: 8,
          color: C.purple,
          opacity: logo,
        }}
      >
        TEXT-TO-SQL DATA AGENT
      </div>
      <div style={{ display: "flex", alignItems: "baseline", marginTop: 20 }}>
        <BlurWords
          text={headline}
          delay={delay}
          style={{ fontSize: 120, letterSpacing: -3, lineHeight: 1.05 }}
        />
        <BlurWords
          text={accent}
          delay={delay + 10}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 138,
            color: C.red,
            lineHeight: 1.05,
          }}
        />
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 30,
            fontSize: 38,
            color: C.muted,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 16}px)`,
          }}
        >
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Small decorative pills that keep the brand present around the screen. */
const CornerPills: React.FC = () => {
  const p = useSpring(0, 14);
  const pill = (
    left: number,
    top: number,
    h: number,
    bg: string,
    d = 0,
  ): React.ReactNode => (
    <div
      key={`${left}-${top}`}
      style={{
        position: "absolute",
        left,
        top,
        width: 44,
        height: h,
        borderRadius: 22,
        background: bg,
        transform: `scaleY(${Math.max(0, Math.min(1, p * 1.2 - d))})`,
        transformOrigin: "50% 100%",
      }}
    />
  );
  return (
    <AbsoluteFill>
      {pill(1800, 960, 120, C.pink)}
      {pill(1852, 920, 160, C.red, 0.1)}
      {pill(1852, 1086, 30, C.orange, 0.2)}
      {pill(24, 990, 90, C.orange, 0.15)}
      {pill(76, 1030, 50, C.purple, 0.25)}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* "No SQL. No code. No BI bottleneck." bubbles                         */
/* ------------------------------------------------------------------ */
const NoCode: React.FC = () => {
  const items: [string, string, string][] = [
    ["No SQL.", C.red, "#fff"],
    ["No code.", C.orange, C.maroon],
    ["No BI bottleneck.", C.purple, "#fff"],
  ];
  return (
    <AbsoluteFill
      style={{
        background: C.cream,
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        fontFamily: SANS,
      }}
    >
      {items.map(([t, bg, color], i) => {
        const s = useSpring(i * 9, 13);
        return (
          <div
            key={t}
            style={{
              background: bg,
              color,
              borderRadius: 999,
              padding: "26px 70px",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -2,
              transform: `scale(${s}) rotate(${(1 - s) * (i % 2 ? 6 : -6)}deg)`,
              opacity: Math.min(1, s * 2),
            }}
          >
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Dashboard montage: what plain-text questions turn into               */
/* ------------------------------------------------------------------ */
const MONTAGE: { from: number; label: string }[] = [
  { from: 41.7, label: "Live route maps" },
  { from: 70.7, label: "Interactive charts" },
  { from: 80.7, label: "KPIs & lane tables" },
];

const Montage: React.FC = () => {
  const head = useSpring(0);
  const w = 560;
  const gap = 40;
  const left0 = (1920 - (w * 3 + gap * 2)) / 2;
  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily: SANS, color: C.maroon }}>
      <CornerPills />
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          opacity: head,
          transform: `translateY(${(1 - head) * 20}px)`,
        }}
      >
        <span style={{ fontSize: 84, letterSpacing: -2 }}>Plain-text questions. </span>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 100, color: C.red }}>
          Live visual answers.
        </span>
      </div>
      {MONTAGE.map((m, i) => {
        const p = useSpring(10 + i * 8, 16);
        const left = left0 + i * (w + gap);
        return (
          <div key={m.label} style={{ opacity: Math.min(1, p * 1.5) }}>
            <div style={{ transform: `translateY(${(1 - p) * 80}px)` }}>
              <ScreenClip from={m.from} left={left} top={400} width={w} />
              <div
                style={{
                  position: "absolute",
                  left,
                  top: 400 + (w * 600) / 1240 + 30,
                  width: w,
                  textAlign: "center",
                  fontSize: 36,
                  fontWeight: 600,
                }}
              >
                {m.label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Walkthrough                                                         */
/* ------------------------------------------------------------------ */
const TITLE_END = 10.8;
const NOCODE_END = 14.4;
const SCREEN_AT = 23.4;
const CLOSING_AT = SCREEN_AT + SCREEN_DURATION - 0.3;
export const WALKTHROUGH_SECONDS = CLOSING_AT + 8.6;

// Start times are in seconds of the final video.
const S = (e: number) => SCREEN_AT + e;
const WALK_LINES: Line[] = [
  { id: "w0", at: 3.4, dur: 7.17, text: "Meet Jeen's data agent: a virtual analyst that lets anyone query complex, live databases, in plain language." },
  { id: "p6", at: TITLE_END + 0.2, dur: 3.23, text: "No SQL. No code. No BI bottleneck." },
  { id: "m1", at: NOCODE_END + 0.5, dur: 5.08, text: "Simple text questions turn into live charts, maps and dashboards. Here's how it works." },
  { id: "w1", at: S(0.0), dur: 7.28, text: "The process starts with a simple query. The user asks the AI assistant: “What's in transit right now? Show 20 results.”" },
  { id: "w2", at: S(7.4), dur: 9.53, text: "Instantly, the system processes the request and retrieves a detailed data table of 20 live shipments, providing raw data and automated insights at a glance." },
  { id: "w3", at: S(17.6), dur: 9.34, text: "Shipment references, transport modes, origins, destinations and coordinates. All from a plain-language question. No SQL, no code, and no BI tools." },
  { id: "w4", at: S(27.2), dur: 5.9, text: "To get a better visual understanding of the data, the user simply types a follow-up command: “create a dashboard.”" },
  { id: "w5", at: S(33.4), dur: 2.65, text: "The agent builds a complete app around the data." },
  { id: "w6", at: S(38.6), dur: 16.54, text: "Within seconds, the application generates a comprehensive, interactive dashboard. It features top-level key metrics, a dynamic global map plotting precise transit routes, and interactive data visualizations, transforming raw data into clear, actionable operational intelligence." },
  { id: "w7", at: S(56.9), dur: 5.5, text: "Hover over any route to see its details: mode, origin, destination, priority and progress." },
  { id: "w8", at: S(66.9), dur: 9.55, text: "Switch views to compare lanes, completion and tonnage, so anyone in the organization, from executives to field operators, can spot bottlenecks and act faster." },
  { id: "w9", at: S(80.4), dur: 5.88, text: "From a plain-text question to a live, interactive control panel. Faster, data-driven decisions." },
  { id: "w10", at: CLOSING_AT + 0.3, dur: 4.3, text: "Ready to scale AI on your terms? Request a demo at jeen.ai." },
];
const CAPTIONED = WALK_LINES.filter((l) => l.id.startsWith("w") && l.id !== "w0" && l.id !== "w10");

const WALK_CHAPTERS: ChipCue[] = [
  { from: 0, to: 6.3, text: "01 · Ask in plain language" },
  { from: 6.3, to: 27.2, text: "02 · Text-to-Data" },
  { from: 27.2, to: 38.0, text: "03 · “create a dashboard”" },
  { from: 38.0, to: 999, text: "04 · Text-to-Dashboard" },
];

export const Walkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const closingIn = interpolate(frame, [f(CLOSING_AT), f(CLOSING_AT) + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Sequence durationInFrames={f(TITLE_END)}>
        <PillOpening clearAt={66}>
          <TitleCard
            delay={78}
            headline="Ask your data"
            accent="anything."
            sub="Live data, instant insights and dashboards, from plain language."
          />
        </PillOpening>
      </Sequence>
      <Sequence from={f(TITLE_END)} durationInFrames={f(NOCODE_END - TITLE_END)}>
        <NoCode />
      </Sequence>
      <Sequence from={f(NOCODE_END)} durationInFrames={f(SCREEN_AT - NOCODE_END)}>
        <Montage />
      </Sequence>
      <Sequence from={f(SCREEN_AT)} durationInFrames={f(SCREEN_DURATION)}>
        <CornerPills />
        <Screen top={160} chapters={WALK_CHAPTERS} flashAt={[6.3, 32.1, 38.0]} />
      </Sequence>
      <AbsoluteFill style={{ top: 800, height: 140, justifyContent: "center", padding: "0 300px" }}>
        <Captions lines={CAPTIONED} />
      </AbsoluteFill>
      <Sequence from={f(CLOSING_AT)}>
        <AbsoluteFill style={{ opacity: closingIn }}>
          <Closing />
        </AbsoluteFill>
      </Sequence>
      <VoiceOver lines={WALK_LINES} />
      <BrandSounds endAt={CLOSING_AT + 4.65} />
    </AbsoluteFill>
  );
};
