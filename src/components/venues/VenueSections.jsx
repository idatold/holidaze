// src/components/venues/VenueSections.jsx
import CollapseSection from "@/components/ui/CollapseSection";
import wifiIcon from "@/assets/icons/wifi-ocean.svg";
import parkingIcon from "@/assets/icons/parking-ocean.svg";
import breakfastIcon from "@/assets/icons/breakfast-ocean.svg";
import petsIcon from "@/assets/icons/pets-ocean.svg";
import pinIcon from "@/assets/icons/pin-heart-pink.svg";

export default function VenueSections({ venue }) {
  const name = venue?.name ?? "Venue";
  const desc =
    (venue?.description || "").trim() ||
    "No description provided for this venue.";
  const maxGuests =
    typeof venue?.maxGuests === "number" ? venue.maxGuests : null;
  const bookingsCount = Array.isArray(venue?.bookings)
    ? venue.bookings.length
    : 0;

  const amenities = [
    venue?.meta?.breakfast && {
      label: "Breakfast included",
      icon: breakfastIcon,
    },
    venue?.meta?.pets && { label: "Pets allowed", icon: petsIcon },
    venue?.meta?.parking && { label: "Parking", icon: parkingIcon },
    venue?.meta?.wifi && { label: "Wi-Fi", icon: wifiIcon },
  ].filter(Boolean);

  const place = [venue?.location?.city, venue?.location?.country]
    .filter(Boolean)
    .join(", ");
  const lat = venue?.location?.lat;
  const lng = venue?.location?.lng;

  const mapSrc =
    lat && lng
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          `${lat},${lng}`
        )}&z=12&output=embed`
      : place
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          place
        )}&z=10&output=embed`
      : null;

  return (
    <div className="mt-4">
      {/* Information (starts closed) */}
      <CollapseSection
        title="Information"
        defaultOpen={false}
        persistKey="venue-sec-info"
      >
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-[#006492]">{name}</p>
          <ul className="space-y-2">
            <InfoItem
              icon={<PeopleIcon />}
              label={`Max capacity: ${maxGuests ?? 0} ${
                maxGuests === 1 ? "guest" : "people"
              }`}
            />
            <InfoItem
              icon={<BookingsIcon />}
              label={`Previous bookings: ${bookingsCount}`}
            />
          </ul>
        </div>
      </CollapseSection>

      {/* Description */}
      <CollapseSection
        title="Description"
        defaultOpen={false}
        persistKey="venue-sec-desc"
      >
        <p className="text-sm text-zinc-700 leading-relaxed">{desc}</p>
      </CollapseSection>

      {/* Amenities */}
      <CollapseSection
        title="Amenities"
        defaultOpen={false}
        persistKey="venue-sec-amen"
      >
        {amenities.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {amenities.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-zinc-700"
              >
                <img src={a.icon} alt="" className="h-5 w-5" loading="lazy" />
                <span>{a.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">No amenities listed.</p>
        )}
      </CollapseSection>

      {/* Location */}
      <CollapseSection
        title="Location"
        defaultOpen={false}
        persistKey="venue-sec-loc"
      >
        {place ? (
          <div className="text-sm text-zinc-700">
            <div className="mb-2 inline-flex items-center gap-2">
              <img src={pinIcon} alt="" className="h-4 w-4" />
              <span>{place}</span>
            </div>
            {mapSrc ? (
              <div className="rounded-[5px] overflow-hidden ring-1 ring-zinc-200">
                <div className="aspect-[16/10] bg-zinc-100">
                  <iframe
                    title="Venue location map"
                    src={mapSrc}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Map unavailable.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No location details provided.</p>
        )}
      </CollapseSection>
    </div>
  );
}

/* Inline ocean icons */
function PeopleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#006492]"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M4 19c0-2.8 3.6-5 8-5s8 2.2 8 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BookingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#006492]"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2.5"
        ry="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 3v4M16 3v4M4 9h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function InfoItem({ icon, label }) {
  return (
    <li className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </li>
  );
}
