// src/lib/authApi.js
import { api, API_BASE } from "./api";

// Build once from the shared base
const AUTH_BASE = `${API_BASE}/auth`;
const HOLIDAZE_BASE = `${API_BASE}/holidaze`;

const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
// Only attach the key if it exists
const withKey = API_KEY ? { headers: { "X-Noroff-API-Key": API_KEY } } : {};

// POST /auth/register
export async function registerUser({ name, email, password, venueManager }) {
  const { data } = await api.post(
    `${AUTH_BASE}/register`,
    { name, email, password, venueManager },
    withKey
  );
  return data?.data ?? data;
}

// POST /auth/login
export async function loginUser({ email, password }) {
  const { data } = await api.post(
    `${AUTH_BASE}/login`,
    { email, password },
    withKey
  );
  // expects { accessToken, name, email, avatar, banner, venueManager }
  return data?.data ?? data;
}

// GET /holidaze/profiles/:name?_bookings&_venues
export async function getMyProfile(
  name,
  { bookings = false, venues = false } = {}
) {
  const qs = new URLSearchParams();
  if (bookings) qs.set("_bookings", "true");
  if (venues) qs.set("_venues", "true");
  const suffix = qs.toString() ? `?${qs}` : "";

  const { data } = await api.get(
    `${HOLIDAZE_BASE}/profiles/${encodeURIComponent(name)}${suffix}`,
    withKey
  );
  return data?.data ?? data;
}

// PUT /holidaze/profiles/:name  (avatar/banner/venueManager/bio)
export async function updateProfileMedia(
  name,
  { avatarUrl, avatarAlt = "", coverUrl, coverAlt = "", venueManager, bio } = {}
) {
  const body = {};
  if (avatarUrl) body.avatar = { url: avatarUrl, alt: avatarAlt ?? "" };
  if (coverUrl) body.banner = { url: coverUrl, alt: coverAlt ?? "" };
  if (typeof venueManager === "boolean") body.venueManager = venueManager;
  if (typeof bio === "string") body.bio = bio;

  if (!Object.keys(body).length) throw new Error("No changes to send.");

  const { data } = await api.put(
    `${HOLIDAZE_BASE}/profiles/${encodeURIComponent(name)}`,
    body,
    withKey
  );
  return data?.data ?? data;
}

// PUT /holidaze/profiles/:name  { venueManager: boolean }
export async function updateVenueManagerStatus(name, { venueManager }) {
  const { data } = await api.put(
    `${HOLIDAZE_BASE}/profiles/${encodeURIComponent(name)}`,
    { venueManager },
    withKey
  );
  return data?.data ?? data;
}
