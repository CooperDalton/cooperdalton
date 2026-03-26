import * as THREE from "three";

interface OutlinedBoxProps {
  size: [number, number, number];
  color: string;
  outlineScale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  emissive?: string;
  hovered?: boolean;
}

interface OutlinedSphereProps {
  radius: number;
  color: string;
  outlineScale?: number;
  position?: [number, number, number];
  emissive?: string;
  hovered?: boolean;
}

export function OutlinedBox({
  size,
  color,
  outlineScale = 1.08,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  emissive = color,
  hovered = false,
}: OutlinedBoxProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={outlineScale}>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#06070d" side={THREE.BackSide} />
      </mesh>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshToonMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 0.55 : 0.2}
        />
      </mesh>
    </group>
  );
}

export function OutlinedSphere({
  radius,
  color,
  outlineScale = 1.08,
  position = [0, 0, 0],
  emissive = color,
  hovered = false,
}: OutlinedSphereProps) {
  return (
    <group position={position}>
      <mesh scale={outlineScale}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial color="#06070d" side={THREE.BackSide} />
      </mesh>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshToonMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 0.55 : 0.18}
        />
      </mesh>
    </group>
  );
}
