import { useState, useEffect, useCallback } from "react";
import { StarCanvas } from "./components/StarCanvas";
import { GlassCard } from "./components/GlassCard";
import { HomePage } from "./pages/HomePage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

function IntroScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "visible" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 80);
    const t2 = setTimeout(() => setPhase("out"), 2500);
    const t3 = setTimeout(() => onDone(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.16) 0%, transparent 70%)",
      }} />
      <div style={{
        opacity: phase === "in" ? 0 : phase === "visible" ? 1 : 0,
        transform: phase === "in" ? "translateY(12px) scale(0.96)" : phase === "visible" ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
        textAlign: "center", userSelect: "none", position: "relative", zIndex: 1,
      }}>
        <GlassCard hoverLift={false} variant="hero" style={{ padding: "30px 52px" }}>
          <h1 style={{
            fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#fff",
            margin: 0,
            background: "linear-gradient(135deg, #ffffff 0%, #ede9fe 40%, #c4b5fd 70%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(167,139,250,0.5))",
          }}>
            Lenzo beam central 👁️💬
          </h1>
        </GlassCard>
      </div>
    </div>
  );
}

function getPage(): "home" | "admin-login" | "admin-dash" {
  return window.location.pathname.includes("/admin") ? "admin-login" : "home";
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [page, setPage] = useState<"home" | "admin-login" | "admin-dash">(getPage);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("admin_token"));

  useEffect(() => {
    if (page === "admin-login" && loggedIn) setPage("admin-dash");
  }, [page, loggedIn]);

  const handleIntroDone = useCallback(() => {
    setShowMain(true);
    setTimeout(() => setShowIntro(false), 200);
  }, []);

  const handleLogin = () => { setLoggedIn(true); setPage("admin-dash"); };
  const handleLogout = () => { setLoggedIn(false); setPage("home"); window.history.pushState({}, "", "/"); };

  const isAdmin = page !== "home";

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#060210" }}>
      <StarCanvas />

      {!isAdmin && showIntro && <IntroScreen onDone={handleIntroDone} />}

      <div style={{
        opacity: isAdmin || showMain ? 1 : 0,
        transition: "opacity 0.9s ease",
        animation: showMain && !isAdmin ? "pageIn 0.9s ease forwards" : "none",
      }}>
        {page === "home" && <HomePage />}
        {page === "admin-login" && <AdminLogin onLogin={handleLogin} />}
        {page === "admin-dash" && <AdminDashboard onLogout={handleLogout} />}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          background: #060210;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        ::selection { background: rgba(124,58,237,0.4); color: #ede9fe; }
        ::placeholder { color: rgba(167,139,250,0.25); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #060210; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input, button, textarea, select {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}
