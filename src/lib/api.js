import axios from "axios";

// Read either name, fall back to localhost
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE ||
  "http://localhost:3000";

const NOROFF_API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token + (optional) Noroff API key on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (NOROFF_API_KEY) config.headers["X-Noroff-API-Key"] = NOROFF_API_KEY;
  return config;
});
