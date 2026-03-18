import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { api } from "../lib/api";

interface AdminLoginProps { onLogin: () => void; }

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(password);
      localStorage.setItem("admin_token", token);
      onLogin();
    } catch {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "24px", position: "relative", zIndex: 1,
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)",
      }} />

      <GlassCard hoverLift={false} style={{ width: "100%", maxWidth: "400px", padding: "48px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(79,70,229,0.4))",
            border: "1px solid rgba(167,139,250,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px", fontSize: "1.5rem",
            boxShadow: "0 0 24px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}>🔐</div>
          <h1 style={{
            fontSize: "1.7rem", fontWeight: 800, margin: "0 0 8px",
            background: "linear-gradient(135deg, #f5f3ff, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Admin Panel</h1>
          <p style={{ color: "rgba(196,181,253,0.5)", fontSize: "0.85rem", margin: 0 }}>Authenticate to manage your site</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", color: "rgba(167,139,250,0.7)", fontSize: "0.72rem", fontWeight: 700, marginBottom: 7, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{
                  width: "100%", padding: "12px 44px 12px 15px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(124,58,237,0.3)", borderRadius: "11px",
                  color: "#ede9fe", fontSize: "0.92rem",
                  backdropFilter: "blur(10px)", outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(167,139,250,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.3)"; e.target.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(167,139,250,0.5)", fontSize: "0.8rem", padding: 0,
              }}>
                {showPw ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: "10px 14px",
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)",
              borderRadius: "9px", color: "#fca5a5", fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 7,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: "13px",
              background: loading || !password
                ? "rgba(124,58,237,0.25)"
                : "linear-gradient(135deg, rgba(124,58,237,0.85), rgba(79,70,229,0.85))",
              color: loading || !password ? "rgba(196,181,253,0.4)" : "#f0ebff",
              border: "1px solid rgba(124,58,237,0.45)", borderRadius: "11px",
              fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em",
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "all 0.25s ease", backdropFilter: "blur(10px)",
              marginTop: "4px",
              boxShadow: loading || !password ? "none" : "0 0 20px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              textTransform: "uppercase",
            }}
            onMouseEnter={e => { if (!loading && password) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a href="/" style={{ color: "rgba(167,139,250,0.35)", textDecoration: "none", fontSize: "0.78rem", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(167,139,250,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(167,139,250,0.35)")}
          >
            ← Return to site
          </a>
        </div>
      </GlassCard>
    </div>
  );
}
