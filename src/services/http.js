// services/http.js
import axios from "axios";
import { getToken } from "./storage";

const API_BASE = (import.meta.env.VITE_API_URL || "https://v2.api.noroff.dev").replace(/\/+$/, "");
const N_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// attach bearer + api key if present
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (N_KEY) config.headers["X-Noroff-API-Key"] = N_KEY;
  return config;
});

// normalize error messages app-wide (optional but nice)
http.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    err.message =
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.message ||
      (status ? `Request failed (${status})` : "Network error");
    return Promise.reject(err);
  }
);
