// src/services/http.js
import axios from "axios";
import { getToken } from "./storage";
import { useUIStore } from "@/store/uiStore";

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

/* ───────── Global loading overlay (with a small delay to avoid flicker) ───────── */
let active = 0;
let delayTimer = null;

function begin(config) {
  // opt-out per request: http.get(url, { __skipGlobalLoading: true })
  if (config?.__skipGlobalLoading) return;

  active += 1;
  // only schedule once
  if (!delayTimer) {
    delayTimer = setTimeout(() => {
      delayTimer = null;
      useUIStore.getState().startLoading();
    }, 200); // 200ms threshold
  }
}

function end(config) {
  if (config?.__skipGlobalLoading) return;

  active = Math.max(0, active - 1);
  if (active === 0) {
    // if we never showed it (fast request), cancel the timer
    if (delayTimer) {
      clearTimeout(delayTimer);
      delayTimer = null;
    }
    useUIStore.getState().stopLoading();
  }
}

http.interceptors.request.use(
  (config) => {
    begin(config);
    return config;
  },
  (error) => {
    end(error?.config);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    end(response?.config);
    return response;
  },
  (error) => {
    end(error?.config);
    return Promise.reject(error);
  }
);
