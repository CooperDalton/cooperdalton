export type SectionKey = "about" | "projects" | "blog" | "habits";

export type SceneObjectType = "planet" | "computer" | "book" | "habit-tracker";

export interface SceneObjectConfig {
  id: SectionKey;
  label: string;
  type: SceneObjectType;
  orbitRadius: number;
  orbitSpeed: number;
  baseAngle: number;
  verticalOffset: number;
  accentColor: string;
  emissiveColor: string;
  outlineScale: number;
  contentKey: SectionKey;
}

export interface ProjectCard {
  title: string;
  description: string;
  stack: string[];
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
