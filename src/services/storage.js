const TOKEN_KEY = "holidaze_token";
const USER_KEY = "holidaze_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY) || "null");
export const setUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));
export const clearUser = () => localStorage.removeItem(USER_KEY);
