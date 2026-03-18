import { useState, useEffect } from "react";
import { StarCanvas } from "./components/StarCanvas";
import { HomePage } from "./pages/HomePage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

function IntroScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "visible" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 80);
    const t2 = setTimeout(() => setPhase("out"), 2400);
    const t3 = setTimeout(() => onDone(), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "transparent", pointerEvents: "none",
    }}>
      <div style={{
        opacity: phase === "in" ? 0 : phase === "visible" ? 1 : 0,
        transition: "opacity 0.9s ease",
        textAlign: "center", userSelect: "none",
      }}>
        <div style={{
          padding: "28px 48px",
          background: "linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(140,200,255,0.09) 50%, rgba(60,120,255,0.06) 100%)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          borderRadius: "20px",
          border: "1px solid rgba(160,210,255,0.4)",
          boxShadow: "0 20px 60px rgba(0,30,160,0.3), 0 0 0 1px rgba(200,230,255,0.12) inset, 0 1px 0 rgba(255,255,255,0.3) inset",
        }}>
          <h1 style={{
            fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "0.03em",
            color: "#fff",
            textShadow: "0 0 20px rgba(96,165,250,0.6), 0 0 60px rgba(59,130,246,0.4)",
            margin: 0,
          }}>
            Lenzo beam central 👁️💬
          </h1>
        </div>
      </div>
    </div>
  );
}

function getPage(): "home" | "admin-login" | "admin-dash" {
  const path = window.location.pathname;
  if (path.includes("/admin")) return "admin-login";
  return "home";
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [page, setPage] = useState<"home" | "admin-login" | "admin-dash">(getPage);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("admin_token"));

  useEffect(() => {
    if (page === "admin-login" && isLoggedIn) {
      setPage("admin-dash");
    }
  }, [page, isLoggedIn]);

  const handleIntroDone = () => {
    setShowMain(true);
    setTimeout(() => setShowIntro(false), 200);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage("admin-dash");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("home");
    window.history.pushState({}, "", "/");
  };

  const isAdminPage = page === "admin-login" || page === "admin-dash";

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#020b1c" }}>
      <StarCanvas />

      {!isAdminPage && showIntro && <IntroScreen onDone={handleIntroDone} />}

      <div style={{ opacity: isAdminPage || showMain ? 1 : 0, transition: "opacity 0.8s ease", animation: showMain && !isAdminPage ? "pageFadeIn 0.8s ease forwards" : "none" }}>
        {page === "home" && <HomePage />}
        {page === "admin-login" && <AdminLogin onLogin={handleLogin} />}
        {page === "admin-dash" && <AdminDashboard onLogout={handleLogout} />}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          background: #020b1c;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::placeholder { color: rgba(147,197,253,0.3); }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #010610; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.35); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.55); }

        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        input, button, textarea {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}
