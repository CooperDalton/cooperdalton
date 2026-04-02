import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { HoverLabel } from "@/app/components/portfolio/HoverLabel";
import { ProjectOrbitModel } from "@/app/components/portfolio/PlaceholderModels";
import type {
  PortfolioPanelKey,
  SceneObjectConfig,
} from "@/app/types/portfolio";

interface OrbitingObjectProps {
  config: SceneObjectConfig;
  hovered: boolean;
  selected: boolean;
  paused: boolean;
  onPositionUpdate: (
    panel: PortfolioPanelKey,
    x: number,
    y: number,
    z: number,
  ) => void;
  onHoverChange: (panel: PortfolioPanelKey | null) => void;
  onSelect: (panel: PortfolioPanelKey) => void;
}

export function OrbitingObject({
  config,
  hovered,
  selected,
  paused,
  onPositionUpdate,
  onHoverChange,
  onSelect,
}: OrbitingObjectProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const angleRef = useRef(config.baseAngle);

  useCursor(hovered);

  useFrame((_state, delta) => {
    if (!orbitRef.current || !modelRef.current) {
      return;
    }

    if (!paused) {
      angleRef.current += delta * config.orbitSpeed;
    }

    modelRef.current.rotation.y += delta * 0.45;

    const angle = angleRef.current;
    const x = Math.cos(angle) * config.orbitRadius;
    const z = Math.sin(angle) * config.orbitRadius;
    orbitRef.current.position.set(x, config.verticalOffset, z);
    onPositionUpdate(config.id, x, config.verticalOffset, z);

    const targetScale = selected ? 1.34 : hovered ? 1.12 : 1;
    modelRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      1 - Math.exp(-delta * 12),
    );
  });

  return (
    <group ref={orbitRef}>
      <group ref={modelRef}>
        {config.orbitModelKey ? (
          <ProjectOrbitModel
            modelKey={config.orbitModelKey}
            color={config.accentColor}
            emissive={config.emissiveColor}
            outlineScale={config.outlineScale}
            hovered={hovered || selected}
          />
        ) : null}
      </group>
      <HoverLabel label={config.label} visible={hovered && !selected} />
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
          onSelect(config.id);
        }}
      >
        <sphereGeometry args={[1.45, 16, 16]} />
        <meshBasicMaterial transparent opacity={0.01} depthWrite={false} />
      </mesh>
    </group>
  );
}
