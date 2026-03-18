import { useState, useEffect, useCallback, useRef } from "react";
import { GlassCard } from "../components/GlassCard";
import { api, type Tool, type SiteSettings } from "../lib/api";

function Navbar({ siteTitle }: { siteTitle: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: "0 24px",
      height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(6,2,16,0.80)" : "transparent",
      backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      borderBottom: scrolled ? "1px solid rgba(120,80,220,0.18)" : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "8px",
          background: "linear-gradient(135deg, #7c3aed, #4f46e5, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", boxShadow: "0 0 14px rgba(124,58,237,0.6)",
        }}>⚡</div>
        <span style={{
          fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em",
          background: "linear-gradient(90deg, #e0e7ff, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {siteTitle}
        </span>
      </div>
      <a href="/admin" style={{
        padding: "6px 16px",
        background: "rgba(124,58,237,0.15)",
        border: "1px solid rgba(124,58,237,0.35)",
        borderRadius: "999px",
        color: "rgba(196,181,253,0.8)",
        fontSize: "0.75rem", fontWeight: 600, textDecoration: "none", letterSpacing: "0.05em",
        transition: "all 0.2s ease",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.28)"; e.currentTarget.style.borderColor = "rgba(196,181,253,0.5)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
      >
        Admin
      </a>
    </nav>
  );
}

function LiveStatus({ toolId }: { toolId: number }) {
  const [online, setOnline] = useState<boolean | null>(null);
  const [ms, setMs] = useState<number | undefined>();

  const check = useCallback(async () => {
    try {
      const s = await api.checkToolStatus(toolId);
      setOnline(s.online);
      setMs(s.responseTime);
    } catch { setOnline(false); }
  }, [toolId]);

  useEffect(() => { check(); const t = setInterval(check, 90000); return () => clearInterval(t); }, [check]);

  if (online === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(148,163,184,0.4)", animation: "pingDot 1.5s ease infinite" }} />
        <span style={{ fontSize: "0.7rem", color: "rgba(148,163,184,0.6)", letterSpacing: "0.04em" }}>—</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: online ? "#34d399" : "#f87171",
        boxShadow: online ? "0 0 0 3px rgba(52,211,153,0.2), 0 0 8px rgba(52,211,153,0.6)" : "0 0 0 3px rgba(248,113,113,0.2)",
        animation: online ? "pingDot 2s ease infinite" : "none",
      }} />
      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: online ? "#6ee7b7" : "#fca5a5", letterSpacing: "0.04em" }}>
        {online ? `Online${ms ? ` · ${ms}ms` : ""}` : "Offline"}
      </span>
    </div>
  );
}

const TOOL_ICONS: Record<string, string> = {
  "Immortal": "♾️",
  "Injerus": "💉",
  "Shockify": "⚡",
  "Bypasser Roblox": "🎮",
  "Hyperlink": "🔗",
};

function getIcon(name: string) {
  return TOOL_ICONS[name] || "🔧";
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={{ animation: `slideUp 0.5s ease ${index * 0.08}s both` }}>
      <GlassCard variant="tool" style={{ padding: "26px 24px 22px", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.3))",
            border: "1px solid rgba(167,139,250,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.3rem",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 20px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}>
            {getIcon(tool.name)}
          </div>
          <LiveStatus toolId={tool.id} />
        </div>

        <h3 style={{
          color: "#ede9fe",
          fontSize: "1.05rem", fontWeight: 700, margin: "0 0 7px",
          letterSpacing: "0.01em",
          textShadow: "0 0 20px rgba(167,139,250,0.3)",
        }}>
          {tool.name}
        </h3>
        <p style={{ color: "rgba(196,181,253,0.55)", fontSize: "0.83rem", margin: "0 0 auto", lineHeight: 1.6, paddingBottom: 18 }}>
          {tool.description}
        </p>

        <a
          href={tool.link !== "#" ? tool.link : undefined}
          target={tool.link !== "#" ? "_blank" : undefined}
          rel="noopener noreferrer"
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "10px 0",
            background: btnHover
              ? "linear-gradient(135deg, rgba(124,58,237,0.75), rgba(79,70,229,0.75))"
              : "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(79,70,229,0.3))",
            color: btnHover ? "#f0ebff" : "#c4b5fd",
            borderRadius: "11px",
            textDecoration: "none",
            fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.05em",
            border: `1px solid ${btnHover ? "rgba(167,139,250,0.6)" : "rgba(124,58,237,0.35)"}`,
            backdropFilter: "blur(8px)",
            boxShadow: btnHover
              ? "0 0 20px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.12)"
              : "inset 0 1px 0 rgba(255,255,255,0.06)",
            transition: "all 0.25s ease",
            textTransform: "uppercase",
            width: "100%",
            cursor: "pointer",
          }}
        >
          Launch
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </GlassCard>
    </div>
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
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.listTools().then(t => setTools(t.filter(x => x.isActive))).catch(() => {});
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      <Navbar siteTitle={settings.siteTitle} />

      <div ref={heroRef} style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "100px 24px 60px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.10) 0%, transparent 70%)",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 18px",
          background: "rgba(124,58,237,0.14)",
          border: "1px solid rgba(124,58,237,0.35)",
          borderRadius: "999px",
          marginBottom: "24px",
          backdropFilter: "blur(12px)",
          animation: "fadeSlideDown 0.7s ease both",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 6px #7c3aed", animation: "pingDot 2s ease infinite" }} />
          <span style={{ color: "#a78bfa", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Lenzo Beam Network
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(2.6rem, 6vw, 5rem)",
          fontWeight: 900,
          margin: "0 0 18px",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          background: "linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 25%, #a78bfa 55%, #7c3aed 80%, #4f46e5 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 40px rgba(124,58,237,0.35))",
          animation: "fadeSlideDown 0.7s ease 0.1s both",
        }}>
          {settings.siteTitle}
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.15rem)",
          color: "rgba(196,181,253,0.65)",
          maxWidth: "520px",
          lineHeight: 1.7,
          margin: "0 0 48px",
          fontWeight: 400,
          animation: "fadeSlideDown 0.7s ease 0.2s both",
        }}>
          {settings.siteSubtitle}
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "18px",
          width: "100%",
          maxWidth: "1160px",
        }}>
          {tools.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
        </div>
      </div>

      <section style={{
        padding: "0 24px 100px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{
          width: "100%", maxWidth: "600px",
          borderTop: "1px solid rgba(124,58,237,0.18)",
          paddingTop: "70px",
          textAlign: "center",
        }}>
          <GlassCard hoverLift={false} style={{ padding: "48px 40px" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "16px",
              background: "linear-gradient(135deg, #5865f2, #4752c4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 30px rgba(88,101,242,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
            </div>
            <h2 style={{
              fontSize: "1.7rem", fontWeight: 800, margin: "0 0 10px",
              background: "linear-gradient(135deg, #f5f3ff, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Join Our Community
            </h2>
            <p style={{ color: "rgba(196,181,253,0.6)", margin: "0 0 28px", fontSize: "0.92rem", lineHeight: 1.65 }}>
              Get support, stay updated, and connect with other users in our Discord server.
            </p>
            <a
              href={settings.discordLink !== "YOUR_DISCORD_INVITE_LINK" ? settings.discordLink : undefined}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "13px 36px",
                background: "linear-gradient(135deg, #5865f2, #4752c4)",
                color: "#fff", borderRadius: "12px", textDecoration: "none",
                fontSize: "0.92rem", fontWeight: 700, letterSpacing: "0.04em",
                border: "1px solid rgba(120,130,255,0.5)",
                boxShadow: "0 0 30px rgba(88,101,242,0.45), 0 4px 20px rgba(71,82,196,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 0 50px rgba(88,101,242,0.65), 0 8px 30px rgba(71,82,196,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 0 30px rgba(88,101,242,0.45), 0 4px 20px rgba(71,82,196,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
            >
              {settings.discordButtonText}
            </a>
          </GlassCard>
        </div>
      </section>

      <style>{`
        @keyframes pingDot { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
