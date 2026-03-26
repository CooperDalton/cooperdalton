import { Html } from "@react-three/drei";

interface HoverLabelProps {
  label: string;
  visible: boolean;
  yOffset?: number;
}

export function HoverLabel({
  label,
  visible,
  yOffset = 1.9,
}: HoverLabelProps) {
  if (!visible) {
    return null;
  }

  return (
    <Html
      position={[0, yOffset, 0]}
      center
      distanceFactor={10}
      className="pointer-events-none"
    >
      <div className="whitespace-nowrap rounded-full border border-white/15 bg-slate-950/80 px-4 py-1.5 text-sm font-medium uppercase tracking-[0.24em] text-slate-100 shadow-[0_0_24px_rgba(56,189,248,0.18)] backdrop-blur">
        {label}
      </div>
    </Html>
  );
}
