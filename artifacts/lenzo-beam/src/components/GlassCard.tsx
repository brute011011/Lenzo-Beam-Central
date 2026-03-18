import { useState, useRef, useCallback, type ReactNode, type CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
  hoverLift?: boolean;
  variant?: "default" | "tool" | "hero";
}

export function GlassCard({ children, style, hoverLift = true, variant = "default" }: GlassCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++idRef.current;
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(r2 => r2.id !== id)), 800);
  }, []);

  const isToolCard = variant === "tool";
  const isHero = variant === "hero";

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{
        position: "relative",
        borderRadius: isHero ? "28px" : "20px",
        overflow: "hidden",
        isolation: "isolate",
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
        transform: hoverLift && hovered
          ? isToolCard ? "translateY(-10px) scale(1.02)" : "translateY(-5px)"
          : "translateY(0) scale(1)",

        background: hovered
          ? "linear-gradient(145deg, rgba(255,255,255,0.16) 0%, rgba(180,200,255,0.09) 40%, rgba(100,80,220,0.06) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(150,170,255,0.055) 50%, rgba(80,60,180,0.04) 100%)",

        backdropFilter: "blur(32px) saturate(200%) brightness(1.05)",
        WebkitBackdropFilter: "blur(32px) saturate(200%) brightness(1.05)",

        border: "1px solid",
        borderColor: hovered
          ? "rgba(180,160,255,0.50)"
          : "rgba(140,120,220,0.22)",

        boxShadow: hovered
          ? `0 24px 80px -8px rgba(80,40,200,0.35),
             0 0 0 1px rgba(200,180,255,0.12) inset,
             0 2px 0 rgba(255,255,255,0.22) inset,
             0 -1px 0 rgba(100,60,200,0.18) inset,
             0 0 40px -10px rgba(120,80,255,0.25)`
          : `0 8px 40px -8px rgba(40,20,120,0.30),
             0 0 0 1px rgba(140,120,220,0.08) inset,
             0 1px 0 rgba(255,255,255,0.14) inset`,
        cursor: "default",
        ...style,
      }}
    >
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0) 100%)",
      }} />

      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", zIndex: 2, pointerEvents: "none",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
        background: `radial-gradient(ellipse 70% 50% at ${mousePos.x}% ${mousePos.y}%, rgba(200,180,255,0.18) 0%, rgba(140,120,255,0.06) 50%, transparent 70%)`,
      }} />

      <div style={{
        position: "absolute", top: 0, left: "5%", right: "5%", height: "1px", zIndex: 3, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 30%, rgba(200,180,255,0.7) 50%, rgba(255,255,255,0.55) 70%, transparent 100%)",
        opacity: hovered ? 1 : 0.6,
        transition: "opacity 0.3s ease",
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", zIndex: 3, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(120,80,255,0.25), transparent)",
      }} />

      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: "1px", zIndex: 3, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(255,255,255,0.3), rgba(140,120,220,0.1), transparent)",
      }} />

      {hovered && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "inherit", zIndex: 2, pointerEvents: "none",
          background: `conic-gradient(from ${mousePos.x * 3.6}deg at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(180,140,255,0.04) 20%, transparent 40%)`,
          transition: "background 0.2s ease",
        }} />
      )}

      {ripples.map(r => (
        <div key={r.id} style={{
          position: "absolute",
          left: r.x, top: r.y,
          width: 0, height: 0,
          borderRadius: "50%",
          background: "rgba(200,180,255,0.20)",
          transform: "translate(-50%, -50%)",
          animation: "glassRipple 0.8s ease-out forwards",
          pointerEvents: "none", zIndex: 4,
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 5 }}>{children}</div>

      <style>{`
        @keyframes glassRipple {
          from { width: 0; height: 0; opacity: 0.7; }
          to { width: 300px; height: 300px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
