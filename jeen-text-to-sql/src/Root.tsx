import React from "react";
import { Composition } from "remotion";
import { FPS } from "./brand";
import { Promo, PROMO_SECONDS, Walkthrough, WALKTHROUGH_SECONDS } from "./videos";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TextToSqlWalkthrough"
      component={Walkthrough}
      durationInFrames={Math.round(WALKTHROUGH_SECONDS * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="TextToSqlPromo"
      component={Promo}
      durationInFrames={PROMO_SECONDS * FPS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
