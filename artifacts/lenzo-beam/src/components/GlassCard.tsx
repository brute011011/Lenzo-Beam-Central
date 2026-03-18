import { useState, useRef, type ReactNode, type CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  hoverLift?: boolean;
}

export function GlassCard({ children, style, hoverLift = true }: GlassCardProps) {
  const [hovered, setHovered] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rippleKey = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--shine-x", `${x}%`);
    cardRef.current.style.setProperty("--shine-y", `${y}%`);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setHovered(true);
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rippleKey.current += 1;
    setRipple({ x, y, key: rippleKey.current });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        borderRadius: "18px",
        overflow: "hidden",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease",
        transform: hoverLift && hovered ? "translateY(-8px) scale(1.015)" : "translateY(0) scale(1)",
        background: hovered
          ? "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(180,210,255,0.10) 40%, rgba(100,160,255,0.08) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(160,200,255,0.07) 40%, rgba(80,130,255,0.05) 100%)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: hovered
          ? "1px solid rgba(160,210,255,0.55)"
          : "1px solid rgba(120,180,255,0.28)",
        boxShadow: hovered
          ? `0 20px 60px rgba(0,40,180,0.30), 0 0 0 1px rgba(180,220,255,0.15) inset, 0 1px 0 rgba(255,255,255,0.35) inset, 0 -1px 0 rgba(0,80,255,0.15) inset`
          : `0 8px 32px rgba(0,20,120,0.25), 0 0 0 1px rgba(120,180,255,0.10) inset, 0 1px 0 rgba(255,255,255,0.20) inset`,
        cursor: "default",
        "--shine-x": "50%",
        "--shine-y": "50%",
        ...style,
      } as CSSProperties}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.00) 60%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: hovered
            ? `radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 30%), rgba(200,230,255,0.22) 0%, transparent 60%)`
            : "none",
          pointerEvents: "none",
          zIndex: 2,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
      {ripple && (
        <div
          key={ripple.key}
          style={{
            position: "absolute",
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            borderRadius: "50%",
            background: "rgba(180,220,255,0.18)",
            transform: "translate(-50%, -50%)",
            animation: "rippleExpand 0.6s ease-out forwards",
            pointerEvents: "none",
            zIndex: 4,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 5 }}>{children}</div>
      <style>{`
        @keyframes rippleExpand {
          from { width: 0; height: 0; opacity: 0.6; }
          to { width: 200px; height: 200px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
