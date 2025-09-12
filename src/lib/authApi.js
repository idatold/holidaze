import { api } from "./api";

// POST /auth/register
export async function registerUser({ name, email, password, venueManager }) {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    // optional fields omitted for now (bio, avatar, banner)
    venueManager, // boolean
  });

  // API returns { data: { ...user } }
  return data?.data ?? data;
}

// POST /auth/login  (usual Noroff shape: returns { accessToken, ... })
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

// GET /holidaze/profiles/{name}
export async function getMyProfile(name) {
  const { data } = await api.get(`/holidaze/profiles/${encodeURIComponent(name)}`);
  return data?.data ?? data;
}
