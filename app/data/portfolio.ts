import type {
  HabitDay,
  HabitSummary,
  ProjectCard,
  SceneObjectConfig,
} from "@/app/types/portfolio";

const ORBIT_THIRD = (Math.PI * 2) / 3;
const SHARED_ORBIT_RADIUS = 5.7;
const SHARED_ORBIT_SPEED = 0.22;
const SHARED_ORBIT_ANGLES = [0, ORBIT_THIRD, ORBIT_THIRD * 2] as const;

export const sceneObjects: SceneObjectConfig[] = [
  {
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
    contentKey: "about",
  },
  {
    id: "projects",
    label: "Projects",
    type: "computer",
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    baseAngle: SHARED_ORBIT_ANGLES[0],
    verticalOffset: 0,
    accentColor: "#38bdf8",
    emissiveColor: "#7dd3fc",
    outlineScale: 1.09,
    contentKey: "projects",
  },
  {
    id: "blog",
    label: "Blog",
    type: "book",
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    baseAngle: SHARED_ORBIT_ANGLES[1],
    verticalOffset: 0,
    accentColor: "#f97316",
    emissiveColor: "#fdba74",
    outlineScale: 1.08,
    contentKey: "blog",
  },
  {
    id: "habits",
    label: "Habits",
    type: "habit-tracker",
    orbitRadius: SHARED_ORBIT_RADIUS,
    orbitSpeed: SHARED_ORBIT_SPEED,
    baseAngle: SHARED_ORBIT_ANGLES[2],
    verticalOffset: 0,
    accentColor: "#34d399",
    emissiveColor: "#6ee7b7",
    outlineScale: 1.08,
    contentKey: "habits",
  },
];

export const aboutContent = {
  intro:
    "I build playful software, small products, and internet corners that feel like they have a point of view. Right now this is a stylized placeholder version of my portfolio, built as a little orbiting system around the things I spend time on.",
  build:
    "I like shipping apps, prototypes, tools, and experiments that sit somewhere between design, code, and storytelling.",
  interests: [
    "Indie products with strong aesthetics",
    "Creative coding and interactive web experiences",
    "AI-assisted tools that make solo building faster",
    "Writing about systems, habits, and the process of making things",
  ],
  focus:
    "At the moment I'm focused on becoming more technically sharp, publishing more consistently, and turning side projects into something durable.",
};

export const projectCards: ProjectCard[] = [
  {
    title: "Brick Breaker Idle",
    description:
      "A work-in-progress idle game I’m building right now, with a planned release on June 30, 2026.",
    stack: ["Unity", "C#", "Steam"],
    demoImageSrc: "/models/idler.gif",
  },
  {
    title: "ScrollStopper",
    description:
      "An AI tool that automates TikTok and Instagram slideshow videos to help businesses market themselves.",
    stack: ["Next.js", "Supabase", "OpenAI", "Stripe"],
    href: "https://scrollstopperai.com/",
    demoHref: "https://www.youtube.com/watch?v=AHRUUi-nzE8",
  },
  {
    title: "DispatchIQ",
    description:
      "An AI copilot for 911 dispatchers that transcribes calls live, pulls out critical details, and flags missing information. Also includes a fully autonomous 911 dispatcher voice agent and live ai monitoring dashboard.",
    stack: ["Node.js", "TypeScript", "Supabase", "AI"],
    href: "https://devpost.com/software/dispatchiq-usn87o",
    demoHref: "https://www.youtube.com/watch?v=phR1pTLS3JY",
  },
  {
    title: "Multiplayer Tank PvP Game",
    description:
      "A multiplayer tank deathmatch game I built solo in Unity with global lobby creation and joining, plus power-ups, breakable terrain, and leaderboards. It was a good excuse to get deep into networking and game systems.",
    stack: ["C#", "Unity", "Unity Relay", "Netcode"],
    href: "https://wizdro.itch.io/tanks-a-lot",
    demoImageSrc: "/models/wiitanks.gif",
  },
];

function createHabitDays(): HabitDay[] {
  const startDate = new Date("2025-10-27T00:00:00");
  const days: HabitDay[] = [];

  for (let index = 0; index < 18 * 7; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const week = Math.floor(index / 7);
    const day = index % 7;
    const pattern = (week * 5 + day * 3 + (week % 3)) % 9;
    const count = pattern === 0 ? 0 : (pattern % 5) + (day === 2 ? 1 : 0);

    days.push({
      date: date.toISOString().slice(0, 10),
      count: Math.min(count, 4),
    });
  }

  return days;
}

function createHabitSummary(days: HabitDay[]): HabitSummary {
  const totalCompletions = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter((day) => day.count > 0).length;

  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index]?.count === 0) {
      break;
    }
    streak += 1;
  }

  return {
    streak,
    totalCompletions,
    consistency: Math.round((activeDays / days.length) * 100),
  };
}

export const habitDays = createHabitDays();
export const habitSummary = createHabitSummary(habitDays);
