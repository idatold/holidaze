import { api } from "./api";

// Already done, just for clarity:
// Login with extra data included in response
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login?_holidaze=true", { email, password });
  return data?.data ?? data; // { name, email, avatar, banner, accessToken, venueManager }
}

// Get your profile (optionally include bookings/venues)
export async function getMyProfile(name, { bookings = false, venues = false } = {}) {
  const qs = new URLSearchParams();
  if (bookings) qs.set("_bookings", "true");
  if (venues) qs.set("_venues", "true");
  const q = qs.toString() ? `?${qs}` : "";
  const { data } = await api.get(`/holidaze/profiles/${encodeURIComponent(name)}${q}`);
  return data?.data ?? data;
}

// Update media (avatar/banner)
export async function updateProfileMedia(name, { avatarUrl, avatarAlt = "", coverUrl, coverAlt = "" } = {}) {
  const body = {};
  if (avatarUrl) body.avatar = { url: avatarUrl, alt: avatarAlt };
  if (coverUrl)  body.banner = { url: coverUrl,  alt: coverAlt  };
  const { data } = await api.put(`/holidaze/profiles/${encodeURIComponent(name)}/media`, body);
  return data?.data ?? data;
}
