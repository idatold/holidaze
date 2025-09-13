// src/lib/authApi.js
import { api } from "./api";

// POST /auth/register
export async function registerUser({ name, email, password, venueManager }) {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    venueManager, // optional boolean
  });
  // API returns { data: { ...user } }
  return data?.data ?? data;
}

// POST /auth/login (include extra holidaze fields)
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login?_holidaze=true", {
    email,
    password,
  });
  // API returns { data: { name, email, avatar, banner, accessToken, venueManager }, meta: {} }
  return data?.data ?? data;
}

// GET /holidaze/profiles/{name}?_bookings&_venues
export async function getMyProfile(name, { bookings = false, venues = false } = {}) {
  const qs = new URLSearchParams();
  if (bookings) qs.set("_bookings", "true");
  if (venues) qs.set("_venues", "true");
  const suffix = qs.toString() ? `?${qs}` : "";
  const { data } = await api.get(`/holidaze/profiles/${encodeURIComponent(name)}${suffix}`);
  return data?.data ?? data;
}

// PUT /holidaze/profiles/:name  (avatar/banner/venueManager/bio)
export async function updateProfileMedia(
  name,
  { avatarUrl, avatarAlt = "", coverUrl, coverAlt = "", venueManager, bio } = {}
) {
  const body = {};
  if (avatarUrl) body.avatar = { url: avatarUrl, alt: avatarAlt ?? "" };
  if (coverUrl)  body.banner = { url: coverUrl,  alt: coverAlt  ?? "" };
  if (typeof venueManager === "boolean") body.venueManager = venueManager;
  if (typeof bio === "string") body.bio = bio;

  if (!Object.keys(body).length) {
    throw new Error("No changes to send.");
  }

  const { data } = await api.put(
    `/holidaze/profiles/${encodeURIComponent(name)}`,
    body
  );
  return data?.data ?? data;
}

