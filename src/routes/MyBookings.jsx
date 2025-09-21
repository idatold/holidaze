import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, API_BASE } from "@/lib/api";
import { getStoredName, getAccessToken } from "@/lib/auth";
import toast from "@/lib/toast";
import { deleteBooking } from "@/lib/bookings";

import BookingsSection from "@/components/bookings/BookingsSection.jsx";
import BookingRow from "@/components/bookings/BookingRow.jsx";
import SortSelect from "@/components/bookings/SortSelect.jsx";

const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const h = (p) => `${HOLIDAZE_PREFIX}${p}`;

export default function MyBookings() {
  const nav = useNavigate();
  const authed = !!getAccessToken();
  const name = getStoredName();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({}); // { [bookingId]: true }

  // sorting state
  const [activeSort, setActiveSort] = useState("startAsc");
  const [pastSort, setPastSort] = useState("endDesc");

  const greeting = useMemo(() => (name ? `Hi, ${name}!` : "My bookings"), [name]);
  const today = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    if (!authed || !name) {
      toast.error("Please log in to see your bookings.");
      nav("/login");
      return;
    }
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          h(`/profiles/${encodeURIComponent(name)}/bookings`),
          { params: { _venue: true, sort: "dateFrom", sortOrder: "desc", limit: 100 } }
        );
        if (!alive) return;
        setRows(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        toast.error(e?.response?.data?.message || e?.message || "Couldn’t load bookings");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [authed, name, nav]);

  // Split into Active (not expired) vs Past (expired)
  const { active, past } = useMemo(() => {
    const a = [], p = [];
    for (const b of rows) {
      const to = safeDate(b?.dateTo);
      if (!to) continue;
      (startOfDay(to) < today ? p : a).push(b);
    }
    return { active: a, past: p };
  }, [rows, today]);

  const sortedActive = useMemo(() => sortBookings(active, activeSort), [active, activeSort]);
  const sortedPast = useMemo(() => sortBookings(past, pastSort), [past, pastSort]);

  async function onCancel(bookingId) {
    toast.confirm({
      title: "Cancel this booking?",
      message: "This cannot be undone.",
      confirmText: "Cancel booking",
      cancelText: "Keep booking",
      onConfirm: async () => {
        try {
          setDeleting((m) => ({ ...m, [bookingId]: true }));
          await deleteBooking(bookingId);
          setRows((prev) => prev.filter((b) => b.id !== bookingId));
          toast.miniSuccess("Booking canceled.");
        } catch (e) {
          toast.error(e?.message || "Could not cancel booking.");
        } finally {
          setDeleting((m) => {
            const n = { ...m };
            delete n[bookingId];
            return n;
          });
        }
      },
    });
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-higuen text-white text-3xl font-bold">{greeting}</h1>
      <p className="mt-1 text-white/90 font-semibold">Here are the trips you’ve booked.</p>

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/40 animate-pulse" />
          ))}
        </div>
      )}

      {/* Show this only when there are literally no bookings at all */}
      {!loading && active.length === 0 && past.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white shadow-md ring-1 ring-black/5 p-6">
          <p className="text-ink">No bookings yet.</p>
          <Link to="/venues" className="btn btn-pink mt-4 inline-flex">Find a place</Link>
        </div>
      )}

      {/* Active trips — only if present */}
      {!loading && sortedActive.length > 0 && (
        <BookingsSection
          id="active-trips"
          title="Active trips"
          count={sortedActive.length}
          items={sortedActive}
          hiddenWhenEmpty
          actions={<SortSelect value={activeSort} onChange={setActiveSort} />}
        >
          {sortedActive.map((b) => (
            <BookingRow
              key={b.id}
              booking={b}
              onCancel={onCancel}
              deleting={!!deleting[b.id]}
            />
          ))}
        </BookingsSection>
      )}

      {/* Past trips — ALWAYS show (even empty), with empty text and sorting */}
      {!loading && (
        <BookingsSection
          id="past-trips"
          title="Past trips"
          count={sortedPast.length}
          items={sortedPast}
          hiddenWhenEmpty={false}
          emptyText="No past trips yet."
          actions={<SortSelect value={pastSort} onChange={setPastSort} />}
        >
          {sortedPast.map((b) => (
            <BookingRow key={b.id} booking={b} faded cta="Book again" />
          ))}
        </BookingsSection>
      )}
    </main>
  );
}

/* ─────────────── local utils ─────────────── */
function safeDate(v) { const d = new Date(v); return isNaN(d) ? null : d; }
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function sortBookings(list, mode) {
  const arr = [...list];
  const get = (b, k) => {
    const d = k === "start" ? new Date(b.dateFrom) : new Date(b.dateTo);
    return d.getTime();
  };
  switch (mode) {
    case "startAsc":  return arr.sort((a, b) => get(a, "start") - get(b, "start"));
    case "startDesc": return arr.sort((a, b) => get(b, "start") - get(a, "start"));
    case "endAsc":    return arr.sort((a, b) => get(a, "end") - get(b, "end"));
    case "endDesc":   return arr.sort((a, b) => get(b, "end") - get(a, "end"));
    default:          return arr;
  }
}
