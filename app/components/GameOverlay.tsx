"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

export default function GameOverlay() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [game, setGame] = useState<any>(null);

    useEffect(() => {
        // Only import dynamically on client to avoid Next.js SSR issues with Phaser
        let isMounted = true;

        const initGame = async () => {
            try {
                const { createGame } = await import("../../game/PhaserGame");

                if (isMounted && !game && containerRef.current) {
                    const phaserGame = createGame("phaser-container");
                    setGame(phaserGame);
                }
            } catch (err) {
                console.error("Failed to load Phaser game", err);
            }
        };

        initGame();

        return () => {
            isMounted = false;
            if (game) {
                game.destroy(true);
            }
        };
    }, []); // Only run once

    return (
        <div
            id="phaser-container"
            ref={containerRef}
            className="absolute inset-0 z-10"
            style={{
                pointerEvents: 'none' // The container itself shouldn't block clicks
            }}
        />
    );
}
