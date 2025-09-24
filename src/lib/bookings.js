// src/lib/bookings.js
import { api, API_BASE } from "./api";

// Avoid double-prefixing /holidaze
const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const hPath = (p) => `${HOLIDAZE_PREFIX}${p}`;

/**
 * POST /holidaze/bookings
 * Body: { venueId, dateFrom (ISO Z at UTC midnight), dateTo (ISO Z at UTC midnight), guests }
 * Returns: { data: Booking, meta: {} }
 */
export async function createBooking({ venueId, dateFrom, dateTo, guests }) {
  if (!venueId) throw new Error("Missing venueId");

  const fromISO = toISODateUTC(dateFrom);
  const toISO = toISODateUTC(dateTo);

  if (!fromISO || !toISO) {
    throw new Error("Please select a valid date range.");
  }
  if (new Date(fromISO) >= new Date(toISO)) {
    throw new Error("Check-out must be after check-in.");
  }

  const body = {
    venueId,
    dateFrom: fromISO,
    dateTo: toISO,
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
// Build ISO at **UTC midnight** for the given calendar day, preserving the same date in Z.
function toISODateUTC(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d)) return null;
  // UTC midnight for that local calendar date (year, monthIndex, day)
  const z = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
  return z.toISOString(); // e.g., 2025-09-24T00:00:00.000Z
}
