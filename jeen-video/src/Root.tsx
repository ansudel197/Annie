import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React from "react";
import { Composition } from "remotion";
import {
  Challenge,
  ControlPlane,
  Foundation,
  GovernThrough,
  Intro,
  MeetJeen,
  Outro,
  Showcase,
  Stories,
  Tools,
  Traction,
  Trust,
} from "./scenes";
import { FPS } from "./theme";

const TRANSITION = 15;

const showcase = (
  eyebrow: string,
  title: string,
  line: string,
  image: string,
  imageAspect: number,
) => () => (
  <Showcase
    eyebrow={eyebrow}
    title={title}
    line={line}
    image={image}
    imageAspect={imageAspect}
  />
);

const SCENES: { C: React.FC; frames: number }[] = [
  { C: Intro, frames: 150 },
  { C: Challenge, frames: 270 },
  { C: MeetJeen, frames: 150 },
  { C: Foundation, frames: 240 },
  { C: ControlPlane, frames: 210 },
  {
    C: showcase(
      "Control plane | FinOps",
      "Jeen FinOps",
      "Turn AI spend into an actively managed portfolio: budgets, real-time limits and smart routing.",
      "finops.png",
      2027 / 1140,
    ),
    frames: 105,
  },
  {
    C: showcase(
      "Control plane | Governance Hub",
      "Governance Hub",
      "Trace every run from business outcome to prompt, model call and output.",
      "governance.png",
      2039 / 1140,
    ),
    frames: 105,
  },
  {
    C: showcase(
      "Control plane | Admin Center",
      "Admin Center",
      "Your enterprise control tower: federate AI operations without fragmenting control.",
      "admin.png",
      2035 / 1140,
    ),
    frames: 105,
  },
  { C: GovernThrough, frames: 240 },
  { C: Tools, frames: 180 },
  {
    C: showcase(
      "Tools | Jeen Workspace",
      "Jeen Workspace",
      "The AI workspace employees will adopt. The operating layer enterprises require.",
      "workspace.png",
      950 / 810,
    ),
    frames: 105,
  },
  {
    C: showcase(
      "Tools | Agent Factory",
      "Agent Factory",
      "From quick Spark agents to mission-critical, autonomous workflows, all on one foundation.",
      "factory.png",
      1830 / 1110,
    ),
    frames: 105,
  },
  {
    C: showcase(
      "Tools | Jeen Talk",
      "Jeen Talk",
      "Governed voice and chat agents with live transcription, insight and real-time assistance.",
      "talk.png",
      2039 / 1140,
    ),
    frames: 105,
  },
  {
    C: showcase(
      "Tools | Jeen Apps",
      "Jeen Apps",
      "Start with a conversation. Leave with an application employees can use.",
      "apps.png",
      2039 / 1140,
    ),
    frames: 105,
  },
  { C: Traction, frames: 210 },
  { C: Stories, frames: 270 },
  { C: Trust, frames: 180 },
  { C: Outro, frames: 165 },
];

const TOTAL =
  SCENES.reduce((s, x) => s + x.frames, 0) - TRANSITION * (SCENES.length - 1);

const JeenVideo: React.FC = () => (
  <TransitionSeries>
    {SCENES.flatMap(({ C, frames }, i) => {
      const items = [
        <TransitionSeries.Sequence key={`s${i}`} durationInFrames={frames}>
          <C />
        </TransitionSeries.Sequence>,
      ];
      if (i < SCENES.length - 1) {
        items.push(
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={
              i % 3 === 2 ? slide({ direction: "from-right" }) : fade()
            }
            timing={linearTiming({ durationInFrames: TRANSITION })}
          />,
        );
      }
      return items;
    })}
  </TransitionSeries>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="JeenPromo"
    component={JeenVideo}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
