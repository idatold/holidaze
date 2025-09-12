// src/lib/auth.js
import { AVATAR_KEY, COVER_KEY, PROFILE_NAME_KEY, PROFILE_EMAIL_KEY } from "@/lib/auth";
import { getMyProfile, updateProfileMedia } from "@/lib/authApi";


// Token helpers
export function storeAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Minimal profile info to show name/email/avatar quickly
export function storeProfileBasics({ name, email, avatarUrl, coverUrl }) {
  if (name)  localStorage.setItem(PROFILE_NAME_KEY, name);
  if (email) localStorage.setItem(PROFILE_EMAIL_KEY, email);
  if (avatarUrl != null) localStorage.setItem(AVATAR_KEY, avatarUrl);
  if (coverUrl  != null) localStorage.setItem(COVER_KEY, coverUrl);
}

export function getStoredName() {
  return localStorage.getItem(PROFILE_NAME_KEY);
}
export function getStoredEmail() {
  return localStorage.getItem(PROFILE_EMAIL_KEY);
}
