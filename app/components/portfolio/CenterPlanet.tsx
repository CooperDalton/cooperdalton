import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { HoverLabel } from "@/app/components/portfolio/HoverLabel";
import { PlanetModel } from "@/app/components/portfolio/PlaceholderModels";
import type { SceneObjectConfig, SectionKey } from "@/app/types/portfolio";

interface CenterPlanetProps {
  config: SceneObjectConfig;
  hovered: boolean;
  selected: boolean;
  onPositionUpdate: (
    section: SectionKey,
    x: number,
    y: number,
    z: number,
  ) => void;
  onHoverChange: (section: SectionKey | null) => void;
  onSelect: (section: SectionKey) => void;
}

export function CenterPlanet({
  config,
  hovered,
  selected,
  onPositionUpdate,
  onHoverChange,
  onSelect,
}: CenterPlanetProps) {
  const modelRef = useRef<THREE.Group>(null);

  useCursor(hovered);

  useFrame((_state, delta) => {
    if (!modelRef.current) {
      return;
    }

    onPositionUpdate(config.id, 0, 0, 0);

    const targetScale = selected ? 1.28 : hovered ? 1.06 : 1;
    modelRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      1 - Math.exp(-delta * 10),
    );

    modelRef.current.rotation.y += delta * 0.22;
  });

  return (
    <group>
      <group ref={modelRef}>
        <PlanetModel
          color={config.accentColor}
          emissive={config.emissiveColor}
          outlineScale={config.outlineScale}
          hovered={hovered || selected}
        />
      </group>
      <HoverLabel
        label={config.label}
        visible={hovered && !selected}
        yOffset={2.55}
      />
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverChange(config.id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverChange(null);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(config.contentKey);
        }}
      >
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshBasicMaterial transparent opacity={0.01} depthWrite={false} />
      </mesh>
    </group>
  );
}
