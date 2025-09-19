import axios from "axios";

// ✅ Default to Noroff v2 unless overridden in .env
export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE ||
  "https://v2.api.noroff.dev"
).replace(/\/$/, ""); // drop trailing slash to avoid '//' joins

const NOROFF_API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token + (optional) Noroff API key on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (NOROFF_API_KEY) config.headers["X-Noroff-API-Key"] = NOROFF_API_KEY;
  return config;
});

/* ─────────────────────────────  Holidaze Venues API  ─────────────────────────────
   IMPORTANT: Keep API_BASE pointing to the root (e.g. https://v2.api.noroff.dev),
   not including `/holidaze`. We’ll add that segment in the path helpers below.
------------------------------------------------------------------------------- */

const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";

/**
 * Build a Holidaze path that avoids double `/holidaze` if the base already has it.
 * Always starts with a leading slash so axios joins correctly.
 */
function hPath(path) {
  return `${HOLIDAZE_PREFIX}${path}`; 
}

/**
 * List venues with paging/sorting.
 * Supports: page, limit, sort, sortOrder, includeOwner => _owner, includeBookings => _bookings
 * Returns the raw API envelope: { data: Venue[], meta: {...} }
 */
export async function listVenues({
  page = 1,
  limit = 12,
  sort = "created",
  sortOrder = "desc",
  includeOwner = false,
  includeBookings = false,
} = {}) {
  const params = {
    page,
    limit,
    sort,
    sortOrder,
    ...(includeOwner ? { _owner: true } : {}),
    ...(includeBookings ? { _bookings: true } : {}),
  };
  const res = await api.get(hPath("/venues"), { params });
  return res.data;
}

/**
 * Search venues by name/description using /venues/search
 * Same params as listVenues, plus q.
 */
export async function searchVenues(
  q,
  {
    page = 1,
    limit = 12,
    sort = "created",
    sortOrder = "desc",
    includeOwner = false,
    includeBookings = false,
  } = {}
) {
  const params = {
    q,
    page,
    limit,
    sort,
    sortOrder,
    ...(includeOwner ? { _owner: true } : {}),
    ...(includeBookings ? { _bookings: true } : {}),
  };
  const res = await api.get(hPath("/venues/search"), { params });
  return res.data;
}

/**
 * Get a single venue by id.
 * Supports including owner and/or bookings via query params.
 * Returns { data: Venue, meta: {} }
 */
export async function getVenue(
  id,
  { includeOwner = true, includeBookings = false } = {}
) {
  if (!id) throw new Error("Missing venue id");
  const params = {
    ...(includeOwner ? { _owner: true } : {}),
    ...(includeBookings ? { _bookings: true } : {}),
  };
  const res = await api.get(hPath(`/venues/${id}`), { params });
  return res.data;
}

/**
 * Recommended/top-rated venues convenience helper.
 * Just a sorted slice on rating desc.
 */
export async function listTopRatedVenues({ limit = 12 } = {}) {
  return listVenues({ page: 1, limit, sort: "rating", sortOrder: "desc" });
}
