// src/routes/Venue.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "@/lib/toast";
import { getVenue } from "@/lib/api";
import { createBooking } from "@/lib/bookings";
import { getAccessToken, AUTH_CHANGED_EVENT } from "@/lib/auth";
import Gallery from "@/components/venues/Gallery";
import BrandStars from "@/components/ui/BrandStars";
import VenueInfoRow from "@/components/venues/VenueInfoRow";
import OwnerChip from "@/components/venues/OwnerChip";
import VenueSections from "@/components/venues/VenueSections";
import BookingPanel from "@/components/venues/BookingPanel";
import pinIcon from "@/assets/icons/pin-heart-pink.svg";

export default function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth state that reacts to global auth changes
  const [isAuthed, setIsAuthed] = useState(() => !!getAccessToken());
  useEffect(() => {
    const onAuthChanged = () => setIsAuthed(!!getAccessToken());
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    // also catch cross-tab changes
    window.addEventListener("storage", onAuthChanged);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
      window.removeEventListener("storage", onAuthChanged);
    };
  }, []);

  const rating = useMemo(() => {
    const n = Number(venue?.rating ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [venue]);

  const images = useMemo(() => {
    const raw = Array.isArray(venue?.media) ? venue.media : [];
    return raw
      .map((m) =>
        typeof m === "string"
          ? { url: m, alt: venue?.name ?? "Venue image" }
          : { url: m?.url, alt: m?.alt || venue?.name || "Venue image" }
      )
      .filter((m) => m?.url);
  }, [venue]);

  const locLabel = useMemo(() => {
    const city = (venue?.location?.city || "").trim();
    const country = (venue?.location?.country || "").trim();
    const parts = [city, country].filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }, [venue]);

  // Fetch venue
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getVenue(id, {
          includeOwner: true,
          includeBookings: true,
        });
        if (!alive) return;
        const data = res?.data || null;
        setVenue(data);
        if (data?.name) {
          document.title = `${data.name} · Holidaze`;
        }
      } catch (e) {
        if (alive) {
          console.error(e);
          toast.error(e?.message || "Couldn’t load venue.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // Create booking + immediately reflect it locally so the calendar disables the new range
  const onBook = useCallback(
    async ({ dateFrom, dateTo, guests }) => {
      if (!getAccessToken()) {
        // Thrown because BookingPanel surfaces messages on its side
        throw new Error("Please log in to book this venue.");
      }
      try {
        const created = await createBooking({
          venueId: id,
          dateFrom,
          dateTo,
          guests,
        });
        setVenue((v) => {
          const prev = Array.isArray(v?.bookings) ? v.bookings : [];
          const newBk = created?.data || { dateFrom, dateTo, guests };
          return { ...v, bookings: [...prev, newBk] };
        });
        return created;
      } catch (err) {
        throw new Error(err?.message || "Could not complete booking.");
      }
    },
    [id]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      {/* Title row */}
      <div className="mb-3 mt-4 sm:mt-5">
        {loading ? (
          <div className="mx-auto h-8 w-64 animate-pulse rounded bg-zinc-100 sm:h-10" />
        ) : (
          <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="font-higuen text-2xl font-bold leading-[1.06] text-ocean sm:text-3xl">
                {venue?.name || "Venue"}
              </h1>
              <BrandStars rating={rating} />
            </div>
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {loading ? (
          <div className="mt-4 space-y-3">
            <div className="h-[48svh] min-h-[240px] animate-pulse rounded-[10px] bg-zinc-100" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-24 animate-pulse rounded-[8px] bg-zinc-100"
                />
              ))}
            </div>
          </div>
        ) : (
          <Gallery
            images={images}
            title={venue?.name ?? "Venue image"}
            locLabel={locLabel}
            locIconSrc={pinIcon}
          />
        )}
      </div>

      {/* Info row */}
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {loading ? (
          <div className="mt-4 border-t border-zinc-200 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-pulse rounded bg-zinc-100" />
                <div className="h-5 w-5 animate-pulse rounded bg-zinc-100" />
                <div className="h-5 w-5 animate-pulse rounded bg-zinc-100" />
                <div className="h-5 w-5 animate-pulse rounded bg-zinc-100" />
              </div>
              <div className="h-8 w-28 animate-pulse rounded-[5px] bg-zinc-100" />
            </div>
          </div>
        ) : (
          <VenueInfoRow venue={venue} />
        )}
      </div>

      {/* Owner chip (non-clickable) */}
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {loading ? (
          <div className="mt-3 inline-flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-4 w-36 animate-pulse rounded bg-zinc-100" />
          </div>
        ) : (
          venue?.owner && <OwnerChip owner={venue.owner} linkBase="" />
        )}
      </div>

      {/* Collapsible sections */}
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {!loading && venue && <VenueSections venue={venue} />}
      </div>

      {/* Booking panel — under the collapsibles */}
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {!loading && venue && (
          <>
            {!isAuthed && (
              <p className="mt-4 text-center text-sm text-zinc-600">
                You must be logged in to book this venue.
              </p>
            )}
            <BookingPanel
              maxGuests={venue.maxGuests}
              bookings={venue.bookings}
              onBook={onBook}
            />
          </>
        )}
      </div>

      <div className="mt-8" />
    </main>
  );
}
