import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

import {
  aboutContent,
  getProjectCard,
  projectCards,
} from "@/app/data/portfolio";
import type {
  PortfolioPanelKey,
  ProjectCard,
} from "@/app/types/portfolio";

interface InfoPanelProps {
  selectedPanel: PortfolioPanelKey | null;
  onClose: () => void;
}

const EMAIL_ADDRESS = "cooper@cooperdalton.com";
const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/CooperDalton",
    eventName: "github_link_clicked",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cooper-dalton/",
    eventName: "linkedin_link_clicked",
  },
] as const;

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

function ProjectMedia({ project }: { project: ProjectCard }) {
  if (project.demoHref) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/88 shadow-[0_18px_64px_rgba(0,0,0,0.28)]">
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
    );
  }

  if (project.demoImageSrc) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/88 shadow-[0_18px_64px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-video">
          <Image
            src={project.demoImageSrc}
            alt={`${project.title} demo`}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 620px, (min-width: 768px) 55vw, 100vw"
            unoptimized
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/68 px-4 text-center text-xs uppercase tracking-[0.22em] text-slate-500">
      Demo media pending
    </div>
  );
}

function renderAboutSection() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
        <div className="space-y-4">
          {aboutContent.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
          Fun Facts
        </h3>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          {aboutContent.funFacts.map((fact) => (
            <li key={fact} className="flex gap-3">
              <span aria-hidden="true" className="text-emerald-300">
                -
              </span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function renderProjectSection(project: ProjectCard) {
  return (
    <article className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <ProjectMedia project={project} />
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-slate-950/72 px-3 py-1 text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm leading-7 text-slate-300">
            {project.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function getPanelHeading(selectedPanel: PortfolioPanelKey | null) {
  if (selectedPanel === "about") {
    return "About Me";
  }

  if (!selectedPanel) {
    return "";
  }

  return getProjectCard(selectedPanel)?.title ?? "";
}

export function InfoPanel({ selectedPanel, onClose }: InfoPanelProps) {
  const [copyMessage, setCopyMessage] = useState("");
  const copyMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (copyMessageTimeoutRef.current) {
        clearTimeout(copyMessageTimeoutRef.current);
      }
    };
  }, []);

  if (!selectedPanel) {
    return null;
  }

  const selectedProject =
    selectedPanel === "about" ? null : getProjectCard(selectedPanel);
  const title = getPanelHeading(selectedPanel);

  async function handleCopyEmail() {
    posthog.capture("email_copy_clicked");
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopyMessage("Email address copied!");
    } catch {
      setCopyMessage("Couldn't copy email");
    }

    if (copyMessageTimeoutRef.current) {
      clearTimeout(copyMessageTimeoutRef.current);
    }

    copyMessageTimeoutRef.current = setTimeout(() => {
      setCopyMessage("");
    }, 1800);
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center p-4 md:items-center md:justify-end md:p-8">
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-panel-title"
        className={`panel-enter pointer-events-auto relative w-full rounded-[2rem] border border-white/12 bg-slate-950/95 p-5 shadow-[0_24px_120px_rgba(0,0,0,0.45)] md:p-6 ${
          selectedProject
            ? "max-w-4xl md:w-[62rem] md:max-w-[62rem]"
            : "max-w-3xl md:w-[52rem] md:max-w-[52rem]"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {selectedProject ? "Project Orbit" : "Orbit Panel"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2
                id="portfolio-panel-title"
                className="text-2xl font-semibold text-white"
              >
                {title}
              </h2>
              {selectedProject?.href ? (
                <a
                  href={selectedProject.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${selectedProject.title}`}
                  className="text-sky-200 transition hover:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
                  onClick={() =>
                    posthog.capture("project_link_clicked", {
                      project_id: selectedProject.id,
                      project_title: selectedProject.title,
                      href: selectedProject.href,
                    })
                  }
                >
                  <ExternalLinkIcon />
                </a>
              ) : null}
              {selectedPanel === "about" ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
                  >
                    Email me
                  </button>
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
                      onClick={() =>
                        posthog.capture(link.eventName, {
                          href: link.href,
                          location: "about_panel",
                        })
                      }
                    >
                      {link.label}
                    </a>
                  ))}
                </>
              ) : null}
              {copyMessage ? (
                <span aria-live="polite" className="text-sm text-emerald-300">
                  {copyMessage}
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-sky-300/60"
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {selectedPanel === "about"
            ? renderAboutSection()
            : selectedProject
              ? renderProjectSection(selectedProject)
              : null}
        </div>
      </aside>
    </div>
  );
}
