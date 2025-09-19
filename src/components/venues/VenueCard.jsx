import { Link } from "react-router-dom";
import fallbackImg from "@/assets/venue-fallback.jpg";

function nok(n) {
  try {
    return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK" }).format(n);
  } catch {
    return `NOK ${Number(n || 0).toFixed(0)}`;
  }
}

export default function VenueCard({ venue, compact = false }) {
  const img = venue?.media?.[0]?.url || fallbackImg;
  const place = [venue?.location?.city, venue?.location?.country].filter(Boolean).join(", ");

  return (
    <Link
      to={`/venue/${venue.id}`}
      className={`group rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200 hover:shadow-md transition ${
        compact ? "min-w-[260px] max-w-[320px]" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-zinc-100 ${compact ? "aspect-[4/3]" : "aspect-[16/11]"}`}>
        <img
          src={img}
          alt={venue?.media?.[0]?.alt || venue.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = fallbackImg)}
          loading="lazy"
          draggable="false"
        />
        <div className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium">
          ⭐ {venue.rating?.toFixed?.(1) ?? "0.0"}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900 line-clamp-1">{venue.name}</h3>
          <div className="text-right min-w-fit">
            <div className="font-semibold">{nok(venue.price)}</div>
            <div className="text-xs text-zinc-500 -mt-0.5">per night</div>
          </div>
        </div>

        {!compact && place && <p className="mt-1 text-sm text-zinc-600 line-clamp-1">{place}</p>}

        <div className={`mt-3 flex items-center gap-2 text-xs text-zinc-600 ${compact ? "justify-between" : ""}`}>
          <div className="flex gap-2">
            {venue.meta?.wifi && <span title="Wi-Fi">📶</span>}
            {venue.meta?.parking && <span title="Parking">🅿️</span>}
            {venue.meta?.breakfast && <span title="Breakfast">🥐</span>}
            {venue.meta?.pets && <span title="Pets allowed">🐾</span>}
          </div>
          <span className="ml-auto text-zinc-500">{venue.maxGuests} guests</span>
        </div>
      </div>
    </Link>
  );
}
