import { useEffect, useState, useRef } from "react";

const tools = [
  {
    name: "Immortal",
    description: "Advanced protection and immortality system",
    link: "https://immortal.rs/?code=ODgyNDUyMDE0NDc4MDI0NTAzMA==",
  },
  {
    name: "Injerus",
    description: "Powerful injection framework for professionals",
    link: "https://www.logged.tg/auth/lebc",
  },
  {
    name: "Shockify",
    description: "Next-gen shock wave enhancement tool",
    link: "https://shockify.st/?code=ODgyNDUyMDE0NDc4MDI0NTAzMA==",
  },
  {
    name: "Bypasser Roblox",
    description: "Ultimate Roblox bypass solution",
    link: "https://rbxbypasser.com/d/LEB",
  },
  {
    name: "Hyperlink",
    description: "Hyper-speed link management system",
    link: "#",
  },
];

function StarCanvas() {
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

    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.2,
      speed: Math.random() * 0.35 + 0.05,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    const nebula = [
      { x: 0.2, y: 0.3, r: 320, color: "rgba(30,0,120,0.18)" },
      { x: 0.75, y: 0.65, r: 280, color: "rgba(0,40,160,0.16)" },
      { x: 0.5, y: 0.5, r: 400, color: "rgba(0,20,80,0.10)" },
    ];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.8);
      bg.addColorStop(0, "#040e2a");
      bg.addColorStop(0.5, "#020918");
      bg.addColorStop(1, "#000510");
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
        const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,200,255,${alpha})`;
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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function IntroScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "visible" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 50);
    const t2 = setTimeout(() => setPhase("out"), 2300);
    const t3 = setTimeout(() => onDone(), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: phase === "in" ? 0 : phase === "visible" ? 1 : 0,
          transition: phase === "in"
            ? "opacity 0.8s ease"
            : phase === "out"
            ? "opacity 0.9s ease"
            : "opacity 0.8s ease",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: "#fff",
            textShadow:
              "0 0 20px #3b82f6, 0 0 50px #1d4ed8, 0 0 100px #1e40af",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          Lenzo beam central 👁️💬
        </h1>
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: (typeof tools)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(15,30,80,0.82)"
          : "rgba(8,20,60,0.68)",
        border: hovered
          ? "1.5px solid rgba(96,165,250,0.8)"
          : "1.5px solid rgba(59,130,246,0.35)",
        borderRadius: "16px",
        padding: "28px 28px 24px",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: hovered
          ? "0 0 24px 4px rgba(59,130,246,0.45), 0 0 60px 10px rgba(29,78,216,0.2), inset 0 0 30px rgba(59,130,246,0.08)"
          : "0 0 12px 2px rgba(59,130,246,0.18), inset 0 0 20px rgba(59,130,246,0.04)",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: hovered
            ? "linear-gradient(90deg, transparent, #60a5fa, #3b82f6, #60a5fa, transparent)"
            : "linear-gradient(90deg, transparent, rgba(96,165,250,0.3), transparent)",
          transition: "all 0.3s ease",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <h3
          style={{
            color: "#e0f2fe",
            fontSize: "1.25rem",
            fontWeight: 700,
            margin: 0,
            letterSpacing: "0.03em",
            textShadow: "0 0 12px rgba(96,165,250,0.5)",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {tool.name}
        </h3>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#4ade80",
            textShadow: "0 0 8px rgba(74,222,128,0.6)",
            letterSpacing: "0.05em",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 6px #4ade80, 0 0 12px rgba(74,222,128,0.5)",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          Online
        </span>
      </div>

      <p
        style={{
          color: "rgba(147,197,253,0.7)",
          fontSize: "0.875rem",
          margin: "0 0 20px",
          lineHeight: 1.5,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        {tool.description}
      </p>

      <a
        href={tool.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "10px 24px",
          background: hovered
            ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
            : "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          border: "1px solid rgba(96,165,250,0.4)",
          boxShadow: hovered
            ? "0 0 20px rgba(59,130,246,0.5), 0 4px 15px rgba(29,78,216,0.4)"
            : "0 0 10px rgba(59,130,246,0.2)",
          transition: "all 0.3s ease",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          (e.target as HTMLElement).style.transform = "scale(1.05)";
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.transform = "scale(1)";
        }}
      >
        Open Tool
      </a>
    </div>
  );
}

function MainPage() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <header
        style={{
          textAlign: "center",
          padding: "80px 20px 60px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            marginBottom: "16px",
            padding: "4px 18px",
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "999px",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            color: "#93c5fd",
            textTransform: "uppercase",
          }}
        >
          Tool Hub
        </div>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            margin: "0 0 14px",
            letterSpacing: "0.04em",
            background: "linear-gradient(135deg, #e0f2fe 0%, #93c5fd 40%, #60a5fa 70%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 20px rgba(96,165,250,0.4))",
          }}
        >
          Lenzo Beam Central
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(147,197,253,0.75)",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Your gateway to the most powerful tools in the network
        </p>
      </header>

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {tools.map(tool => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </main>

      <section
        style={{
          textAlign: "center",
          padding: "60px 24px 100px",
          borderTop: "1px solid rgba(59,130,246,0.15)",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            background: "rgba(8,20,60,0.6)",
            border: "1.5px solid rgba(59,130,246,0.3)",
            borderRadius: "20px",
            padding: "40px 36px",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "0 0 40px rgba(29,78,216,0.2), inset 0 0 40px rgba(59,130,246,0.05)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💬</div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              margin: "0 0 10px",
              background: "linear-gradient(135deg, #e0f2fe, #93c5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Join Our Discord
          </h2>
          <p
            style={{
              color: "rgba(147,197,253,0.7)",
              margin: "0 0 28px",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            Connect with our community, get support, and stay updated with the latest tools and features.
          </p>
          <a
            href="YOUR_DISCORD_INVITE_LINK"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #5865f2, #4752c4)",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.03em",
              border: "1px solid rgba(88,101,242,0.5)",
              boxShadow: "0 0 20px rgba(88,101,242,0.4), 0 4px 20px rgba(71,82,196,0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-3px) scale(1.03)";
              el.style.boxShadow = "0 0 35px rgba(88,101,242,0.6), 0 8px 25px rgba(71,82,196,0.4)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0) scale(1)";
              el.style.boxShadow = "0 0 20px rgba(88,101,242,0.4), 0 4px 20px rgba(71,82,196,0.3)";
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join Discord
          </a>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #4ade80, 0 0 12px rgba(74,222,128,0.5); }
          50% { opacity: 0.5; box-shadow: 0 0 3px #4ade80, 0 0 6px rgba(74,222,128,0.3); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);

  const handleIntroDone = () => {
    setShowMain(true);
    setTimeout(() => setShowIntro(false), 100);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#000510" }}>
      <StarCanvas />
      {showIntro && <IntroScreen onDone={handleIntroDone} />}
      {showMain && (
        <div
          style={{
            opacity: 1,
            animation: "fadeIn 0.8s ease forwards",
          }}
        >
          <MainPage />
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #000510; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #020918; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.4); border-radius: 3px; }
      `}</style>
    </div>
  );
}
