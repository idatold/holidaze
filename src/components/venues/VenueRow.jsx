import { Link } from "react-router-dom";

/* tiny inline icons (same look as before) */
function PencilIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14.06 4.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function TrashIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* amenity icons */
import wifiIcon from "@/assets/icons/wifi-ocean.svg";
import parkingIcon from "@/assets/icons/parking-ocean.svg";
import breakfastIcon from "@/assets/icons/breakfast-ocean.svg";
import petsIcon from "@/assets/icons/pets-ocean.svg";

/* helpers (local to this component) */
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

/**
 * Responsive row for a venue (mobile: image → text → buttons; desktop: classic row).
 * Props: { venue, onEdit(venue), onDelete(venue) }
 */
export default function VenueRow({ venue, onEdit, onDelete }) {
  const img = venue?.media?.[0]?.url;
  const title = venue?.name || "Venue";
  const nightly = toNumber(venue?.price);

  return (
    <li
      className={[
        "rounded-xl bg-white p-3 sm:p-4 shadow transition-all duration-200 border",
        "[border-color:rgba(210,51,147,.20)]",
      ].join(" ")}
    >
      {/* stack on mobile; row from sm+ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* image */}
        <Link
          to={`/venue/${venue?.id || ""}`}
          className="shrink-0 w-full sm:w-auto"
        >
          <div
            className={[
              "h-40 w-full sm:h-20 sm:w-28 rounded-lg overflow-hidden bg-foam shadow-sm",
              "border [border-color:rgba(210,51,147,.18)]",
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

        {/* text */}
        <div className="min-w-0 flex-1">
          <Link
            to={`/venue/${venue?.id || ""}`}
            className="block font-arsenal text-lg font-bold text-ink truncate hover:underline"
          >
            {title}
          </Link>

          {/* price */}
          {Number.isFinite(nightly) && nightly > 0 && (
            <div className="mt-1 text-sm text-ink/90">
              <span className="text-ink/60">From</span>{" "}
              <span className="font-semibold">{nok(nightly)}</span>{" "}
              <span className="text-ink/60">/ night</span>
            </div>
          )}

          {/* amenities */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {venue?.meta?.breakfast && (
              <img
                src={breakfastIcon}
                alt="Breakfast"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
            {venue?.meta?.pets && (
              <img
                src={petsIcon}
                alt="Pets allowed"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
            {venue?.meta?.parking && (
              <img
                src={parkingIcon}
                alt="Parking"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
            {venue?.meta?.wifi && (
              <img
                src={wifiIcon}
                alt="Wi-Fi"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* actions — centered on mobile, right on sm+ */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-end pt-3 sm:pt-0 sm:ml-auto">
          <button
            type="button"
            onClick={() => onEdit?.(venue)}
            aria-label="Edit venue"
            className="btn-icon text-ocean"
            title="Edit"
          >
            <PencilIcon />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(venue)}
            aria-label="Delete venue"
            className="btn-icon btn-icon-pink"
            title="Delete"
          >
            <TrashIcon />
          </button>

          <Link to={`/venue/${venue?.id || ""}`} className="btn btn-pink">
            View
          </Link>
        </div>
      </div>
    </li>
  );
}
