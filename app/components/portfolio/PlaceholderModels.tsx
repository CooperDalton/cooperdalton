import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import type { OrbitModelKey } from "@/app/types/portfolio";

interface ModelProps {
  color: string;
  emissive: string;
  outlineScale: number;
  hovered: boolean;
}

interface AssetModelProps extends ModelProps {
  src: string;
  targetSize: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}

interface OrbitModelSpec {
  src: string;
  targetSize: number;
  rotation: [number, number, number];
  position?: [number, number, number];
}

const ORBIT_MODEL_SPECS: Record<OrbitModelKey, OrbitModelSpec> = {
  phone: {
    src: "/models/Phone.glb",
    targetSize: 2.45,
    rotation: [0.2, -0.85, 0.08],
    position: [0, -0.08, 0],
  },
  tank: {
    src: "/models/Tank.glb",
    targetSize: 2.8,
    rotation: [0.12, -0.5, 0],
    position: [0, -0.18, 0],
  },
  headset: {
    src: "/models/Headphones.glb",
    targetSize: 2.65,
    rotation: [4.84, 0.55, 0.16],
    position: [0, -0.02, 0],
  },
  controller: {
    src: "/models/Low Poly Controller.glb",
    targetSize: 2.55,
    rotation: [0.28, -0.7, -0.18],
    position: [0, -0.06, 0],
  },
};

function cloneMaterial(
  material: THREE.Material,
  color: string,
  emissive: string,
  hovered: boolean,
) {
  const nextMaterial = material.clone();

  if ("color" in nextMaterial) {
    (nextMaterial as THREE.MeshStandardMaterial).color = new THREE.Color(color);
  }

  if ("emissive" in nextMaterial) {
    const emissiveMaterial = nextMaterial as THREE.MeshStandardMaterial;
    emissiveMaterial.emissive = new THREE.Color(emissive);
    emissiveMaterial.emissiveIntensity = hovered ? 0.42 : 0.24;
  }

  return nextMaterial;
}

function prepareObject(
  object: THREE.Object3D,
  color: string,
  emissive: string,
  targetSize: number,
  hovered: boolean,
) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) =>
        cloneMaterial(material, color, emissive, hovered),
      );
      return;
    }

    if (child.material) {
      child.material = cloneMaterial(child.material, color, emissive, hovered);
      return;
    }

    child.material = new THREE.MeshToonMaterial({
      color,
      emissive,
      emissiveIntensity: hovered ? 0.42 : 0.24,
    });
  });

  const container = new THREE.Group();
  container.add(object);

  const initialBounds = new THREE.Box3().setFromObject(container);
  const size = initialBounds.getSize(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z);

  if (maxAxis > 0) {
    object.scale.setScalar(targetSize / maxAxis);
  }

  const fittedBounds = new THREE.Box3().setFromObject(container);
  const fittedCenter = fittedBounds.getCenter(new THREE.Vector3());
  object.position.sub(fittedCenter);

  return container;
}

function GlbAssetModel({
  src,
  color,
  emissive,
  targetSize,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  hovered,
}: AssetModelProps) {
  const gltf = useGLTF(src);
  const model = useMemo(() => {
    return prepareObject(gltf.scene.clone(true), color, emissive, targetSize, hovered);
  }, [color, emissive, gltf.scene, hovered, targetSize]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}

function ObjAssetModel({
  src,
  color,
  emissive,
  targetSize,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  hovered,
}: AssetModelProps) {
  const obj = useLoader(OBJLoader, src);
  const model = useMemo(() => {
    return prepareObject(obj.clone(true), color, emissive, targetSize, hovered);
  }, [color, emissive, hovered, obj, targetSize]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}

export function PlanetModel({
  color,
  emissive,
  hovered,
}: ModelProps) {
  return (
    <ObjAssetModel
      src="/models/Brain.obj"
      color={color}
      emissive={emissive}
      targetSize={3.2}
      rotation={[0.08, 0.2, 0]}
      hovered={hovered}
      outlineScale={1}
    />
  );
}

export function ComputerModel({
  color,
  emissive,
  hovered,
}: ModelProps) {
  return (
    <GlbAssetModel
      src="/models/Laptop.glb"
      color={color}
      emissive={emissive}
      targetSize={2.7}
      rotation={[0.18, -0.65, 0]}
      hovered={hovered}
      outlineScale={1}
    />
  );
}

export function ProjectOrbitModel({
  modelKey,
  color,
  emissive,
  hovered,
}: ModelProps & { modelKey: OrbitModelKey }) {
  const spec = ORBIT_MODEL_SPECS[modelKey];

  return (
    <GlbAssetModel
      src={spec.src}
      color={color}
      emissive={emissive}
      targetSize={spec.targetSize}
      rotation={spec.rotation}
      position={spec.position}
      hovered={hovered}
      outlineScale={1}
    />
  );
}

export function BookModel({
  color,
  emissive,
  hovered,
}: ModelProps) {
  return (
    <GlbAssetModel
      src="/models/Book.glb"
      color={color}
      emissive={emissive}
      targetSize={2.35}
      rotation={[0.26, -0.35, -0.16]}
      hovered={hovered}
      outlineScale={1}
    />
  );
}

export function HabitTrackerModel({
  color,
  emissive,
  hovered,
}: ModelProps) {
  return (
    <GlbAssetModel
      src="/models/Dumbell.glb"
      color={color}
      emissive={emissive}
      targetSize={2.55}
      rotation={[0.22, 0.48, -0.25]}
      hovered={hovered}
      outlineScale={1}
    />
  );
}

useGLTF.preload("/models/Laptop.glb");
useGLTF.preload("/models/Book.glb");
useGLTF.preload("/models/Dumbell.glb");
useGLTF.preload("/models/Phone.glb");
useGLTF.preload("/models/Tank.glb");
useGLTF.preload("/models/Headphones.glb");
useGLTF.preload("/models/Low Poly Controller.glb");
