// src/lib/auth.js

// ── Storage keys (NAMED exports) ──────────────────────────────────────────────
export const TOKEN_KEY = "access_token";
export const PROFILE_NAME_KEY = "profile_name";
export const PROFILE_EMAIL_KEY = "profile_email";
export const AVATAR_KEY = "holidaze_avatar_url";
export const COVER_KEY  = "holidaze_cover_url";

// ── Token helpers ─────────────────────────────────────────────────────────────
export function storeAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Minimal profile info helpers ──────────────────────────────────────────────
export function storeProfileBasics({ name, email, avatarUrl, coverUrl }) {
  if (name)  localStorage.setItem(PROFILE_NAME_KEY, name);
  if (email) localStorage.setItem(PROFILE_EMAIL_KEY, email);
  if (avatarUrl != null) localStorage.setItem(AVATAR_KEY, avatarUrl);
  if (coverUrl  != null) localStorage.setItem(COVER_KEY,  coverUrl);
}

export function getStoredName() {
  return localStorage.getItem(PROFILE_NAME_KEY);
}
export function getStoredEmail() {
  return localStorage.getItem(PROFILE_EMAIL_KEY);
}

/* ── NEW: clear helpers + one-call sign out ─────────────────────────────────── */
export function clearProfileBasics() {
  localStorage.removeItem(PROFILE_NAME_KEY);
  localStorage.removeItem(PROFILE_EMAIL_KEY);
  localStorage.removeItem(AVATAR_KEY);
  localStorage.removeItem(COVER_KEY);
}

/** Clear token + cached profile and notify app */
export function clearAuth() {
  clearAccessToken();
  clearProfileBasics();
  // let navbar / guards react if needed
  window.dispatchEvent(new Event("holidaze:logout"));
}
