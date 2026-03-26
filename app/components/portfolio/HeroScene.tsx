import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { CenterPlanet } from "@/app/components/portfolio/CenterPlanet";
import { OrbitRing } from "@/app/components/portfolio/OrbitRing";
import { OrbitingObject } from "@/app/components/portfolio/OrbitingObject";
import { SpaceBackground } from "@/app/components/portfolio/SpaceBackground";
import { sceneObjects } from "@/app/data/portfolio";
import type { SectionKey } from "@/app/types/portfolio";

interface HeroSceneProps {
  animationPaused: boolean;
  selectedSection: SectionKey | null;
  hoveredSection: SectionKey | null;
  onHoverChange: (section: SectionKey | null) => void;
  onClearSelection: () => void;
  onSelect: (section: SectionKey) => void;
}

function SceneContents({
  animationPaused,
  selectedSection,
  hoveredSection,
  onHoverChange,
  onSelect,
}: HeroSceneProps) {
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 20, 0.01));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const objectPositions = useRef<Record<SectionKey, THREE.Vector3>>({
    about: new THREE.Vector3(0, 0, 0),
    projects: new THREE.Vector3(0, 0, 0),
    blog: new THREE.Vector3(0, 0, 0),
    habits: new THREE.Vector3(0, 0, 0),
  });

  const updateObjectPosition = (
    section: SectionKey,
    x: number,
    y: number,
    z: number,
  ) => {
    objectPositions.current[section].set(x, y, z);
  };

  useFrame((_state, delta) => {
    if (selectedSection) {
      const focusedObjectPosition = objectPositions.current[selectedSection];

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
      1 - Math.exp(-delta * (selectedSection ? 4 : 2.5)),
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
            hovered={hoveredSection === centerPlanet.id}
            selected={selectedSection === centerPlanet.id}
            onPositionUpdate={updateObjectPosition}
            onHoverChange={onHoverChange}
            onSelect={onSelect}
          />
        ) : null}
        {orbitingItems.map((item) => (
          <OrbitingObject
            key={item.id}
            config={item}
            hovered={hoveredSection === item.id}
            selected={selectedSection === item.id}
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
