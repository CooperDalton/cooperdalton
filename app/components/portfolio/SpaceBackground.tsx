import { Sparkles, Stars } from "@react-three/drei";

export function SpaceBackground() {
  return (
    <>
      <Stars
        radius={90}
        depth={50}
        count={3200}
        factor={4.8}
        saturation={0}
        speed={0.12}
        fade
      />
      <Stars
        radius={55}
        depth={24}
        count={950}
        factor={2.2}
        saturation={0}
        speed={0.08}
        fade
      />
      <Sparkles
        count={120}
        size={1.8}
        scale={[28, 18, 28]}
        position={[0, 1, 0]}
        color="#ffffff"
        speed={0.08}
        opacity={0.24}
      />
      <Sparkles
        count={40}
        size={2.8}
        scale={[20, 14, 20]}
        position={[0, 2, 0]}
        color="#e2e8f0"
        speed={0.05}
        opacity={0.18}
      />
    </>
  );
}
