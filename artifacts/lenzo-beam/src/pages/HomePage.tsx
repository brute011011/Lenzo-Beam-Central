import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "../components/GlassCard";
import { api, type Tool, type SiteSettings, type ToolStatus } from "../lib/api";

function StatusDot({ toolId }: { toolId: number }) {
  const [status, setStatus] = useState<ToolStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    try {
      setLoading(true);
      const s = await api.checkToolStatus(toolId);
      setStatus(s);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    check();
    const t = setInterval(check, 60000);
    return () => clearInterval(t);
  }, [check]);

  if (loading) {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: "rgba(147,197,253,0.6)", letterSpacing: "0.06em" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(147,197,253,0.4)", display: "inline-block" }} />
        Checking...
      </span>
    );
  }

  const online = status?.online ?? false;
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 600, color: online ? "#4ade80" : "#f87171", letterSpacing: "0.06em" }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: online ? "#4ade80" : "#f87171",
        boxShadow: online ? "0 0 6px #4ade80, 0 0 14px rgba(74,222,128,0.5)" : "0 0 6px #f87171",
        display: "inline-block",
        animation: online ? "pulseDot 2s infinite" : "none",
      }} />
      {online ? "Online" : "Offline"}
    </span>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <GlassCard style={{ padding: "28px 26px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <h3 style={{ color: "#e8f4ff", fontSize: "1.2rem", fontWeight: 700, margin: 0, letterSpacing: "0.02em", textShadow: "0 0 16px rgba(120,180,255,0.6)" }}>
          {tool.name}
        </h3>
        <StatusDot toolId={tool.id} />
      </div>
      <p style={{ color: "rgba(160,210,255,0.65)", fontSize: "0.875rem", margin: "0 0 22px", lineHeight: 1.55 }}>
        {tool.description}
      </p>
      <a
        href={tool.link === "#" ? undefined : tool.link}
        target={tool.link === "#" ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={e => tool.link === "#" && e.preventDefault()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 22px",
          background: "linear-gradient(135deg, rgba(30,64,175,0.85), rgba(37,99,235,0.85))",
          color: "#e8f4ff",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          border: "1px solid rgba(120,180,255,0.35)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 12px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          transition: "all 0.25s ease",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "linear-gradient(135deg, rgba(37,99,235,0.95), rgba(59,130,246,0.95))";
          el.style.boxShadow = "0 0 22px rgba(59,130,246,0.55), inset 0 1px 0 rgba(255,255,255,0.2)";
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "linear-gradient(135deg, rgba(30,64,175,0.85), rgba(37,99,235,0.85))";
          el.style.boxShadow = "0 0 12px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)";
          el.style.transform = "translateY(0)";
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Open Tool
      </a>
    </GlassCard>
  );
}

export function HomePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: "Lenzo Beam Central",
    siteSubtitle: "Your gateway to the most powerful tools in the network",
    discordLink: "#",
    discordButtonText: "Join Discord",
  });

  useEffect(() => {
    api.listTools().then(t => setTools(t.filter(x => x.isActive))).catch(() => {});
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", color: "#fff" }}>
      <header style={{ textAlign: "center", padding: "90px 20px 64px" }}>
        <div style={{
          display: "inline-block",
          marginBottom: "18px",
          padding: "4px 20px",
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(96,165,250,0.28)",
          borderRadius: "999px",
          fontSize: "0.75rem",
          letterSpacing: "0.14em",
          color: "#93c5fd",
          textTransform: "uppercase",
          backdropFilter: "blur(10px)",
        }}>
          ⚡ Tool Hub
        </div>
        <h1 style={{
          fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
          fontWeight: 800,
          margin: "0 0 14px",
          letterSpacing: "-0.01em",
          background: "linear-gradient(135deg, #f0f9ff 0%, #bae6fd 35%, #93c5fd 60%, #60a5fa 85%, #3b82f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 30px rgba(96,165,250,0.35))",
        }}>
          {settings.siteTitle}
        </h1>
        <p style={{ fontSize: "1.05rem", color: "rgba(147,197,253,0.72)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
          {settings.siteSubtitle}
        </p>
      </header>

      <main style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "22px" }}>
          {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </main>

      <section style={{ textAlign: "center", padding: "50px 24px 100px", borderTop: "1px solid rgba(59,130,246,0.12)" }}>
        <GlassCard style={{ maxWidth: "520px", margin: "0 auto", padding: "42px 38px" }} hoverLift={false}>
          <div style={{ fontSize: "2.8rem", marginBottom: "12px" }}>💬</div>
          <h2 style={{
            fontSize: "1.9rem", fontWeight: 800, margin: "0 0 10px",
            background: "linear-gradient(135deg, #f0f9ff, #93c5fd)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Join Our Community
          </h2>
          <p style={{ color: "rgba(147,197,253,0.7)", margin: "0 0 28px", fontSize: "0.95rem", lineHeight: 1.65 }}>
            Connect with our community, get support, and stay updated with the latest tools.
          </p>
          <a
            href={settings.discordLink !== "YOUR_DISCORD_INVITE_LINK" ? settings.discordLink : undefined}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "13px 32px",
              background: "linear-gradient(135deg, rgba(88,101,242,0.85), rgba(71,82,196,0.85))",
              color: "#fff", borderRadius: "11px", textDecoration: "none",
              fontSize: "0.98rem", fontWeight: 700, letterSpacing: "0.03em",
              border: "1px solid rgba(120,130,255,0.4)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 24px rgba(88,101,242,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-3px)";
              el.style.boxShadow = "0 0 40px rgba(88,101,242,0.65), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 0 24px rgba(88,101,242,0.4), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            {settings.discordButtonText}
          </a>
        </GlassCard>
      </section>

      <footer style={{ textAlign: "center", padding: "20px 24px 40px", color: "rgba(147,197,253,0.35)", fontSize: "0.8rem" }}>
        <a href="/admin" style={{ color: "rgba(147,197,253,0.25)", textDecoration: "none", fontSize: "0.75rem", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(147,197,253,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(147,197,253,0.25)")}
        >
          Admin Panel
        </a>
      </footer>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
