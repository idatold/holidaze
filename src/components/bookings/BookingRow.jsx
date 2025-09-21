import { Link } from "react-router-dom";

export default function BookingRow({ booking, faded = false, cta = "View", onCancel, deleting = false }) {
  const v = booking?.venue;
  const img = v?.media?.[0]?.url;
  const title = v?.name || "Venue";
  const from = safeDate(booking?.dateFrom);
  const to = safeDate(booking?.dateTo);

  return (
    <li className={`rounded-xl border border-zinc-200 bg-white p-3 sm:p-4 ${faded ? "opacity-90" : ""}`}>
      <div className="flex items-center gap-4">
        <Link to={`/venue/${v?.id || ""}`} className="shrink-0">
          <div className={`h-20 w-28 rounded-lg overflow-hidden ${faded ? "grayscale" : ""} bg-zinc-100`}>
            {img ? <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/venue/${v?.id || ""}`}
            className="block font-arsenal text-lg font-bold text-ink truncate hover:underline"
          >
            {title}
          </Link>
          <div className="mt-1 text-sm text-zinc-600">
            {from && to ? (
              <>
                {fmt(from)} → {fmt(to)} • {nights(from, to)} night{nights(from, to) !== 1 ? "s" : ""} • {booking?.guests} guest{booking?.guests !== 1 ? "s" : ""}
              </>
            ) : (
              "—"
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/venue/${v?.id || ""}`} className="btn btn-pink">{cta}</Link>

          {/* Only show Cancel when a handler is provided (for active rows) */}
          {onCancel && !faded && (
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              disabled={deleting}
              className="rounded-xl border border-pink-200 px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 disabled:opacity-60"
            >
              {deleting ? "Cancelling…" : "Cancel"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

/* local utils */
function safeDate(v) { const d = new Date(v); return isNaN(d) ? null : d; }
function fmt(d) { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d); }
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function nights(a, b) { const ms = startOfDay(b) - startOfDay(a); return Math.max(1, Math.round(ms / 86400000)); }
