import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const OBJECT_PLANE_Y = 0;
const RING_PLANE_Y = -2.2;

export function OrbitRing({ radius }: { radius: number }) {
  const { camera } = useThree();
  const ringRef = useRef<THREE.Group>(null);
  const objectCenter = useRef(new THREE.Vector3());
  const objectEdge = useRef(new THREE.Vector3());
  const ringCenter = useRef(new THREE.Vector3());
  const ringEdge = useRef(new THREE.Vector3());

  useFrame(() => {
    const ring = ringRef.current;
    const parent = ring?.parent;

    if (!ring || !parent) {
      return;
    }

    const objectCenterPoint = parent.localToWorld(
      objectCenter.current.set(0, OBJECT_PLANE_Y, 0),
    );
    const objectEdgePoint = parent.localToWorld(
      objectEdge.current.set(1, OBJECT_PLANE_Y, 0),
    );
    const ringCenterPoint = parent.localToWorld(
      ringCenter.current.set(0, RING_PLANE_Y, 0),
    );
    const ringEdgePoint = parent.localToWorld(
      ringEdge.current.set(1, RING_PLANE_Y, 0),
    );

    const objectScreenRadius = objectEdgePoint
      .clone()
      .project(camera)
      .distanceTo(objectCenterPoint.clone().project(camera));
    const ringScreenRadius = ringEdgePoint
      .clone()
      .project(camera)
      .distanceTo(ringCenterPoint.clone().project(camera));

    if (ringScreenRadius > 0) {
      const scale = objectScreenRadius / ringScreenRadius;
      ring.scale.set(scale, 1, scale);
    }
  });

  return (
    <group ref={ringRef} position={[0, RING_PLANE_Y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.08, 18, 120]} />
        <meshBasicMaterial color="#ffffff" opacity={0.24} transparent />
      </mesh>
    </group>
  );
}
