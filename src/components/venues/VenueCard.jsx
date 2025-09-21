// src/components/venues/VenueCard.jsx 
import { Link } from "react-router-dom";

/* === import your Figma-exported SVGs here ============================= */
/* replace these paths with your actual files (keep the names if you like) */
import wifiIcon from "@/assets/icons/wifi-ocean.svg";
import parkingIcon from "@/assets/icons/parking-ocean.svg";
import breakfastIcon from "@/assets/icons/breakfast-ocean.svg";
import petsIcon from "@/assets/icons/pets-ocean.svg";
import pinIcon from "@/assets/icons/pin-heart-pink.svg"; // default location icon
/* ===================================================================== */

/* NOK formatter */
function nok(n) {
  try {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
    }).format(n ?? 0);
  } catch {
    return `NOK ${Number(n ?? 0).toFixed(0)}`;
  }
}

/* Brand pink star stays inline so it’s always the right pink */
function PinkStar({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.97l-5.8 3.3 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z"
        fill="#D23393"
      />
    </svg>
  );
}

export default function VenueCard({
  venue,
  /* optional overrides if you want to swap icons per usage */
  locIconSrc = pinIcon,
  icons = {
    breakfast: breakfastIcon,
    pets: petsIcon,
    parking: parkingIcon,
    wifi: wifiIcon,
  },
}) {
  const img = venue?.media?.[0]?.url;
  const place = [venue?.location?.city, venue?.location?.country]
    .filter(Boolean)
    .join(", ");
  const rating =
    typeof venue?.rating === "number" && !Number.isNaN(venue.rating)
      ? venue.rating.toFixed(1)
      : "0.0";

  return (
    <Link
      to={`/venue/${venue.id}`}
      className="group block h-full rounded-[5px] overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-md transition"
      aria-label={venue?.name || "View venue"}
    >
      {/* image */}
      <div className="relative bg-[#FAF6F4]">
        {img ? (
          <img
            src={img}
            alt={venue?.media?.[0]?.alt || venue?.name || "Venue"}
            className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
            draggable="false"
          />
        ) : (
          <div className="h-[180px] w-full grid place-items-center text-[#D23393]">
            <span className="opacity-60">No image</span>
          </div>
        )}

        {/* rating badge with pink star */}
        <div className="absolute top-2 left-2 rounded-[5px] bg-white/95 px-2 py-1 text-xs font-semibold flex items-center gap-1">
          <PinkStar />
          <span className="text-ink">{rating}</span>
        </div>

        {/* price tag */}
        <div className="absolute bottom-2 right-2 rounded-[5px] bg-[#D23393] text-white text-xs px-2 py-1">
          {nok(venue?.price)} / night
        </div>
      </div>

      {/* body: center title/location; pinned footer */}
      <div className="p-3 flex flex-col min-h-[150px]">
        {/* Name → Arsenal + centered */}
        <h3 className="font-arsenal text-lg font-bold leading-snug text-ink text-center line-clamp-1">
          {venue?.name || "Untitled venue"}
        </h3>

        {/* Location → centered with your icon (moved down) */}
        {place && (
          <p className="mt-3 sm:mt-4 text-sm text-zinc-600 line-clamp-1 flex items-center justify-center gap-1.5">
            {locIconSrc && (
              <img src={locIconSrc} alt="" className="h-4 w-4 inline-block" loading="lazy" />
            )}
            <span>{place}</span>
          </p>
        )}

        {/* FOOTER pinned to the bottom of the card */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          {/* amenities left */}
          <div className="flex items-center gap-3">
            {venue?.meta?.breakfast && icons.breakfast && (
              <img
                src={icons.breakfast}
                alt="Breakfast included"
                className="h-5 w-5 inline-block"
                loading="lazy"
              />
            )}
            {venue?.meta?.pets && icons.pets && (
              <img
                src={icons.pets}
                alt="Pets allowed"
                className="h-5 w-5 inline-block"
                loading="lazy"
              />
            )}
            {venue?.meta?.parking && icons.parking && (
              <img
                src={icons.parking}
                alt="Parking"
                className="h-5 w-5 inline-block"
                loading="lazy"
              />
            )}
            {venue?.meta?.wifi && icons.wifi && (
              <img
                src={icons.wifi}
                alt="Wi-Fi"
                className="h-5 w-5 inline-block"
                loading="lazy"
              />
            )}
          </div>

          {/* guests right (always shown) */}
          <span className="text-xs text-zinc-600">
            {venue?.maxGuests ?? 0} guests
          </span>
        </div>
      </div>
    </Link>
  );
}
