import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { api } from "../lib/api";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(password);
      localStorage.setItem("admin_token", token);
      onLogin();
    } catch {
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", position: "relative", zIndex: 1 }}>
      <GlassCard style={{ width: "100%", maxWidth: "420px", padding: "48px 40px" }} hoverLift={false}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>🔐</div>
          <h1 style={{
            fontSize: "1.8rem", fontWeight: 800, margin: "0 0 8px",
            background: "linear-gradient(135deg, #f0f9ff, #93c5fd)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Admin Panel
          </h1>
          <p style={{ color: "rgba(147,197,253,0.6)", fontSize: "0.9rem", margin: 0 }}>
            Enter your password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "rgba(147,197,253,0.8)", fontSize: "0.82rem", fontWeight: 600, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(120,180,255,0.3)",
                borderRadius: "10px",
                color: "#e8f4ff",
                fontSize: "0.95rem",
                backdropFilter: "blur(8px)",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.7)")}
              onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.3)")}
            />
          </div>

          {error && (
            <div style={{
              padding: "10px 14px",
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              color: "#fca5a5",
              fontSize: "0.85rem",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: "13px",
              background: loading || !password
                ? "rgba(37,99,235,0.4)"
                : "linear-gradient(135deg, rgba(30,64,175,0.9), rgba(37,99,235,0.9))",
              color: "#e8f4ff",
              border: "1px solid rgba(96,165,250,0.4)",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              backdropFilter: "blur(8px)",
              letterSpacing: "0.04em",
              boxShadow: "0 0 16px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
              marginTop: "4px",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "rgba(147,197,253,0.35)", fontSize: "0.78rem" }}>
          <a href="/" style={{ color: "rgba(147,197,253,0.35)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(147,197,253,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(147,197,253,0.35)")}
          >
            ← Back to home
          </a>
        </p>
      </GlassCard>
    </div>
  );
}
