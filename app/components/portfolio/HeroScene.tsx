import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { CenterPlanet } from "@/app/components/portfolio/CenterPlanet";
import { OrbitRing } from "@/app/components/portfolio/OrbitRing";
import { OrbitingObject } from "@/app/components/portfolio/OrbitingObject";
import { SpaceBackground } from "@/app/components/portfolio/SpaceBackground";
import { sceneObjects } from "@/app/data/portfolio";
import type { PortfolioPanelKey } from "@/app/types/portfolio";

interface HeroSceneProps {
  animationPaused: boolean;
  selectedPanel: PortfolioPanelKey | null;
  hoveredPanel: PortfolioPanelKey | null;
  onHoverChange: (panel: PortfolioPanelKey | null) => void;
  onClearSelection: () => void;
  onSelect: (panel: PortfolioPanelKey) => void;
}

function SceneContents({
  animationPaused,
  selectedPanel,
  hoveredPanel,
  onHoverChange,
  onSelect,
}: HeroSceneProps) {
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 20, 0.01));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const objectPositions = useRef(new Map<PortfolioPanelKey, THREE.Vector3>());

  const updateObjectPosition = (
    panel: PortfolioPanelKey,
    x: number,
    y: number,
    z: number,
  ) => {
    const nextPosition =
      objectPositions.current.get(panel) ?? new THREE.Vector3();
    nextPosition.set(x, y, z);
    objectPositions.current.set(panel, nextPosition);
  };

  useFrame((_state, delta) => {
    if (selectedPanel) {
      const focusedObjectPosition =
        objectPositions.current.get(selectedPanel) ?? new THREE.Vector3();

      cameraTarget.current.set(
        focusedObjectPosition.x + 0.25,
        5.8,
        focusedObjectPosition.z + 9.25,
      );
      lookAtTarget.current.lerp(
        new THREE.Vector3(
          focusedObjectPosition.x + 3.1,
          focusedObjectPosition.y + 0.15,
          focusedObjectPosition.z,
        ),
        1 - Math.exp(-delta * 4.2),
      );
    } else {
      cameraTarget.current.set(0, 20, 0.01);
      lookAtTarget.current.lerp(
        new THREE.Vector3(0, 0, 0),
        1 - Math.exp(-delta * 3),
      );
    }

    camera.position.lerp(
      cameraTarget.current,
      1 - Math.exp(-delta * (selectedPanel ? 4 : 2.5)),
    );
    camera.lookAt(lookAtTarget.current);
  });

  const centerPlanet = sceneObjects.find((item) => item.id === "about");
  const orbitingItems = sceneObjects.filter((item) => item.id !== "about");
  const sharedOrbitRadius = orbitingItems[0]?.orbitRadius;

  return (
    <>
      <SpaceBackground />
      <ambientLight intensity={0.95} color="#cbd5ff" />
      <directionalLight
        position={[8, 10, 6]}
        intensity={2.2}
        color="#fef3c7"
      />
      <pointLight position={[-8, 4, -8]} intensity={20} color="#60a5fa" />
      <group position={[0, -0.2, 0]}>
        {sharedOrbitRadius ? <OrbitRing radius={sharedOrbitRadius} /> : null}
        {centerPlanet ? (
          <CenterPlanet
            config={centerPlanet}
            hovered={hoveredPanel === centerPlanet.id}
            selected={selectedPanel === centerPlanet.id}
            onPositionUpdate={updateObjectPosition}
            onHoverChange={onHoverChange}
            onSelect={onSelect}
          />
        ) : null}
        {orbitingItems.map((item) => (
          <OrbitingObject
            key={item.id}
            config={item}
            hovered={hoveredPanel === item.id}
            selected={selectedPanel === item.id}
            paused={animationPaused}
            onPositionUpdate={updateObjectPosition}
            onHoverChange={onHoverChange}
            onSelect={onSelect}
          />
        ))}
      </group>
    </>
  );
}

export function HeroScene(props: HeroSceneProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ fov: 40, position: [0, 20, 0.01] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => {
          props.onClearSelection();
        }}
      >
        <SceneContents {...props} />
      </Canvas>
    </div>
  );
}
