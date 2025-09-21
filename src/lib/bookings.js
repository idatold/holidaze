// src/lib/bookings.js
import { api, API_BASE } from "./api";

// Mirror api.js behavior so we don't double-prefix /holidaze
const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const hPath = (p) => `${HOLIDAZE_PREFIX}${p}`;

/**
 * POST /holidaze/bookings
 * Body: { venueId, dateFrom (ISO), dateTo (ISO), guests }
 * Returns the API envelope: { data: Booking, meta: {} }
 */
export async function createBooking({ venueId, dateFrom, dateTo, guests }) {
  if (!venueId) throw new Error("Missing venueId");
  const body = {
    venueId,
    dateFrom: toISO(dateFrom),
    dateTo: toISO(dateTo),
    guests: Number(guests || 1),
  };

  try {
    const { data } = await api.post(hPath("/bookings"), body);
    return data; // { data: {...}, meta: {...} }
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.message ||
      (status ? `Booking failed (${status})` : "Booking failed");
    throw new Error(msg);
  }
}

function toISO(v) {
  const d = v instanceof Date ? v : new Date(v);
  const x = new Date(d);
  x.setHours(0, 0, 0, 0); // treat as local midnight
  return x.toISOString();
}
