// src/components/bookings/BookingRow.jsx
import { Link } from "react-router-dom";

export default function BookingRow({
  booking,
  faded = false,
  cta = "View",
  onCancel,
  deleting = false,
}) {
  const v = booking?.venue || {};
  const img = v?.media?.[0]?.url;
  const title = v?.name || "Venue";
  const from = safeDate(booking?.dateFrom);
  const to = safeDate(booking?.dateTo);

  // price bits
  const nightly = toNumber(v?.price);
  const nightsCount = from && to ? nights(from, to) : null;
  const showPrice =
    Number.isFinite(nightly) && nightly > 0 && Number.isFinite(nightsCount);
  const total = showPrice ? nightly * nightsCount : null;

  return (
    <li
      data-deleting={deleting ? "true" : "false"}
      className={[
        // faint brand-pink outline + soft shadow (no black ring)
        "rounded-xl bg-white p-3 sm:p-4 shadow transition-all duration-200 border",
        "[border-color:rgba(210,51,147,.20)]", // #D23393 @ 20%
        faded ? "opacity-90" : "",
        // exit animation on cancel
        "data-[deleting=true]:opacity-0 data-[deleting=true]:scale-[0.98] data-[deleting=true]:-translate-y-0.5",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <Link to={`/venue/${v?.id || ""}`} className="shrink-0">
          <div
            className={[
              "h-20 w-28 rounded-lg overflow-hidden bg-foam shadow-sm",
              // light pink stroke on the thumbnail
              "border [border-color:rgba(210,51,147,.18)]",
              faded ? "grayscale" : "",
            ].join(" ")}
          >
            {img ? (
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                draggable="false"
              />
            ) : null}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/venue/${v?.id || ""}`}
            className="block font-arsenal text-lg font-bold text-ink truncate hover:underline"
          >
            {title}
          </Link>

          {/* dates + guests */}
          <div className="mt-1 text-sm text-ink/70">
            {from && to ? (
              <>
                {fmt(from)} → {fmt(to)} • {nightsCount} night
                {nightsCount !== 1 ? "s" : ""} • {booking?.guests} guest
                {booking?.guests !== 1 ? "s" : ""}
              </>
            ) : (
              "—"
            )}
          </div>

          {/* price line (only when venue.price exists) */}
          {showPrice && (
            <div className="mt-1 text-sm text-ink/90">
              <span className="font-medium">{nok(nightly)}</span>{" "}
              <span className="text-ink/60">
                × {nightsCount} night{nightsCount !== 1 ? "s" : ""} =
              </span>{" "}
              <span className="font-semibold">{nok(total)}</span>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex items-center gap-2">
          <Link to={`/venue/${v?.id || ""}`} className="btn btn-pink">
            {cta}
          </Link>

          {onCancel && !faded && (
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              disabled={deleting}
              aria-busy={deleting ? "true" : "false"}
              className="btn btn-outline-pink"
            >
              {deleting ? "Cancelling…" : "Cancel"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

/* local utils (kept inline for drop-in) */
function safeDate(v) {
  const d = new Date(v);
  return isNaN(d) ? null : d;
}
function fmt(d) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function nights(a, b) {
  const ms = startOfDay(b) - startOfDay(a);
  return Math.max(1, Math.round(ms / 86400000));
}
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}
function nok(n) {
  try {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
    }).format(n ?? 0);
  } catch {
    return `${n} NOK`;
  }
}
