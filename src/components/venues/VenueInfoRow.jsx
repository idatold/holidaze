// src/components/venues/VenueInfoRow.jsx
import wifiIcon from "@/assets/icons/wifi-ocean.svg";
import parkingIcon from "@/assets/icons/parking-ocean.svg";
import breakfastIcon from "@/assets/icons/breakfast-ocean.svg";
import petsIcon from "@/assets/icons/pets-ocean.svg";

/* NOK formatter */
function nok(n) {
  try {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(n ?? 0);
  } catch {
    return `NOK ${Number(n ?? 0).toFixed(0)}`;
  }
}

/**
 * Props:
 * - venue: Venue object (expects venue.meta, venue.price)
 * - className?: extra wrapper classes
 * - icons?: optional override map { breakfast, pets, parking, wifi }
 */
export default function VenueInfoRow({
  venue,
  className = "",
  icons = {
    breakfast: breakfastIcon,
    pets: petsIcon,
    parking: parkingIcon,
    wifi: wifiIcon,
  },
}) {
  const hasAnyAmenity =
    venue?.meta?.breakfast ||
    venue?.meta?.pets ||
    venue?.meta?.parking ||
    venue?.meta?.wifi;

  return (
    <section
      aria-label="Venue amenities and price"
      className={`mt-4 border-t border-zinc-200 pt-4 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Amenity icons (left) */}
        <div className="flex items-center gap-3 min-h-[20px]">
          {venue?.meta?.breakfast && icons.breakfast && (
            <img
              src={icons.breakfast}
              alt="Breakfast included"
              className="h-5 w-5"
              loading="lazy"
            />
          )}
          {venue?.meta?.pets && icons.pets && (
            <img
              src={icons.pets}
              alt="Pets allowed"
              className="h-5 w-5"
              loading="lazy"
            />
          )}
          {venue?.meta?.parking && icons.parking && (
            <img
              src={icons.parking}
              alt="Parking"
              className="h-5 w-5"
              loading="lazy"
            />
          )}
          {venue?.meta?.wifi && icons.wifi && (
            <img
              src={icons.wifi}
              alt="Wi-Fi"
              className="h-5 w-5"
              loading="lazy"
            />
          )}
          {!hasAnyAmenity && (
            <span className="text-sm text-zinc-500">No amenities listed</span>
          )}
        </div>

        {/* Price (right) — 5px radius */}
        <div className="sm:ml-auto">
          <div className="inline-flex items-center rounded-[5px] bg-[#D23393] text-white px-3 py-2 text-sm font-semibold">
            {nok(venue?.price)} <span className="opacity-90 ml-1">/ night</span>
          </div>
        </div>
      </div>
    </section>
  );
}
