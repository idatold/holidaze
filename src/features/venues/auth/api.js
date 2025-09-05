import { http } from "@/services/http";
import { setToken, setUser, clearToken, clearUser } from "@/services/storage";

export async function login({ email, password }) {
  const { data } = await http.post("/auth/login", { email, password });
  // expected: { accessToken, ...user }
  if (data?.accessToken) setToken(data.accessToken);
  if (data) setUser(data.user ?? { email: data.email, name: data.name });
  return data;
}

export async function register({ name, email, password }) {
  const { data } = await http.post("/auth/register", { name, email, password });
  // some flows return accessToken on register; if so, store:
  if (data?.accessToken) setToken(data.accessToken);
  if (data) setUser(data.user ?? { email: data.email, name: data.name });
  return data;
}

export function logout() {
  clearToken();
  clearUser();
}
