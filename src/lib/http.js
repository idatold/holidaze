import { TOKEN_KEY } from "@/lib/auth";

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://v2.api.noroff.dev").replace(/\/+$/, "");
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export async function http(path, { method = "GET", body, headers = {}, auth = false } = {}) {
  const url = `${API_BASE}${path}`;
  const token = auth ? localStorage.getItem(TOKEN_KEY) : null;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  try { json = await res.json(); } catch {}
  if (!res.ok) {
    const msg =
      json?.errors?.[0]?.message ||
      json?.message ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return json?.data ?? json;
}
