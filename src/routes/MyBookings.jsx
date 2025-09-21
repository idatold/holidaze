// src/routes/MyBookings.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, API_BASE } from "@/lib/api";
import { getStoredName, getAccessToken } from "@/lib/auth";
import toast from "@/lib/toast";

const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const h = (p) => `${HOLIDAZE_PREFIX}${p}`;

export default function MyBookings() {
  const nav = useNavigate();
  const authed = !!getAccessToken();
  const name = getStoredName();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const greeting = useMemo(() => (name ? `Hi, ${name}!` : "My bookings"), [name]);

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
        // GET /holidaze/profiles/:name/bookings?_venue=true
        const { data } = await api.get(
          h(`/profiles/${encodeURIComponent(name)}/bookings`),
          { params: { _venue: true, sort: "dateFrom", sortOrder: "desc", limit: 50 } }
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

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-higuen text-ocean text-3xl font-bold">{greeting}</h1>
      <p className="text-zinc-600 mt-1">Here are the trips you’ve booked.</p>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-[8px] bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-6 rounded-[8px] border border-zinc-200 bg-white p-6">
          <p className="text-zinc-700">No bookings yet.</p>
          <Link to="/venues" className="btn btn-pink mt-4 inline-flex">Find a place</Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {rows.map((b) => {
            const v = b?.venue;
            const img = v?.media?.[0]?.url;
            const title = v?.name || "Venue";
            const from = safeDate(b?.dateFrom);
            const to = safeDate(b?.dateTo);
            return (
              <li key={b.id} className="rounded-[8px] border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <Link to={`/venue/${v?.id || ""}`} className="shrink-0">
                    <div className="h-20 w-28 rounded-[6px] overflow-hidden bg-zinc-100">
                      {img ? (
                        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : null}
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/venue/${v?.id || ""}`} className="block font-arsenal text-lg font-bold text-ink truncate">
                      {title}
                    </Link>
                    <div className="mt-1 text-sm text-zinc-600">
                      {from && to ? (
                        <>
                          {fmt(from)} → {fmt(to)} • {nights(from, to)} night{nights(from, to) !== 1 ? "s" : ""} • {b?.guests} guest{b?.guests !== 1 ? "s" : ""}
                        </>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                  <Link to={`/venue/${v?.id || ""}`} className="btn btn-pink">View</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function safeDate(v) { const d = new Date(v); return isNaN(d) ? null : d; }
function fmt(d) { return new Intl.DateTimeFormat("en-GB",{ day:"2-digit", month:"short", year:"numeric" }).format(d); }
function nights(a,b){ const ms = startOfDay(b) - startOfDay(a); return Math.max(1, Math.round(ms/86400000)); }
function startOfDay(d){ const x=new Date(d); x.setHours(0,0,0,0); return x; }
