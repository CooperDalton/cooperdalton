import type {
  OrbitModelKey,
  ProjectCard,
  ProjectKey,
  SceneObjectConfig,
} from "@/app/types/portfolio";

const ORBIT_QUARTER = (Math.PI * 2) / 4;
const SHARED_ORBIT_RADIUS = 5.35;
const SHARED_ORBIT_SPEED = 0.16;
const SHARED_ORBIT_ANGLES = [
  -Math.PI / 6,
  -Math.PI / 6 + ORBIT_QUARTER,
  -Math.PI / 6 + ORBIT_QUARTER * 2,
  -Math.PI / 6 + ORBIT_QUARTER * 3,
] as const;
const PROJECT_MODEL_KEYS: Record<ProjectKey, OrbitModelKey> = {
  "brick-breaker-idle": "controller",
  scrollstopper: "phone",
  dispatchiq: "headset",
  "multiplayer-tanks": "tank",
};

export const aboutSceneObject: SceneObjectConfig = {
  id: "about",
  label: "About Me",
  type: "planet",
  orbitRadius: 0,
  orbitSpeed: 0,
  baseAngle: 0,
  verticalOffset: 0,
  accentColor: "#ec4899",
  emissiveColor: "#f9a8d4",
  outlineScale: 1.08,
};

export const aboutContent = {
  paragraphs: [
    "I'm currently studying Computer Science at UCSB. I'm interested in game development and entrepreneurship.",
    "Right now, I'm working on two main projects: a coin-scanning mobile app, and an idle game I'm planning to release on Steam.",
    "Before this, I built a multiplayer Unity game, along with an AI-powered slideshow generator for TikTok and Instagram that helps businesses create short-form content.",
    "I've been into building for a while. I started by making Minecraft mods when I was 10, and since then I've just kept going, trying ideas, shipping projects, and figuring things out as I go.",
  ],
  funFacts: [
    "I rock climb and play badminton",
    "I baked a cake with a blowtorch (it did not go well)",
    "I read 30 books last year",
    "I once 3D modeled my bedroom to figure out how I could fit a new dresser in my room",
  ],
};

export const projectCards: ProjectCard[] = [
  {
    id: "brick-breaker-idle",
    orbitLabel: "Brick Breaker Idle",
    title: "Brick Breaker Idle",
    category: "Game Development",
    status: "In Progress",
    description:
      "A work-in-progress idle game I’m building right now, with a planned release on June 30, 2026.",
    stack: ["Unity", "C#", "Steam"],
    accentColor: "#60a5fa",
    emissiveColor: "#93c5fd",
    demoImageSrc: "/models/idler.gif",
  },
  {
    id: "scrollstopper",
    orbitLabel: "ScrollStopper",
    title: "ScrollStopper",
    category: "SaaS Product",
    status: "Live Product",
    description:
      "An AI tool that automates TikTok and Instagram slideshow videos to help businesses market themselves. ",
    stack: ["Next.js", "Supabase", "OpenAI", "Stripe"],
    accentColor: "#fb7185",
    emissiveColor: "#fda4af",
    href: "https://scrollstopperai.com/",
    demoHref: "https://www.youtube.com/watch?v=AHRUUi-nzE8",
  },
  {
    id: "dispatchiq",
    orbitLabel: "DispatchIQ",
    title: "DispatchIQ",
    category: "AI Systems",
    status: "Prototype",
    description:
      "An AI copilot for 911 dispatchers that transcribes calls live, pulls out critical details, and flags missing information. Also includes a fully autonomous 911 dispatcher voice agent and live ai monitoring dashboard.",
    stack: ["Node.js", "TypeScript", "Supabase", "AI"],
    accentColor: "#34d399",
    emissiveColor: "#6ee7b7",
    href: "https://devpost.com/software/dispatchiq-usn87o",
    demoHref: "https://www.youtube.com/watch?v=phR1pTLS3JY",
  },
  {
    id: "multiplayer-tanks",
    orbitLabel: "Tanks A Lot",
    title: "Multiplayer Tank PvP Game",
    category: "Multiplayer Game",
    status: "Playable Demo",
    description:
      "A multiplayer tank deathmatch game I built solo in Unity with global lobby creation and joining, plus power-ups, breakable terrain, and leaderboards. It was a good excuse to get deep into networking and game systems.",
    stack: ["C#", "Unity", "Unity Relay", "Netcode"],
    accentColor: "#f59e0b",
    emissiveColor: "#fcd34d",
    href: "https://wizdro.itch.io/tanks-a-lot",
    demoImageSrc: "/models/wiitanks.gif",
  },
];

export const sceneObjects: SceneObjectConfig[] = [
  aboutSceneObject,
  ...projectCards.map((project, index) => ({
    id: project.id,
    label: project.orbitLabel,
    type: "computer" as const,
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    baseAngle: SHARED_ORBIT_ANGLES[index] ?? 0,
    verticalOffset: 0,
    accentColor: project.accentColor,
    emissiveColor: project.emissiveColor,
    outlineScale: 1.09,
    orbitModelKey: PROJECT_MODEL_KEYS[project.id],
  })),
];

export function getProjectCard(projectId: ProjectKey) {
  return projectCards.find((project) => project.id === projectId) ?? null;
}
