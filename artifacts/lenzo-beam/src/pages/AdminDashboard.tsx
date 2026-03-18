import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "../components/GlassCard";
import { api, type Tool, type SiteSettings, type ToolStatus } from "../lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(120,180,255,0.28)",
  borderRadius: "9px",
  color: "#e8f4ff",
  fontSize: "0.88rem",
  backdropFilter: "blur(8px)",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(147,197,253,0.75)",
  fontSize: "0.75rem",
  fontWeight: 600,
  marginBottom: 6,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const btnPrimary: React.CSSProperties = {
  padding: "9px 20px",
  background: "linear-gradient(135deg, rgba(30,64,175,0.9), rgba(37,99,235,0.9))",
  color: "#e8f4ff",
  border: "1px solid rgba(96,165,250,0.4)",
  borderRadius: "9px",
  fontSize: "0.82rem",
  fontWeight: 700,
  cursor: "pointer",
  backdropFilter: "blur(8px)",
  transition: "all 0.2s ease",
  letterSpacing: "0.04em",
};

const btnDanger: React.CSSProperties = {
  padding: "8px 14px",
  background: "rgba(239,68,68,0.15)",
  color: "#fca5a5",
  border: "1px solid rgba(239,68,68,0.3)",
  borderRadius: "8px",
  fontSize: "0.78rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

interface ToolRowProps {
  tool: Tool;
  onUpdate: (id: number, data: Partial<Tool>) => void;
  onDelete: (id: number) => void;
}

function ToolRow({ tool, onUpdate, onDelete }: ToolRowProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: tool.name, description: tool.description, link: tool.link, orderNum: tool.orderNum });
  const [status, setStatus] = useState<ToolStatus | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const checkStatus = useCallback(async () => {
    setCheckingStatus(true);
    try {
      const s = await api.checkToolStatus(tool.id);
      setStatus(s);
    } catch {
      setStatus(null);
    } finally {
      setCheckingStatus(false);
    }
  }, [tool.id]);

  useEffect(() => { checkStatus(); }, [checkStatus]);

  const save = async () => {
    await onUpdate(tool.id, form);
    setEditing(false);
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(120,180,255,0.18)",
      borderRadius: "12px",
      padding: "18px 20px",
      marginBottom: "10px",
    }}>
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
            </div>
            <div>
              <label style={labelStyle}>Order</label>
              <input type="number" style={inputStyle} value={form.orderNum} onChange={e => setForm(f => ({ ...f, orderNum: parseInt(e.target.value) || 0 }))}
                onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <input style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
              onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
          </div>
          <div>
            <label style={labelStyle}>URL Link</label>
            <input style={inputStyle} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
              onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btnPrimary} onClick={save}>Save Changes</button>
            <button style={{ ...btnDanger, background: "rgba(100,120,180,0.15)", color: "rgba(147,197,253,0.7)", border: "1px solid rgba(120,180,255,0.25)" }} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ color: "#e8f4ff", fontWeight: 700, fontSize: "0.95rem" }}>{tool.name}</span>
              <span style={{
                padding: "2px 8px", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
                background: tool.isActive ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)",
                color: tool.isActive ? "#4ade80" : "#f87171",
                border: `1px solid ${tool.isActive ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}>
                {tool.isActive ? "Active" : "Hidden"}
              </span>
              {status !== null && (
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: status.online ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: status.online ? "#4ade80" : "#f87171", display: "inline-block" }} />
                  {status.online ? `Online ${status.responseTime ? `(${status.responseTime}ms)` : ""}` : "Offline"}
                </span>
              )}
              {checkingStatus && <span style={{ fontSize: "0.68rem", color: "rgba(147,197,253,0.5)" }}>Checking...</span>}
            </div>
            <div style={{ color: "rgba(147,197,253,0.55)", fontSize: "0.78rem" }}>{tool.description}</div>
            <div style={{ color: "rgba(96,165,250,0.5)", fontSize: "0.72rem", marginTop: 3, fontFamily: "monospace" }}>{tool.link}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button
              style={{ ...btnPrimary, padding: "7px 14px", fontSize: "0.78rem" }}
              onClick={checkStatus}
              title="Refresh status"
            >
              ↻ Status
            </button>
            <button
              style={{ ...btnPrimary, padding: "7px 14px", fontSize: "0.78rem" }}
              onClick={() => onUpdate(tool.id, { isActive: !tool.isActive })}
            >
              {tool.isActive ? "Hide" : "Show"}
            </button>
            <button
              style={{ ...btnPrimary, padding: "7px 14px", fontSize: "0.78rem" }}
              onClick={() => setEditing(true)}
            >
              ✏ Edit
            </button>
            <button style={btnDanger} onClick={() => {
              if (confirm(`Delete "${tool.name}"?`)) onDelete(tool.id);
            }}>
              🗑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: "Lenzo Beam Central",
    siteSubtitle: "Your gateway to the most powerful tools in the network",
    discordLink: "",
    discordButtonText: "Join Discord",
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", link: "", orderNum: 0 });
  const [adding, setAdding] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"tools" | "settings">("tools");

  const loadTools = useCallback(async () => {
    try {
      const t = await api.listTools();
      setTools(t);
    } catch {}
  }, []);

  useEffect(() => {
    loadTools();
    api.getSettings().then(setSettings).catch(() => {});
  }, [loadTools]);

  const handleUpdateTool = async (id: number, data: Partial<Tool>) => {
    try {
      await api.updateTool(id, data);
      await loadTools();
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const handleDeleteTool = async (id: number) => {
    try {
      await api.deleteTool(id);
      await loadTools();
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.link) return;
    setAddingLoading(true);
    try {
      await api.createTool(addForm);
      setAddForm({ name: "", description: "", link: "", orderNum: 0 });
      setAdding(false);
      await loadTools();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setAddingLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    localStorage.removeItem("admin_token");
    onLogout();
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 22px",
    background: active ? "rgba(37,99,235,0.4)" : "transparent",
    color: active ? "#e8f4ff" : "rgba(147,197,253,0.55)",
    border: "1px solid",
    borderColor: active ? "rgba(96,165,250,0.4)" : "transparent",
    borderRadius: "9px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.04em",
  });

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", color: "#fff", padding: "32px 24px 80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{
              fontSize: "2rem", fontWeight: 800, margin: "0 0 6px",
              background: "linear-gradient(135deg, #f0f9ff, #93c5fd)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "rgba(147,197,253,0.5)", fontSize: "0.85rem", margin: 0 }}>
              Manage tools, links, and site settings
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/" style={{ padding: "8px 18px", background: "rgba(255,255,255,0.06)", color: "rgba(147,197,253,0.7)", border: "1px solid rgba(120,180,255,0.2)", borderRadius: "9px", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600 }}>
              ← View Site
            </a>
            <button style={{ ...btnDanger, fontSize: "0.82rem", padding: "8px 18px" }} onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button style={tabStyle(activeTab === "tools")} onClick={() => setActiveTab("tools")}>🔧 Tools</button>
          <button style={tabStyle(activeTab === "settings")} onClick={() => setActiveTab("settings")}>⚙️ Settings</button>
        </div>

        {activeTab === "tools" && (
          <GlassCard hoverLift={false} style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ color: "#bae6fd", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                Tools ({tools.length})
              </h2>
              <button style={btnPrimary} onClick={() => setAdding(!adding)}>
                {adding ? "✕ Cancel" : "+ Add Tool"}
              </button>
            </div>

            {adding && (
              <form onSubmit={handleAddTool} style={{
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(96,165,250,0.25)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: 16,
              }}>
                <div style={{ fontWeight: 700, color: "#93c5fd", marginBottom: 14, fontSize: "0.88rem" }}>New Tool</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input required style={inputStyle} placeholder="e.g. Immortal" value={addForm.name}
                      onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
                  </div>
                  <div>
                    <label style={labelStyle}>Order</label>
                    <input type="number" style={inputStyle} placeholder="0" value={addForm.orderNum}
                      onChange={e => setAddForm(f => ({ ...f, orderNum: parseInt(e.target.value) || 0 }))}
                      onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Description</label>
                  <input style={inputStyle} placeholder="Short description..." value={addForm.description}
                    onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>URL Link *</label>
                  <input required style={inputStyle} placeholder="https://..." value={addForm.link}
                    onChange={e => setAddForm(f => ({ ...f, link: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
                </div>
                <button type="submit" style={btnPrimary} disabled={addingLoading}>
                  {addingLoading ? "Adding..." : "Add Tool"}
                </button>
              </form>
            )}

            {tools.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(147,197,253,0.4)", fontSize: "0.9rem" }}>
                No tools yet. Add your first tool above.
              </div>
            ) : (
              tools.map(tool => (
                <ToolRow key={tool.id} tool={tool} onUpdate={handleUpdateTool} onDelete={handleDeleteTool} />
              ))
            )}
          </GlassCard>
        )}

        {activeTab === "settings" && (
          <GlassCard hoverLift={false} style={{ padding: "28px" }}>
            <h2 style={{ color: "#bae6fd", fontSize: "1.1rem", fontWeight: 700, margin: "0 0 24px" }}>
              Site Settings
            </h2>
            <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={labelStyle}>Site Title</label>
                <input style={inputStyle} value={settings.siteTitle}
                  onChange={e => setSettings(s => ({ ...s, siteTitle: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
              </div>
              <div>
                <label style={labelStyle}>Site Subtitle</label>
                <input style={inputStyle} value={settings.siteSubtitle}
                  onChange={e => setSettings(s => ({ ...s, siteSubtitle: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
              </div>
              <div>
                <label style={labelStyle}>Discord Invite Link</label>
                <input style={inputStyle} placeholder="https://discord.gg/..." value={settings.discordLink}
                  onChange={e => setSettings(s => ({ ...s, discordLink: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
              </div>
              <div>
                <label style={labelStyle}>Discord Button Text</label>
                <input style={inputStyle} value={settings.discordButtonText}
                  onChange={e => setSettings(s => ({ ...s, discordButtonText: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "rgba(96,165,250,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(120,180,255,0.28)")} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                <button type="submit" style={{ ...btnPrimary, padding: "12px 28px", fontSize: "0.9rem" }}>
                  Save Settings
                </button>
                {settingsSaved && (
                  <span style={{ color: "#4ade80", fontSize: "0.85rem", fontWeight: 600 }}>
                    ✓ Saved successfully!
                  </span>
                )}
              </div>
            </form>

            <div style={{
              marginTop: 32,
              padding: "18px 20px",
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "12px",
            }}>
              <div style={{ color: "#fca5a5", fontSize: "0.85rem", fontWeight: 700, marginBottom: 8 }}>🔒 Security</div>
              <p style={{ color: "rgba(252,165,165,0.7)", fontSize: "0.82rem", margin: "0 0 12px", lineHeight: 1.6 }}>
                The admin password is stored as the <code style={{ background: "rgba(239,68,68,0.15)", padding: "1px 6px", borderRadius: 4 }}>ADMIN_PASSWORD</code> environment variable.
                Change it in the Replit Secrets panel to update it.
              </p>
              <p style={{ color: "rgba(252,165,165,0.5)", fontSize: "0.78rem", margin: 0 }}>
                Default password (if not set): <code style={{ background: "rgba(239,68,68,0.15)", padding: "1px 6px", borderRadius: 4 }}>admin123</code>
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
