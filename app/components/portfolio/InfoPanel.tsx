import Image from "next/image";
import Link from "next/link";

import { HabitHeatmap } from "@/app/components/portfolio/HabitHeatmap";
import {
  aboutContent,
  habitDays,
  habitSummary,
  projectCards,
} from "@/app/data/portfolio";
import type { BlogPost, SectionKey } from "@/app/types/portfolio";

interface InfoPanelProps {
  selectedSection: SectionKey | null;
  onClose: () => void;
  blogPosts: BlogPost[];
}

function getYouTubeEmbedUrl(url: string) {
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/,
  )?.[1];

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v5h-14v-14h5" />
    </svg>
  );
}

function renderSection(selectedSection: SectionKey, blogPosts: BlogPost[]) {
  switch (selectedSection) {
    case "about":
      return (
        <div className="space-y-6">
          <div>
            <p className="text-sm leading-7 text-slate-300">
              {aboutContent.intro}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
                What I build
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {aboutContent.build}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
                Right now
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {aboutContent.focus}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
              Interests
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {aboutContent.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-white/12 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    case "projects":
      return (
        <div className="grid gap-4">
          {projectCards.map((project) => (
            <article
              key={project.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="md:w-[15rem] md:flex-none">
                  {project.demoHref ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                      <div className="aspect-video">
                        <iframe
                          src={getYouTubeEmbedUrl(project.demoHref) ?? undefined}
                          title={`${project.title} demo video`}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : project.demoImageSrc ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                      <div className="relative aspect-video">
                        <Image
                          src={project.demoImageSrc}
                          alt={`${project.title} demo`}
                          fill
                          className="object-cover"
                          sizes="240px"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 text-center text-xs uppercase tracking-[0.22em] text-slate-500">
                      Demo video pending
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {project.title}
                    </h3>
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title}`}
                        className="text-sky-200 transition hover:text-sky-100"
                      >
                        <ExternalLinkIcon />
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      );
    case "blog":
      return (
        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              href={`/blog/${post.slug}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/7 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {post.date}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {post.summary}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-amber-200">
                Read article
              </p>
            </Link>
          ))}
        </div>
      );
    case "habits":
      return (
        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-300">
            A placeholder habit snapshot inspired by contribution graphs, tuned
            here for consistency instead of commits.
          </p>
          <HabitHeatmap days={habitDays} summary={habitSummary} />
        </div>
      );
    default:
      return null;
  }
}

function getPanelHeading(selectedSection: SectionKey | null) {
  switch (selectedSection) {
    case "about":
      return "About Me";
    case "projects":
      return "Projects";
    case "blog":
      return "Blog";
    case "habits":
      return "Habits";
    default:
      return "";
  }
}

export function InfoPanel({
  selectedSection,
  onClose,
  blogPosts,
}: InfoPanelProps) {
  if (!selectedSection) {
    return null;
  }

  const title = getPanelHeading(selectedSection);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center p-4 md:items-center md:justify-end md:p-8">
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-panel-title"
        className="panel-enter pointer-events-auto relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/86 p-5 shadow-[0_24px_120px_rgba(0,0,0,0.45)] md:w-[52rem] md:max-w-[52rem] md:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Orbit panel
            </p>
            <h2
              id="portfolio-panel-title"
              className="mt-2 text-2xl font-semibold text-white"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {renderSection(selectedSection, blogPosts)}
        </div>
      </aside>
    </div>
  );
}
