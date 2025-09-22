import { api, API_BASE } from "./api";

const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const h = (p) => `${HOLIDAZE_PREFIX}${p}`;

/** POST /holidaze/venues */
export async function createVenue(payload) {
  const body = normalizeVenueBody(payload);
  const { data } = await api.post(h("/venues"), body);
  return data?.data ?? data;
}

/** PUT /holidaze/venues/:id */
export async function updateVenue(id, payload) {
  if (!id) throw new Error("Missing venue id");
  const body = normalizeVenueBody(payload);
  const { data } = await api.put(h(`/venues/${encodeURIComponent(id)}`), body);
  return data?.data ?? data;
}

/** DELETE /holidaze/venues/:id */
export async function deleteVenue(id) {
  if (!id) throw new Error("Missing venue id");
  const { data } = await api.delete(h(`/venues/${encodeURIComponent(id)}`));
  return data?.data ?? data;
}

/** GET /holidaze/profiles/:name/venues */
export async function listVenuesByProfile(
  name,
  {
    page = 1,
    limit = 24,
    sort = "created",
    sortOrder = "desc",
    includeBookings = false,
  } = {}
) {
  if (!name) throw new Error("Missing profile name");
  const params = {
    page,
    limit,
    sort,
    sortOrder,
    ...(includeBookings ? { _bookings: true } : {}),
  };
  const { data } = await api.get(
    h(`/profiles/${encodeURIComponent(name)}/venues`),
    { params }
  );
  return data?.data ?? data;
}

/* ——— utils ——— */
function normalizeVenueBody(inp = {}) {
  const {
    name = "",
    description = "",
    price,
    maxGuests,
    rating,                 // ← now supported
    // accept array of media OR single url (back-compat)
    media = [],
    mediaUrl = "",
    mediaAlt = "",
    meta = {},
    location = {},
  } = inp;

  // Clean media[]
  const mediaList = Array.isArray(media)
    ? media
        .map((m) =>
          typeof m === "string"
            ? { url: m, alt: "" }
            : { url: m?.url, alt: m?.alt || "" }
        )
        .filter((m) => m?.url && /^https?:\/\//i.test(m.url))
    : [];

  // Fallback to single mediaUrl if provided
  if (!mediaList.length && mediaUrl && /^https?:\/\//i.test(mediaUrl)) {
    mediaList.push({ url: mediaUrl, alt: mediaAlt || "" });
  }

  const body = {
    name: String(name).trim(),
    description: String(description).trim(),
    price: Number(price ?? 0),
    maxGuests: Number(maxGuests ?? 1),
    rating: (() => {
      const n = Number(rating ?? 0);
      if (!Number.isFinite(n)) return 0;
      // clamp 0..5 (float allowed)
      return Math.min(5, Math.max(0, n));
    })(),
    media: mediaList,
    meta: {
      wifi: !!meta.wifi,
      parking: !!meta.parking,
      breakfast: !!meta.breakfast,
      pets: !!meta.pets,
    },
    location: {
      address: location.address ?? null,
      city: location.city ?? null,
      zip: location.zip ?? null,
      country: location.country ?? null,
      continent: location.continent ?? null,
      lat: typeof location.lat === "number" ? location.lat : 0,
      lng: typeof location.lng === "number" ? location.lng : 0,
    },
  };

  // Validations
  if (!body.name) throw new Error("Name is required");
  if (!body.description) throw new Error("Description is required");
  if (!Number.isFinite(body.price)) throw new Error("Price must be a number");
  if (!Number.isInteger(body.maxGuests) || body.maxGuests < 1) {
    throw new Error("Max guests must be an integer ≥ 1");
  }

  return body;
}
