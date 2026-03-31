"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";

import { HeroScene } from "@/app/components/portfolio/HeroScene";
import { InfoPanel } from "@/app/components/portfolio/InfoPanel";
import type { PortfolioPanelKey } from "@/app/types/portfolio";

export function PortfolioApp() {
  const [selectedPanel, setSelectedPanel] = useState<PortfolioPanelKey | null>(
    null,
  );
  const [hoveredPanel, setHoveredPanel] = useState<PortfolioPanelKey | null>(
    null,
  );
  const animationPaused = hoveredPanel !== null || selectedPanel !== null;

  const openPanel = (panel: PortfolioPanelKey) => {
    startTransition(() => {
      setHoveredPanel(null);
      setSelectedPanel(panel);
    });
  };

  const closePanel = () => {
    startTransition(() => {
      setSelectedPanel(null);
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
        selectedPanel={selectedPanel}
        hoveredPanel={hoveredPanel}
        onHoverChange={setHoveredPanel}
        onClearSelection={closePanel}
        onSelect={openPanel}
      />

      <InfoPanel selectedPanel={selectedPanel} onClose={closePanel} />
    </main>
  );
}
