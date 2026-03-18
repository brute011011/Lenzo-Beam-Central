import { useEffect, useRef } from "react";

export function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 300;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.15,
      speed: Math.random() * 0.18 + 0.02,
      opacity: Math.random() * 0.65 + 0.25,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.012 + 0.003,
      color: Math.random() > 0.85 ? `rgba(200,180,255,` : Math.random() > 0.7 ? `rgba(160,220,255,` : `rgba(220,235,255,`,
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.9);
      bg.addColorStop(0, "#0a0618");
      bg.addColorStop(0.35, "#060310");
      bg.addColorStop(0.7, "#040110");
      bg.addColorStop(1, "#020008");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const nebs = [
        { x: 0.12, y: 0.2, r: 420, c: "rgba(80,20,140,0.14)" },
        { x: 0.85, y: 0.55, r: 380, c: "rgba(0,60,180,0.10)" },
        { x: 0.45, y: 0.75, r: 300, c: "rgba(40,0,120,0.12)" },
        { x: 0.65, y: 0.15, r: 250, c: "rgba(0,80,200,0.08)" },
        { x: 0.3, y: 0.5, r: 500, c: "rgba(30,0,80,0.08)" },
      ];

      for (const n of nebs) {
        const g = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.r);
        g.addColorStop(0, n.c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        s.y -= s.speed;
        if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        const alpha = s.opacity * (0.5 + 0.5 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${alpha})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}
