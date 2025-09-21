// src/lib/bookings.js
import { api, API_BASE } from "./api";

// Avoid double-prefixing /holidaze
const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const hPath = (p) => `${HOLIDAZE_PREFIX}${p}`;

/**
 * POST /holidaze/bookings
 * Body: { venueId, dateFrom (ISO), dateTo (ISO), guests }
 * Returns: { data: Booking, meta: {} }
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
    return data;
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.message ||
      (status ? `Booking failed (${status})` : "Booking failed");
    throw new Error(msg);
  }
}

/**
 * DELETE /holidaze/bookings/:id
 * Returns: true on success
 */
export async function deleteBooking(bookingId) {
  if (!bookingId) throw new Error("Missing bookingId");
  try {
    await api.delete(hPath(`/bookings/${bookingId}`));
    return true;
  } catch (err) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.message ||
      (status ? `Cancel failed (${status})` : "Cancel failed");
    throw new Error(msg);
  }
}

/* utils */
function toISO(v) {
  const d = v instanceof Date ? v : new Date(v);
  const x = new Date(d);
  x.setHours(0, 0, 0, 0); // local midnight
  return x.toISOString();
}
