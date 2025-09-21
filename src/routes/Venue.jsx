// src/routes/Venue.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "@/lib/toast";
import { getVenue } from "@/lib/api";

import Gallery from "@/components/venues/Gallery";
import BrandStars from "@/components/ui/BrandStars";
import VenueInfoRow from "@/components/venues/VenueInfoRow";

import pinIcon from "@/assets/icons/pin-heart-pink.svg"; // for gallery badge

export default function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const rating = useMemo(() => {
    const n = Number(venue?.rating ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [venue]);

  const images = useMemo(() => {
    const raw = Array.isArray(venue?.media) ? venue.media : [];
    return raw
      .map((m) => (typeof m === "string" ? { url: m, alt: venue?.name ?? "Venue image" } : m))
      .filter((m) => m?.url);
  }, [venue]);

  const locLabel = useMemo(() => {
    const city = venue?.location?.city;
    const country = venue?.location?.country;
    const s = [city, country].filter(Boolean).join(", ");
    return s || null;
  }, [venue]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getVenue(id, { includeOwner: true, includeBookings: true });
        if (!alive) return;
        setVenue(res?.data || null);
      } catch (e) {
        toast.error(e?.message || "Couldn’t load venue");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      {/* Title row */}
      <div className="mt-4 sm:mt-5 mb-3">
        {loading ? (
          <div className="h-8 sm:h-10 w-64 bg-zinc-100 rounded animate-pulse mx-auto" />
        ) : (
          <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="font-higuen text-ocean text-2xl sm:text-3xl font-bold leading-[1.06]">
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
          <div className="space-y-3 mt-4">
            <div className="h-[48svh] min-h-[240px] bg-zinc-100 rounded-[10px] animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 w-24 bg-zinc-100 rounded-[8px] animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <Gallery images={images} title={venue?.name ?? "Venue image"} locLabel={locLabel} locIconSrc={pinIcon} />
        )}
      </div>

      {/* Info row */}
      <div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {loading ? (
          <div className="mt-4 border-t border-zinc-200 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div className="h-5 w-48 bg-zinc-100 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-zinc-100 rounded animate-pulse" />
                <div className="h-5 w-5 bg-zinc-100 rounded animate-pulse" />
                <div className="h-5 w-5 bg-zinc-100 rounded animate-pulse" />
                <div className="h-5 w-5 bg-zinc-100 rounded animate-pulse" />
              </div>
              <div className="h-8 w-28 bg-zinc-100 rounded-[999px] animate-pulse" />
            </div>
          </div>
        ) : (
          <VenueInfoRow venue={venue} />
        )}
      </div>

      {/* Placeholder for next slices */}
      <div className="mt-8" />
    </main>
  );
}
