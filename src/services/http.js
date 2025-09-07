import axios from "axios";
import { getToken } from "./storage";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
  },
  timeout: 15000,
});

// attach bearer token if present
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
