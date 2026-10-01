import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Accent,
  Blob,
  C,
  fontFamily,
  GradientText,
  Logo,
  Pop,
  Rise,
  Slide,
  useEnter,
} from "./theme";

const h1: React.CSSProperties = {
  fontSize: 76,
  fontWeight: 700,
  lineHeight: 1.08,
  letterSpacing: -1.5,
  margin: 0,
};

const h2: React.CSSProperties = {
  fontSize: 58,
  fontWeight: 700,
  lineHeight: 1.12,
  letterSpacing: -1,
  margin: 0,
  color: C.plum,
};

/* ------------------------------------------------------------------ */
/* 1. Intro                                                            */
/* ------------------------------------------------------------------ */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const lineW = interpolate(frame, [10, 40], [0, 1000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily, overflow: "hidden" }}>
      <Blob x={1720} y={650} size={850} opacity={0.85} />
      <div style={{ position: "absolute", left: 140, top: 110 }}>
        <Pop delay={0}>
          <Logo scale={1.1} />
        </Pop>
      </div>
      <div
        style={{
          position: "absolute",
          left: 420,
          top: 150,
          width: lineW,
          height: 2,
          background: C.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1450,
          top: 118,
          fontSize: 26,
          color: C.muted,
          opacity: interpolate(frame, [25, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        AI on Your Terms
      </div>
      <div style={{ position: "absolute", left: 140, top: 330, color: C.plum }}>
        <Rise delay={12}>
          <h1 style={{ ...h1, fontSize: 112 }}>The governed</h1>
        </Rise>
        <Rise delay={20}>
          <h1 style={{ ...h1, fontSize: 112 }}>foundation for the</h1>
        </Rise>
        <Rise delay={28}>
          <h1 style={{ ...h1, fontSize: 112 }}>
            <GradientText>autonomous enterprise</GradientText>
          </h1>
        </Rise>
        <Rise delay={50}>
          <div
            style={{
              marginTop: 50,
              fontSize: 34,
              color: C.text,
              fontWeight: 600,
            }}
          >
            Build and Reason Anywhere · Govern Through Jeen · Own Your
            Intelligence
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Market challenge                                                 */
/* ------------------------------------------------------------------ */
const Chip: React.FC<{
  children: React.ReactNode;
  delay: number;
  color?: string;
}> = ({ children, delay, color = C.orange }) => (
  <Pop delay={delay}>
    <div
      style={{
        padding: "8px 16px",
        borderRadius: 10,
        border: `2px solid ${color}`,
        fontSize: 20,
        fontWeight: 700,
        color: C.plum,
        background: "#fff",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  </Pop>
);

const DecliningLine: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 520;
  return (
    <svg width="440" height="170" viewBox="0 0 440 170">
      <line x1="20" y1="10" x2="20" y2="150" stroke={C.muted} strokeWidth="2" />
      <line x1="20" y1="150" x2="430" y2="150" stroke={C.muted} strokeWidth="2" />
      <path
        d="M 30 20 C 60 120, 140 130, 420 138"
        fill="none"
        stroke={C.coral}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      <text x="30" y="168" fontSize="15" fill={C.muted} fontFamily={fontFamily}>
        As AI adoption grows, enterprise control weakens
      </text>
    </svg>
  );
};

const ChallengeCard: React.FC<{
  n: number;
  title: string;
  tag: string;
  delay: number;
  children: React.ReactNode;
}> = ({ n, title, tag, delay, children }) => (
  <Rise delay={delay} distance={70} style={{ flex: 1 }}>
    <div
      style={{
        height: 520,
        borderRadius: 26,
        border: `3px solid ${C.coral}`,
        background: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: C.coral,
          color: "#fff",
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1 }}>{n}</div>
        <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        {children}
      </div>
      <div
        style={{
          margin: "0 24px 24px",
          padding: "12px 0",
          borderRadius: 999,
          border: `2px solid ${C.coral}`,
          textAlign: "center",
          color: C.coral,
          fontWeight: 800,
          fontSize: 19,
          letterSpacing: 1.5,
        }}
      >
        {tag}
      </div>
    </div>
  </Rise>
);

const ChipGrid: React.FC<{ items: string[]; delay: number; color?: string }> = ({
  items,
  delay,
  color,
}) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "center",
      maxWidth: 440,
    }}
  >
    {items.map((it, i) => (
      <Chip key={it} delay={delay + i * 4} color={color}>
        {it}
      </Chip>
    ))}
  </div>
);

export const Challenge: React.FC = () => (
  <Slide eyebrow="The market challenge">
    <Rise delay={5}>
      <h2 style={{ ...h2, width: 1500 }}>
        The next enterprise AI scaling battle is about{" "}
        <Accent color={C.coral}>control</Accent>,{" "}
        <Accent>freedom to change</Accent>, and{" "}
        <Accent color="#C77ACB">sovereignty</Accent>
      </h2>
    </Rise>
    <div style={{ display: "flex", gap: 36, marginTop: 50 }}>
      <ChallengeCard
        n={1}
        title="The scaling bottleneck moves to the control layer"
        tag="MORE AUTONOMY → MORE CONTROL"
        delay={25}
      >
        <DecliningLine delay={50} />
      </ChallengeCard>
      <ChallengeCard
        n={2}
        title="Portability & future-proofing your AI stack = strategic insurance"
        tag="ADOPT WHAT COMES NEXT → NO REBUILD"
        delay={45}
      >
        <ChipGrid
          delay={70}
          items={[
            "Platforms",
            "Models",
            "Protocols",
            "Retrieval / RAG",
            "Frameworks",
            "Tools",
            "UX",
            "Agentic tools",
          ]}
        />
      </ChallengeCard>
      <ChallengeCard
        n={3}
        title="Organizational intelligence & learning loop become the moat"
        tag="RENT INTELLIGENCE → OWN YOUR IP"
        delay={65}
      >
        <ChipGrid
          delay={90}
          color={C.lilac}
          items={[
            "Business logic",
            "Workflows",
            "Decision rules",
            "Know-how",
            "Policies",
            "Guardrails",
            "Evaluations",
            "Context & ontology",
          ]}
        />
      </ChallengeCard>
    </div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Pop delay={150}>
        <div
          style={{
            background: C.plum,
            color: "#fff",
            borderRadius: 18,
            padding: "18px 40px",
            display: "flex",
            alignItems: "center",
            gap: 22,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          <Logo scale={0.55} color="#fff" />
          IS BUILT FOR ALL THREE
        </div>
      </Pop>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 3. Meet Jeen                                                        */
/* ------------------------------------------------------------------ */
export const MeetJeen: React.FC = () => {
  const pills: [string, string][] = [
    ["Manage, Measure & Govern Through Jeen", C.plum],
    ["Deploy, Build & Reason Anywhere", C.plum],
    ["Fully Sovereign", C.plum],
    ["Air-Gapped First", C.orange],
    ["From Agents to Employee Productivity", C.orange],
  ];
  return (
    <Slide eyebrow="Jeen solution" blobs>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 110,
        }}
      >
        <Pop delay={0}>
          <Logo scale={1.6} />
        </Pop>
        <Rise delay={12}>
          <h1 style={{ ...h1, fontSize: 130, color: C.plum, marginTop: 30 }}>
            Meet Jeen
          </h1>
        </Rise>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
            maxWidth: 1500,
            marginTop: 60,
          }}
        >
          {pills.map(([label, color], i) => (
            <Pop key={label} delay={35 + i * 10}>
              <div
                style={{
                  border: `3px solid ${color}`,
                  borderRadius: 999,
                  padding: "16px 36px",
                  fontSize: 32,
                  fontWeight: 700,
                  color,
                  background: color === C.orange ? "#FDF0E1" : "#fff",
                }}
              >
                {label}
              </div>
            </Pop>
          ))}
        </div>
      </div>
    </Slide>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Unified operating foundation                                     */
/* ------------------------------------------------------------------ */
const Layer: React.FC<{
  label: string;
  color: string;
  tint: string;
  delay: number;
  items: string[];
}> = ({ label, color, tint, delay, items }) => (
  <Rise delay={delay} distance={60}>
    <div
      style={{
        border: `3px solid ${color}`,
        background: tint,
        borderRadius: 22,
        padding: "34px 26px 22px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -18,
          left: "50%",
          transform: "translateX(-50%)",
          background: color,
          color: "#fff",
          borderRadius: 999,
          padding: "5px 22px",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
        }}
      >
        {items.map((it, i) => (
          <Pop key={it} delay={delay + 12 + i * 3}>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 21,
                fontWeight: 600,
                color: C.text,
                boxShadow: "0 2px 6px rgba(60,30,70,0.08)",
              }}
            >
              {it}
            </div>
          </Pop>
        ))}
      </div>
    </div>
  </Rise>
);

export const Foundation: React.FC = () => (
  <Slide eyebrow="Jeen solution">
    <div style={{ display: "flex", gap: 80, alignItems: "center", height: "100%" }}>
      <div style={{ width: 560 }}>
        <Rise delay={5}>
          <h2 style={{ ...h2, fontSize: 72 }}>
            One unified operating foundation across your{" "}
            <Accent>AI estate</Accent>
          </h2>
        </Rise>
        <div style={{ marginTop: 50 }}>
          {["Build anywhere", "Govern through Jeen", "Own your intelligence"].map(
            (t, i) => (
              <Rise key={t} delay={120 + i * 12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    fontSize: 36,
                    fontWeight: 600,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      background: C.orange,
                    }}
                  />
                  {t}
                </div>
              </Rise>
            ),
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 34,
        }}
      >
        <Layer
          label="DEPLOY & CONNECT ANYWHERE"
          color="#8C7A90"
          tint="#F3EEF2"
          delay={10}
          items={[
            "On-Premise",
            "Air-Gapped",
            "Cloud",
            "Private Cloud",
            "APIs",
            "MCP",
            "Enterprise Data",
          ]}
        />
        <Layer
          label="REASON ANYWHERE · Commercial · Open · Custom · Edge"
          color={C.coral}
          tint="#FCE9E6"
          delay={35}
          items={[
            "OpenAI",
            "Anthropic",
            "Gemini",
            "Llama",
            "Mistral",
            "Kimi",
            "Gemma",
            "Hugging Face",
          ]}
        />
        <Layer
          label="BUILD ANYWHERE · Tools · Agents · Apps · Workflows"
          color="#C77ACB"
          tint="#F8EAF8"
          delay={60}
          items={[
            "Your existing AI estate",
            "Governed gateway",
            "Workspace",
            "Agent Factory",
            "Jeen Talk",
            "Jeen Apps",
          ]}
        />
        <Layer
          label="UNIFIED CONTROL PLANE"
          color={C.orange}
          tint="#FDF0E1"
          delay={85}
          items={[
            "Knowledge & Intelligence",
            "Governance Hub",
            "Unified Admin",
            "FinOps & ROI",
          ]}
        />
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 5. Control plane pillars                                            */
/* ------------------------------------------------------------------ */
export const ControlPlane: React.FC = () => {
  const pillars: [string, string, string, string][] = [
    [
      "Knowledge & Intelligence",
      "Turn enterprise knowledge into governed, reusable context that agents and users can access.",
      "Permissions · source-aware access · reusable knowledge",
      C.orange,
    ],
    [
      "Governance Hub",
      "Define policy once. Enforce every run. Prove every outcome.",
      "Policy & guardrails · runtime enforcement · traceability",
      C.coral,
    ],
    [
      "Unified Admin",
      "Define the operating model. Federate control safely. Customize UX by role.",
      "Roles & scopes · delegated admin · approved models & tools",
      "#C77ACB",
    ],
    [
      "FinOps & ROI",
      "Plan and allocate AI budgets. Control spend in real time. Optimize across the estate.",
      "Budgets & wallets · metering · forecasting · smart routing",
      C.plum,
    ],
  ];
  return (
    <Slide eyebrow="Jeen solution | Control plane">
      <Rise delay={5}>
        <h2 style={{ ...h2, fontSize: 80, textAlign: "center", marginTop: 20 }}>
          Jeen Unified Control Plane
        </h2>
      </Rise>
      <div style={{ display: "flex", gap: 30, marginTop: 70 }}>
        {pillars.map(([title, body, foot, color], i) => (
          <Rise key={title} delay={25 + i * 14} distance={70} style={{ flex: 1 }}>
            <div
              style={{
                height: 500,
                background: "#fff",
                borderRadius: 24,
                borderTop: `14px solid ${color}`,
                boxShadow: "0 10px 30px rgba(60,30,70,0.08)",
                padding: "40px 34px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1.1 }}>
                {title}
              </div>
              <div
                style={{
                  fontSize: 29,
                  lineHeight: 1.35,
                  marginTop: 26,
                  color: C.text,
                  flex: 1,
                }}
              >
                {body}
              </div>
              <div style={{ fontSize: 20, color: C.muted, lineHeight: 1.4 }}>
                {foot}
              </div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={100}>
        <div
          style={{
            textAlign: "center",
            marginTop: 50,
            fontSize: 34,
            fontWeight: 700,
            color: C.plum,
          }}
        >
          Control what scales: people, spend, agents, data, policy and
          performance
        </div>
      </Rise>
    </Slide>
  );
};

/* ------------------------------------------------------------------ */
/* Showtime: product screenshot showcase                               */
/* ------------------------------------------------------------------ */
export const Showcase: React.FC<{
  eyebrow: string;
  title: string;
  line: string;
  image: string;
  imageAspect: number;
}> = ({ eyebrow, title, line, image, imageAspect }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08]);
  const frameW = 1180;
  const frameH = Math.min(760, frameW / imageAspect);
  return (
    <Slide eyebrow={eyebrow}>
      <div style={{ display: "flex", alignItems: "center", gap: 70, height: "100%" }}>
        <div style={{ width: 520 }}>
          <Rise delay={0}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: C.orange,
                letterSpacing: 4,
              }}
            >
              SHOWTIME
            </div>
          </Rise>
          <Rise delay={6}>
            <h2 style={{ ...h2, fontSize: 72, marginTop: 12 }}>{title}</h2>
          </Rise>
          <Rise delay={16}>
            <div
              style={{ fontSize: 34, lineHeight: 1.35, marginTop: 30, color: C.text }}
            >
              {line}
            </div>
          </Rise>
        </div>
        <Rise delay={8} distance={90}>
          <div
            style={{
              width: frameW,
              height: frameH,
              borderRadius: 28,
              background: C.plum,
              padding: 14,
              boxShadow: "0 30px 70px rgba(61,31,68,0.35)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 18,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <Img
                src={staticFile(image)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top left",
                  transform: `scale(${zoom})`,
                  transformOrigin: "30% 20%",
                }}
              />
            </div>
          </div>
        </Rise>
      </div>
    </Slide>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Build anywhere, govern through Jeen                              */
/* ------------------------------------------------------------------ */
const Chevron: React.FC<{ delay: number }> = ({ delay }) => {
  const p = useEnter(delay);
  return (
    <svg
      width="70"
      height="140"
      viewBox="0 0 70 140"
      style={{ opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}
    >
      <path
        d="M 12 10 L 58 70 L 12 130"
        fill="none"
        stroke={C.plum}
        strokeWidth="14"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const RowCard: React.FC<{
  children: React.ReactNode;
  delay: number;
  dot?: string;
  big?: boolean;
}> = ({ children, delay, dot = C.lilac, big }) => (
  <Rise delay={delay} distance={24}>
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `2px solid ${C.line}`,
        padding: big ? "18px 24px" : "14px 22px",
        fontSize: big ? 30 : 28,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 14,
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 4, background: dot }} />
      {children}
    </div>
  </Rise>
);

export const GovernThrough: React.FC = () => (
  <Slide eyebrow="Jeen solution | Control plane | Overview">
    <Rise delay={0}>
      <h2 style={{ ...h2, fontSize: 70 }}>Build anywhere, govern through Jeen</h2>
    </Rise>
    <Rise delay={8}>
      <div style={{ fontSize: 30, color: C.muted, marginTop: 14, width: 1500 }}>
        Keep the models, vendors and tools your teams already use, while the
        enterprise gains governance, observability, FinOps and freedom to change.
      </div>
    </Rise>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 50,
      }}
    >
      <div style={{ width: 420 }}>
        <Rise delay={14}>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.plum, marginBottom: 18 }}>
            Your existing AI estate
          </div>
        </Rise>
        {["Copilot", "Gemini", "Claude", "Azure OpenAI", "Internal builds", "Jeen tools"].map(
          (t, i) => (
            <RowCard key={t} delay={18 + i * 6}>
              {t}
            </RowCard>
          ),
        )}
      </div>
      <Chevron delay={60} />
      <Pop delay={70}>
        <div
          style={{
            width: 560,
            borderRadius: 24,
            background: "#fff",
            boxShadow: "0 20px 50px rgba(61,31,68,0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: `linear-gradient(90deg, ${C.orange}, ${C.coral})`,
              color: "#fff",
              fontSize: 40,
              fontWeight: 800,
              padding: "24px 0",
              textAlign: "center",
            }}
          >
            Jeen Control Plane
          </div>
          <div style={{ padding: "26px 30px 14px" }}>
            {[
              "Governance",
              "Admin Control",
              "FinOps",
              "Knowledge & Intelligence",
              "Model & Deployment Agnostic",
            ].map((t, i) => (
              <RowCard key={t} delay={85 + i * 6} dot={C.orange}>
                {t}
              </RowCard>
            ))}
          </div>
        </div>
      </Pop>
      <Chevron delay={125} />
      <div style={{ width: 440 }}>
        <Rise delay={130}>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.plum, marginBottom: 18 }}>
            What the enterprise gains
          </div>
        </Rise>
        {[
          "Radical Portability",
          "Complete Control",
          "Full Sovereignty",
          "Compounding Scalability",
        ].map((t, i) => (
          <RowCard key={t} delay={136 + i * 8} dot={C.plum} big>
            {t}
          </RowCard>
        ))}
      </div>
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 7. Tools & capabilities                                             */
/* ------------------------------------------------------------------ */
export const Tools: React.FC = () => {
  const tools: [string, string, string][] = [
    [
      "Workspace",
      "A familiar AI workspace where employees use approved models, tools and knowledge.",
      C.coral,
    ],
    [
      "Agent Factory",
      "Build, orchestrate and deploy enterprise agents, from simple assistants to autonomous workflows.",
      C.orange,
    ],
    [
      "Jeen Talk",
      "Governed voice and chat experiences across customer and employee channels.",
      "#C77ACB",
    ],
    [
      "Jeen Apps",
      "Production-ready AI apps, fast, with rich interfaces and connected workflows.",
      C.plum,
    ],
  ];
  return (
    <Slide eyebrow="Jeen solution | Tools and capabilities" blobs>
      <Rise delay={0}>
        <h2 style={{ ...h2, fontSize: 70, width: 1500 }}>
          AI capabilities people will actually use, without leaving governance
          behind
        </h2>
      </Rise>
      <div style={{ display: "flex", gap: 30, marginTop: 70 }}>
        {tools.map(([name, body, color], i) => (
          <Rise key={name} delay={20 + i * 12} distance={60} style={{ flex: 1 }}>
            <div
              style={{
                height: 420,
                background: "rgba(255,255,255,0.92)",
                borderRadius: 24,
                padding: "40px 34px",
                boxShadow: "0 10px 30px rgba(60,30,70,0.08)",
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 30 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: color }} />
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: C.orange,
                    marginTop: 18,
                    opacity: 0.8,
                  }}
                />
              </div>
              <div style={{ fontSize: 42, fontWeight: 800, color: C.plum }}>{name}</div>
              <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 18 }}>{body}</div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={90}>
        <div
          style={{
            marginTop: 50,
            fontSize: 34,
            color: C.coral,
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          The governed experiences that make enterprise AI useful every day.
        </div>
      </Rise>
    </Slide>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Traction numbers                                                 */
/* ------------------------------------------------------------------ */
const Counter: React.FC<{
  to: number;
  suffix: string;
  label: string;
  delay: number;
}> = ({ to, suffix, label, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const v = Math.round(to * p).toLocaleString("en-US");
  return (
    <Rise delay={delay} style={{ flex: 1, textAlign: "center" }}>
      <div
        style={{
          fontSize: 118,
          fontWeight: 800,
          color: C.plum,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {v}
        <span style={{ color: C.orange }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 32, marginTop: 16, color: C.text, fontWeight: 600 }}>
        {label}
      </div>
    </Rise>
  );
};

export const Traction: React.FC = () => (
  <Slide eyebrow="Customers" blobs>
    <Rise delay={0}>
      <h2 style={{ ...h2, fontSize: 76, textAlign: "center", marginTop: 30 }}>
        From market entry to tier-1 customer adoption
        <br />
        in <Accent>18 months</Accent>
      </h2>
    </Rise>
    <Rise delay={10}>
      <div style={{ textAlign: "center", fontSize: 34, marginTop: 20, color: C.muted }}>
        Already in production where failure is not an option.
      </div>
    </Rise>
    <div style={{ display: "flex", marginTop: 100 }}>
      <Counter to={50} suffix="+" label="Clients" delay={25} />
      <Counter to={2} suffix="M+" label="Users" delay={35} />
      <Counter to={5000} suffix="+" label="Agents" delay={45} />
      <Counter to={1500} suffix="" label="Agentic workflows" delay={55} />
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 100 }}>
      {["Defense", "Public sector", "Finance & insurance", "Fully air-gapped deployments"].map(
        (t, i) => (
          <Pop key={t} delay={110 + i * 8}>
            <div
              style={{
                background: i === 3 ? C.plum : "#fff",
                color: i === 3 ? "#fff" : C.plum,
                border: `3px solid ${C.plum}`,
                borderRadius: 999,
                padding: "12px 32px",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {t}
            </div>
          </Pop>
        ),
      )}
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 9. Customer stories                                                 */
/* ------------------------------------------------------------------ */
const Story: React.FC<{
  sector: string;
  name: string;
  quote: string;
  stats: [string, string][];
  color: string;
  delay: number;
}> = ({ sector, name, quote, stats, color, delay }) => (
  <Rise delay={delay} distance={70} style={{ flex: 1 }}>
    <div
      style={{
        height: 690,
        background: "#fff",
        borderRadius: 26,
        overflow: "hidden",
        boxShadow: "0 12px 34px rgba(60,30,70,0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ background: color, padding: "26px 34px", color: "#fff" }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4 }}>{sector}</div>
        <div style={{ fontSize: 38, fontWeight: 800, marginTop: 6, lineHeight: 1.1 }}>
          {name}
        </div>
      </div>
      <div
        style={{
          padding: "26px 34px 10px",
          fontSize: 27,
          lineHeight: 1.35,
          color: C.text,
          minHeight: 120,
        }}
      >
        {quote}
      </div>
      <div style={{ padding: "0 34px", flex: 1 }}>
        {stats.map(([big, small], i) => (
          <Rise key={small} delay={delay + 20 + i * 10} distance={20}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                borderTop: `2px solid ${C.line}`,
                padding: "18px 0",
              }}
            >
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 800,
                  color,
                  minWidth: 210,
                  whiteSpace: "nowrap",
                }}
              >
                {big}
              </div>
              <div style={{ fontSize: 26, color: C.muted, lineHeight: 1.2 }}>{small}</div>
            </div>
          </Rise>
        ))}
      </div>
    </div>
  </Rise>
);

export const Stories: React.FC = () => (
  <Slide eyebrow="Customer stories">
    <div style={{ display: "flex", gap: 34, marginTop: 10 }}>
      <Story
        sector="HEALTHCARE"
        name="Maccabi Healthcare Services"
        quote="From one workflow to one of Israel's most advanced enterprise AI deployments."
        color={C.coral}
        delay={5}
        stats={[
          ["30→3", "minutes case handling time"],
          ["90%+", "response accuracy"],
          ["90%+", "communication standardization"],
        ]}
      />
      <Story
        sector="DEFENSE"
        name="Israel Aerospace Industries"
        quote="Built by employees, not by IT. Fully on-premise and air-gapped from day one."
        color={C.plum}
        delay={20}
        stats={[
          ["7,000", "active users"],
          ["1,000+", "employee-created agents"],
          ["40+", "GPUs on-prem"],
        ]}
      />
      <Story
        sector="INSURANCE"
        name="Direct Insurance"
        quote="One POC. Multiple production deployments. A roadmap that keeps growing."
        color={C.orange}
        delay={35}
        stats={[
          ["99%", "conversation success rate"],
          ["95%", "response accuracy"],
          ["26%", "conversion improvement"],
        ]}
      />
    </div>
  </Slide>
);

/* ------------------------------------------------------------------ */
/* 10. Trust                                                           */
/* ------------------------------------------------------------------ */
export const Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const cities = [
    "New York",
    "London",
    "San Francisco",
    "Tel Aviv",
    "Hungary",
    "Bangalore",
    "Singapore",
    "São Paulo",
    "Buenos Aires",
  ];
  const badges: [string, string][] = [
    ["SOC 2", "AICPA compliant"],
    ["ISO 27001", "Certified"],
    ["Listed", "on the Tel Aviv Stock Exchange"],
    ["140+", "AI experts"],
  ];
  return (
    <Slide eyebrow="About" dark>
      <Rise delay={0}>
        <h2 style={{ ...h2, color: "#fff", fontSize: 80, width: 1400, marginTop: 20 }}>
          Built for the environments where{" "}
          <Accent>AI failure is not an option</Accent>
        </h2>
      </Rise>
      <div style={{ display: "flex", gap: 30, marginTop: 80 }}>
        {badges.map(([big, small], i) => (
          <Pop key={big} delay={25 + i * 10} style={{ flex: 1 }}>
            <div
              style={{
                border: `2px solid rgba(227,168,230,0.5)`,
                borderRadius: 22,
                padding: "36px 30px",
                background: "rgba(255,255,255,0.05)",
                height: 230,
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 800, color: C.orange }}>{big}</div>
              <div style={{ fontSize: 28, marginTop: 10, color: "#EADBEC", lineHeight: 1.3 }}>
                {small}
              </div>
            </div>
          </Pop>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "14px 40px",
          marginTop: 80,
          fontSize: 30,
          color: "#EADBEC",
        }}
      >
        {cities.map((c, i) => {
          const o = interpolate(frame, [80 + i * 5, 95 + i * 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={c} style={{ opacity: o, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: C.coral }} />
              {c}
            </div>
          );
        })}
      </div>
    </Slide>
  );
};

/* ------------------------------------------------------------------ */
/* 11. Call to action                                                  */
/* ------------------------------------------------------------------ */
export const Outro: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily, overflow: "hidden" }}>
    <Blob x={960} y={560} size={1100} opacity={0.6} />
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Pop delay={0}>
        <Logo scale={1.5} />
      </Pop>
      <Rise delay={10}>
        <h1 style={{ ...h1, fontSize: 110, color: C.plum, marginTop: 50 }}>
          Ready to scale AI
          <br />
          on <GradientText>your terms</GradientText>?
        </h1>
      </Rise>
      <Rise delay={30}>
        <div
          style={{
            marginTop: 60,
            display: "flex",
            gap: 30,
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              background: C.plum,
              color: "#fff",
              borderRadius: 999,
              padding: "16px 44px",
            }}
          >
            www.jeen.ai
          </div>
          <div
            style={{
              border: `3px solid ${C.plum}`,
              color: C.plum,
              borderRadius: 999,
              padding: "13px 44px",
              background: "#fff",
            }}
          >
            info@jeen.ai
          </div>
        </div>
      </Rise>
    </AbsoluteFill>
  </AbsoluteFill>
);
