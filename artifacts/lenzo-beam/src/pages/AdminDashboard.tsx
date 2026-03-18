import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "../components/GlassCard";
import { api, type Tool, type SiteSettings, type ToolStatus } from "../lib/api";

const F: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(124,58,237,0.25)", borderRadius: "10px",
  color: "#ede9fe", fontSize: "0.86rem", backdropFilter: "blur(8px)",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
};
const L: React.CSSProperties = { display: "block", color: "rgba(167,139,250,0.65)", fontSize: "0.7rem", fontWeight: 700, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" };
const BP: React.CSSProperties = { padding: "9px 18px", background: "linear-gradient(135deg,rgba(124,58,237,0.65),rgba(79,70,229,0.6))", color: "#ede9fe", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "9px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease", letterSpacing: "0.04em", backdropFilter: "blur(8px)" };
const BD: React.CSSProperties = { padding: "8px 14px", background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.28)", borderRadius: "9px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" };

function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "rgba(167,139,250,0.65)";
  e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
}
function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "rgba(124,58,237,0.25)";
  e.target.style.boxShadow = "none";
}

function StatusPill({ online, ms, checking }: { online: boolean | null; ms?: number; checking: boolean }) {
  if (checking) return <span style={{ fontSize: "0.7rem", color: "rgba(167,139,250,0.45)", padding: "3px 9px", borderRadius: "999px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>Checking…</span>;
  if (online === null) return null;
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em",
      padding: "3px 10px", borderRadius: "999px",
      background: online ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.10)",
      color: online ? "#6ee7b7" : "#fca5a5",
      border: `1px solid ${online ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.25)"}`,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: online ? "#34d399" : "#f87171", display: "inline-block", boxShadow: online ? "0 0 5px #34d399" : "none" }} />
      {online ? `Online${ms ? ` · ${ms}ms` : ""}` : "Offline"}
    </span>
  );
}

function ToolRow({ tool, onUpdate, onDelete }: { tool: Tool; onUpdate: (id: number, data: Partial<Tool>) => void; onDelete: (id: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: tool.name, description: tool.description, link: tool.link, orderNum: tool.orderNum });
  const [status, setStatus] = useState<ToolStatus | null>(null);
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try { const s = await api.checkToolStatus(tool.id); setStatus(s); } catch { setStatus(null); } finally { setChecking(false); }
  }, [tool.id]);

  useEffect(() => { check(); }, [check]);

  const save = async () => { await onUpdate(tool.id, form); setEditing(false); };

  return (
    <div style={{
      background: "rgba(124,58,237,0.06)",
      border: "1px solid rgba(124,58,237,0.16)",
      borderRadius: "13px", padding: editing ? "18px" : "14px 18px",
      marginBottom: "10px", transition: "all 0.2s ease",
    }}>
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 11 }}>
            <div><label style={L}>Name</label><input style={F} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
            <div><label style={L}>Order</label><input type="number" style={{ ...F, width: 80 }} value={form.orderNum} onChange={e => setForm(f => ({ ...f, orderNum: parseInt(e.target.value) || 0 }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
          </div>
          <div><label style={L}>Description</label><input style={F} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
          <div><label style={L}>URL</label><input style={F} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
          <div style={{ display: "flex", gap: 9, marginTop: 4 }}>
            <button style={BP} onClick={save}>Save</button>
            <button style={{ ...BD, background: "rgba(124,58,237,0.08)", color: "rgba(196,181,253,0.5)", border: "1px solid rgba(124,58,237,0.18)" }} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ color: "#ede9fe", fontWeight: 700, fontSize: "0.9rem" }}>{tool.name}</span>
              <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", background: tool.isActive ? "rgba(167,139,250,0.12)" : "rgba(100,116,139,0.12)", color: tool.isActive ? "#a78bfa" : "#64748b", border: `1px solid ${tool.isActive ? "rgba(124,58,237,0.3)" : "rgba(100,116,139,0.2)"}` }}>
                {tool.isActive ? "Visible" : "Hidden"}
              </span>
              <StatusPill online={status?.online ?? null} ms={status?.responseTime} checking={checking} />
            </div>
            <div style={{ color: "rgba(196,181,253,0.45)", fontSize: "0.75rem" }}>{tool.description}</div>
            <div style={{ color: "rgba(124,58,237,0.5)", fontSize: "0.7rem", marginTop: 2, fontFamily: "monospace" }}>{tool.link.substring(0, 50)}{tool.link.length > 50 ? "…" : ""}</div>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center", flexShrink: 0 }}>
            <button style={{ ...BP, padding: "6px 12px", fontSize: "0.73rem" }} onClick={check}>↻</button>
            <button style={{ ...BP, padding: "6px 12px", fontSize: "0.73rem" }} onClick={() => onUpdate(tool.id, { isActive: !tool.isActive })}>
              {tool.isActive ? "Hide" : "Show"}
            </button>
            <button style={{ ...BP, padding: "6px 12px", fontSize: "0.73rem" }} onClick={() => setEditing(true)}>Edit</button>
            <button style={BD} onClick={() => { if (confirm(`Delete "${tool.name}"?`)) onDelete(tool.id); }}>🗑</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ siteTitle: "Lenzo Beam Central", siteSubtitle: "", discordLink: "", discordButtonText: "Join Discord" });
  const [saved, setSaved] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", link: "", orderNum: 0 });
  const [adding, setAdding] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [tab, setTab] = useState<"tools" | "settings">("tools");

  const load = useCallback(async () => { try { setTools(await api.listTools()); } catch {} }, []);
  useEffect(() => { load(); api.getSettings().then(setSettings).catch(() => {}); }, [load]);

  const update = async (id: number, data: Partial<Tool>) => { try { await api.updateTool(id, data); await load(); } catch (e: unknown) { alert((e as Error).message); } };
  const del = async (id: number) => { try { await api.deleteTool(id); await load(); } catch (e: unknown) { alert((e as Error).message); } };
  const add = async (e: React.FormEvent) => {
    e.preventDefault(); if (!addForm.name || !addForm.link) return;
    setAddLoading(true);
    try { await api.createTool(addForm); setAddForm({ name: "", description: "", link: "", orderNum: 0 }); setAdding(false); await load(); }
    catch (e: unknown) { alert((e as Error).message); } finally { setAddLoading(false); }
  };
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.updateSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch (e: unknown) { alert((e as Error).message); }
  };
  const logout = async () => { try { await api.logout(); } catch {} localStorage.removeItem("admin_token"); onLogout(); };

  const Tab = ({ id, label }: { id: "tools" | "settings"; label: string }) => (
    <button onClick={() => setTab(id)} style={{
      padding: "8px 20px", border: "1px solid",
      borderColor: tab === id ? "rgba(124,58,237,0.5)" : "transparent",
      background: tab === id ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)",
      color: tab === id ? "#c4b5fd" : "rgba(196,181,253,0.4)",
      borderRadius: "10px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
      transition: "all 0.2s ease", letterSpacing: "0.04em",
    }}>{label}</button>
  );

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", padding: "0" }}>
      <div style={{
        borderBottom: "1px solid rgba(124,58,237,0.15)",
        backdropFilter: "blur(20px)",
        background: "rgba(6,2,16,0.6)",
        padding: "16px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "9px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", boxShadow: "0 0 14px rgba(124,58,237,0.5)" }}>⚡</div>
          <div>
            <div style={{ color: "#ede9fe", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.02em" }}>Admin Dashboard</div>
            <div style={{ color: "rgba(167,139,250,0.45)", fontSize: "0.68rem", letterSpacing: "0.04em" }}>Lenzo Beam Central</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/" style={{ padding: "7px 16px", background: "rgba(255,255,255,0.05)", color: "rgba(196,181,253,0.6)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "9px", textDecoration: "none", fontSize: "0.78rem", fontWeight: 600, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
            ← Site
          </a>
          <button style={BD} onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <Tab id="tools" label="🔧 Tools" />
          <Tab id="settings" label="⚙️ Settings" />
        </div>

        {tab === "tools" && (
          <GlassCard hoverLift={false} style={{ padding: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ color: "#c4b5fd", fontSize: "1rem", fontWeight: 800, margin: 0, letterSpacing: "0.02em" }}>
                Tools <span style={{ color: "rgba(167,139,250,0.35)", fontWeight: 500, fontSize: "0.85rem" }}>({tools.length})</span>
              </h2>
              <button style={BP} onClick={() => setAdding(!adding)}>{adding ? "✕ Cancel" : "+ Add Tool"}</button>
            </div>

            {adding && (
              <form onSubmit={add} style={{
                background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.22)",
                borderRadius: "13px", padding: "18px", marginBottom: 16,
              }}>
                <div style={{ color: "#a78bfa", fontSize: "0.8rem", fontWeight: 800, marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>New Tool</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 11, marginBottom: 11 }}>
                  <div><label style={L}>Name *</label><input required style={F} placeholder="Tool name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
                  <div><label style={L}>Order</label><input type="number" style={F} value={addForm.orderNum} onChange={e => setAddForm(f => ({ ...f, orderNum: parseInt(e.target.value) || 0 }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
                </div>
                <div style={{ marginBottom: 11 }}><label style={L}>Description</label><input style={F} placeholder="Short description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
                <div style={{ marginBottom: 16 }}><label style={L}>URL *</label><input required style={F} placeholder="https://..." value={addForm.link} onChange={e => setAddForm(f => ({ ...f, link: e.target.value }))} onFocus={focusStyle} onBlur={blurStyle} /></div>
                <button type="submit" style={BP} disabled={addLoading}>{addLoading ? "Adding…" : "Add Tool"}</button>
              </form>
            )}

            {tools.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(167,139,250,0.3)", fontSize: "0.88rem" }}>No tools yet. Add one above.</div>
            ) : tools.map(t => <ToolRow key={t.id} tool={t} onUpdate={update} onDelete={del} />)}
          </GlassCard>
        )}

        {tab === "settings" && (
          <GlassCard hoverLift={false} style={{ padding: "26px" }}>
            <h2 style={{ color: "#c4b5fd", fontSize: "1rem", fontWeight: 800, margin: "0 0 22px", letterSpacing: "0.02em" }}>Site Settings</h2>
            <form onSubmit={saveSettings} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "siteTitle", label: "Site Title" },
                { key: "siteSubtitle", label: "Site Subtitle" },
                { key: "discordLink", label: "Discord Invite Link", ph: "https://discord.gg/..." },
                { key: "discordButtonText", label: "Discord Button Text" },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={L}>{label}</label>
                  <input style={F} placeholder={ph}
                    value={(settings as Record<string, string>)[key] || ""}
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                <button type="submit" style={{ ...BP, padding: "12px 28px", fontSize: "0.87rem" }}>Save Settings</button>
                {saved && <span style={{ color: "#6ee7b7", fontSize: "0.83rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>✓ Saved</span>}
              </div>
            </form>

            <div style={{ marginTop: 28, padding: "16px 18px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "12px" }}>
              <div style={{ color: "#fca5a5", fontSize: "0.8rem", fontWeight: 700, marginBottom: 7 }}>🔒 Admin Password</div>
              <p style={{ color: "rgba(252,165,165,0.6)", fontSize: "0.78rem", margin: "0 0 6px", lineHeight: 1.6 }}>
                Set <code style={{ background: "rgba(239,68,68,0.15)", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace" }}>ADMIN_PASSWORD</code> in Replit Secrets to change your password.
              </p>
              <p style={{ color: "rgba(252,165,165,0.4)", fontSize: "0.73rem", margin: 0 }}>
                Default if not set: <code style={{ background: "rgba(239,68,68,0.12)", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace" }}>admin123</code>
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
