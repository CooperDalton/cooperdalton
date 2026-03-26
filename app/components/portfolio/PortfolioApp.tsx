"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";

import { HeroScene } from "@/app/components/portfolio/HeroScene";
import { InfoPanel } from "@/app/components/portfolio/InfoPanel";
import type { BlogPost, SectionKey } from "@/app/types/portfolio";

interface PortfolioAppProps {
  blogPosts: BlogPost[];
}

export function PortfolioApp({ blogPosts }: PortfolioAppProps) {
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>(null);
  const [hoveredSection, setHoveredSection] = useState<SectionKey | null>(null);
  const animationPaused = hoveredSection !== null || selectedSection !== null;
  const openSection = (section: SectionKey) => {
    startTransition(() => {
      setHoveredSection(null);
      setSelectedSection(section);
    });
  };

  const closePanel = () => {
    startTransition(() => {
      setSelectedSection(null);
    });
  };

  const handleEscape = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <HeroScene
        animationPaused={animationPaused}
        selectedSection={selectedSection}
        hoveredSection={hoveredSection}
        onHoverChange={setHoveredSection}
        onClearSelection={closePanel}
        onSelect={openSection}
      />

      <InfoPanel
        selectedSection={selectedSection}
        onClose={closePanel}
        blogPosts={blogPosts}
      />
    </main>
  );
}
