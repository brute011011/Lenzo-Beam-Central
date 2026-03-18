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

    const STAR_COUNT = 260;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.3 + 0.04,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.018 + 0.004,
    }));

    const nebula = [
      { x: 0.15, y: 0.25, r: 360, color: "rgba(20,0,100,0.20)" },
      { x: 0.78, y: 0.7, r: 300, color: "rgba(0,30,140,0.18)" },
      { x: 0.5, y: 0.5, r: 450, color: "rgba(0,15,60,0.12)" },
      { x: 0.35, y: 0.8, r: 200, color: "rgba(0,50,120,0.10)" },
    ];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.9);
      bg.addColorStop(0, "#030b1f");
      bg.addColorStop(0.5, "#020710");
      bg.addColorStop(1, "#010408");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (const n of nebula) {
        const grad = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        s.y -= s.speed;
        if (s.y < -2) {
          s.y = h + 2;
          s.x = Math.random() * w;
        }
        const alpha = s.opacity * (0.55 + 0.45 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,215,255,${alpha})`;
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

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
