export type ProjectKey =
  | "brick-breaker-idle"
  | "scrollstopper"
  | "dispatchiq"
  | "multiplayer-tanks";

export type PortfolioPanelKey = "about" | ProjectKey;

export type SceneObjectType = "planet" | "computer";

export interface SceneObjectConfig {
  id: PortfolioPanelKey;
  label: string;
  type: SceneObjectType;
  orbitRadius: number;
  orbitSpeed: number;
  baseAngle: number;
  verticalOffset: number;
  accentColor: string;
  emissiveColor: string;
  outlineScale: number;
}

export interface ProjectCard {
  id: ProjectKey;
  orbitLabel: string;
  title: string;
  category: string;
  status: string;
  description: string;
  stack: string[];
  accentColor: string;
  emissiveColor: string;
  href?: string;
  demoHref?: string;
  demoImageSrc?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
}

export interface HabitDay {
  date: string;
  count: number;
}

export interface HabitSummary {
  streak: number;
  totalCompletions: number;
  consistency: number;
}
