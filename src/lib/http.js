// src/lib/http.js
import { TOKEN_KEY } from "@/lib/auth";
import { API_BASE } from "./api";

const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export async function http(
  path,
  { method = "GET", body, headers = {}, auth = false } = {}
) {
  const url = `${API_BASE}${path}`;
  const token = auth ? localStorage.getItem(TOKEN_KEY) : null;

  const allHeaders = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(url, {
    method,
    headers: allHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    const msg =
      json?.errors?.[0]?.message ||
      json?.message ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return json?.data ?? json;
}
