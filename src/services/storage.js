// services/storage.js
const LS = typeof localStorage !== "undefined" ? localStorage : null;
const TOKEN_KEY = "holidaze_token";
const USER_KEY = "holidaze_user";

export const getToken = () => (LS ? LS.getItem(TOKEN_KEY) : null);
export const setToken = (t) => LS && LS.setItem(TOKEN_KEY, t);
export const clearToken = () => LS && LS.removeItem(TOKEN_KEY);

export const getUser = () => {
    if (!LS) return null;
    const raw = LS.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {

        LS.removeItem(USER_KEY);
        return null;
    }
};
export const setUser = (u) => LS && LS.setItem(USER_KEY, JSON.stringify(u));
export const clearUser = () => LS && LS.removeItem(USER_KEY);
