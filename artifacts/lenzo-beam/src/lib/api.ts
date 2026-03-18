const BASE = "/api";

export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("admin_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export type Tool = {
  id: number;
  name: string;
  description: string;
  link: string;
  orderNum: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SiteSettings = {
  siteTitle: string;
  siteSubtitle: string;
  discordLink: string;
  discordButtonText: string;
};

export type ToolStatus = {
  id: number;
  online: boolean;
  responseTime?: number;
  checkedAt: string;
};

export const api = {
  listTools: () => apiFetch<Tool[]>("/tools"),
  createTool: (data: Partial<Tool>) => apiFetch<Tool>("/tools", { method: "POST", body: JSON.stringify(data) }),
  updateTool: (id: number, data: Partial<Tool>) => apiFetch<Tool>(`/tools/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTool: (id: number) => apiFetch<void>(`/tools/${id}`, { method: "DELETE" }),
  checkToolStatus: (id: number) => apiFetch<ToolStatus>(`/tools/${id}/status`),
  getSettings: () => apiFetch<SiteSettings>("/settings"),
  updateSettings: (data: Partial<SiteSettings>) => apiFetch<SiteSettings>("/settings", { method: "PUT", body: JSON.stringify(data) }),
  login: (password: string) => apiFetch<{ token: string }>("/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => apiFetch<void>("/admin/logout", { method: "POST" }),
};
