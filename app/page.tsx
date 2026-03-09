import GameOverlay from "./components/GameOverlay";

export default function Home() {
  return (
    <div className="w-full min-h-screen relative font-sans selection:bg-cyber-white/30 selection:text-cyber-white bg-black">
      {/* Phaser Game Overlay acts as the entire application */}
      <GameOverlay />
    </div>
  );
}
