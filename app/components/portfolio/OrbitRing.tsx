export function OrbitRing({ radius }: { radius: number }) {
  return (
    <group position={[0, -0.04, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.08, 18, 120]} />
        <meshBasicMaterial color="#ffffff" opacity={0.24} transparent />
      </mesh>
    </group>
  );
}
