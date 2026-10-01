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
import { ChipCue, Screen, SCREEN_DURATION, Zoom } from "./screen";

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

/** Background music, ducked under the voiceover. */
const Music: React.FC<{ src: string; lines: Line[]; base: number; duck: number }> = ({
  src,
  lines,
  base,
  duck,
}) => (
  <Audio
    src={staticFile(src)}
    volume={(fr) => {
      const t = fr / FPS;
      let d = 0;
      for (const l of lines) {
        d = Math.max(
          d,
          interpolate(t, [l.at - 0.35, l.at, l.at + l.dur, l.at + l.dur + 0.5], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        );
      }
      return base - (base - duck) * d;
    }}
  />
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
/* Full walkthrough                                                    */
/* ------------------------------------------------------------------ */
const SCREEN_AT = 10.8;
const CLOSING_AT = SCREEN_AT + SCREEN_DURATION - 0.3;
export const WALKTHROUGH_SECONDS = CLOSING_AT + 8;

// Voiceover start times are in seconds of the final video.
const S = (e: number) => SCREEN_AT + e;
const WALK_LINES: Line[] = [
  { id: "w0", at: 3.4, dur: 7.17, text: "Meet Jeen's data agent: a virtual analyst that lets anyone query complex, live databases, in plain language." },
  { id: "w1", at: S(0.2), dur: 7.28, text: "The process starts with a simple query. The user asks the AI assistant: “What's in transit right now? Show 20 results.”" },
  { id: "w2", at: S(8.7), dur: 9.53, text: "Instantly, the system processes the request and retrieves a detailed data table of 20 live shipments, providing raw data and automated insights at a glance." },
  { id: "w3", at: S(19.4), dur: 9.34, text: "Shipment references, transport modes, origins, destinations and coordinates. All from a plain-language question. No SQL, no code, and no BI tools." },
  { id: "w4", at: S(30.0), dur: 5.9, text: "To get a better visual understanding of the data, the user simply types a follow-up command: “create a dashboard.”" },
  { id: "w5", at: S(41.3), dur: 2.65, text: "The agent builds a complete app around the data." },
  { id: "w6", at: S(48.0), dur: 16.54, text: "Within seconds, the application generates a comprehensive, interactive dashboard. It features top-level key metrics, a dynamic global map plotting precise transit routes, and interactive data visualizations, transforming raw data into clear, actionable operational intelligence." },
  { id: "w7", at: S(66.5), dur: 5.5, text: "Hover over any route to see its details: mode, origin, destination, priority and progress." },
  { id: "w8", at: S(76.5), dur: 9.55, text: "Switch views to compare lanes, completion and tonnage, so anyone in the organization, from executives to field operators, can spot bottlenecks and act faster." },
  { id: "w9", at: S(90.0), dur: 5.88, text: "From a plain-text question to a live, interactive control panel. Faster, data-driven decisions." },
  { id: "w10", at: CLOSING_AT + 1.2, dur: 4.3, text: "Ready to scale AI on your terms? Request a demo at jeen.ai." },
];

const WALK_ZOOMS: Zoom[] = [
  [0, 1.5, 50, 96],
  [3.3, 1.5, 50, 96],
  [4.4, 1, 50, 50],
  [8.8, 1, 50, 50],
  [10, 1.18, 50, 20],
  [19.5, 1.18, 50, 20],
  [21, 1, 50, 50],
  [30.6, 1, 50, 50],
  [31.6, 1.5, 50, 96],
  [34.6, 1.5, 50, 96],
  [35.6, 1, 50, 50],
  [41.2, 1, 50, 50],
  [42, 1.3, 40, 72],
  [47, 1.3, 40, 72],
  [47.62, 1, 50, 50],
  [51, 1, 50, 50],
  [52.2, 1.25, 50, 12],
  [57.5, 1.25, 50, 12],
  [59, 1, 50, 50],
  [66.2, 1, 50, 50],
  [67.4, 1.32, 82, 72],
  [73, 1.32, 82, 72],
  [74.4, 1, 50, 50],
];

const WALK_CHAPTERS: ChipCue[] = [
  { from: 0, to: 8.6, text: "01 · Ask in plain language" },
  { from: 8.6, to: 30.4, text: "02 · Text-to-Data" },
  { from: 30.4, to: 47.62, text: "03 · “create a dashboard”" },
  { from: 47.62, to: 999, text: "04 · Text-to-Dashboard" },
];

const FAST_FORWARD: ChipCue[] = [
  { from: 4.0, to: 8.1, text: "▶▶ Fast-forward 4×" },
  { from: 34.65, to: 41.1, text: "▶▶ Fast-forward 6×" },
];

export const Walkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const closingIn = interpolate(frame, [f(CLOSING_AT), f(CLOSING_AT) + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Sequence durationInFrames={f(SCREEN_AT) + 10}>
        <PillOpening clearAt={66}>
          <TitleCard
            delay={78}
            headline="Ask your data"
            accent="anything."
            sub="Live data, instant insights and dashboards, from plain language."
          />
        </PillOpening>
      </Sequence>
      <Sequence from={f(SCREEN_AT)} durationInFrames={f(SCREEN_DURATION)}>
        <AbsoluteFill
          style={{
            opacity: interpolate(frame - f(SCREEN_AT), [0, 10], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <CornerPills />
          <Screen
            from={0}
            width={1560}
            top={62}
            zooms={WALK_ZOOMS}
            chapters={WALK_CHAPTERS}
            fastForward={FAST_FORWARD}
            flashAt={[47.62]}
          />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ top: 880, height: 140, justifyContent: "center", padding: "0 220px" }}>
        <Captions lines={WALK_LINES.slice(1, -1)} />
      </AbsoluteFill>
      <Sequence from={f(CLOSING_AT)}>
        <AbsoluteFill style={{ opacity: closingIn }}>
          <Closing />
        </AbsoluteFill>
      </Sequence>
      <VoiceOver lines={WALK_LINES} />
      <Music src="music-full.m4a" lines={WALK_LINES} base={0.45} duck={0.14} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 30-second promo                                                     */
/* ------------------------------------------------------------------ */
const PROMO_LINES: Line[] = [
  { id: "p1", at: 0.4, dur: 3.11, text: "What if anyone in your company could simply talk to your data?" },
  { id: "p2", at: 3.9, dur: 1.46, text: "Meet Jeen's data agent." },
  { id: "p3", at: 6.8, dur: 3.96, text: "Ask in plain language, and get live data with instant insights." },
  { id: "p4", at: 13.7, dur: 1.92, text: "Then just say: “create a dashboard.”" },
  { id: "p5", at: 16.9, dur: 4.22, text: "And get a full, interactive dashboard, with maps, KPIs and charts." },
  { id: "p6", at: 23.6, dur: 3.23, text: "No SQL. No code. No BI bottleneck." },
  { id: "p7", at: 27.3, dur: 2.03, text: "Jeen. AI on your terms." },
];
export const PROMO_SECONDS = 30;

const PromoClip: React.FC<{
  from: number;
  zooms: Zoom[];
  label: string;
  flash?: boolean;
}> = ({ from, zooms, label, flash }) => {
  const p = useSpring(4);
  return (
    <AbsoluteFill>
      <CornerPills />
      <Screen from={from} width={1500} top={70} zooms={zooms} flashAt={flash ? [from] : []} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 820,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -1.5,
          color: C.maroon,
          opacity: p,
          transform: `translateY(${(1 - p) * 24}px)`,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

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

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream }}>
    <Sequence durationInFrames={f(6.3)}>
      <PillOpening clearAt={56}>
        <TitleCard delay={68} headline="Talk to your" accent="data." />
      </PillOpening>
    </Sequence>
    <Sequence from={f(6.3)} durationInFrames={f(3.2)}>
      <PromoClip from={0} zooms={[[0, 1.5, 50, 96], [3.2, 1.55, 50, 96]]} label="Ask in plain language" />
    </Sequence>
    <Sequence from={f(9.5)} durationInFrames={f(4)}>
      <PromoClip from={8.6} zooms={[[8.6, 1, 50, 30], [12.6, 1.2, 50, 20]]} label="Get live data + insights" flash />
    </Sequence>
    <Sequence from={f(13.5)} durationInFrames={f(3)}>
      <PromoClip from={31.8} zooms={[[31.8, 1.5, 50, 96], [34.8, 1.55, 50, 96]]} label={"Say “create a dashboard”"} />
    </Sequence>
    <Sequence from={f(16.5)} durationInFrames={f(7)}>
      <PromoClip from={51.6} zooms={[[51.6, 1.05, 50, 30], [58.6, 1.22, 55, 35]]} label="A full dashboard. In seconds." flash />
    </Sequence>
    <Sequence from={f(23.5)} durationInFrames={f(3)}>
      <NoCode />
    </Sequence>
    <Sequence from={f(26.5)}>
      <Closing fadeOutFrames={12} />
    </Sequence>
    <VoiceOver lines={PROMO_LINES} />
    <Music src="music-promo.m4a" lines={PROMO_LINES} base={0.6} duck={0.2} />
  </AbsoluteFill>
);
