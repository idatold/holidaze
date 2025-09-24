// src/components/venues/TopVenuesCarousel.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "@/lib/toast";
import { listVenues, getVenue } from "@/lib/api";
import VenueCard from "@/components/venues/VenueCard";

/* Match Profile carousel card widths exactly */
const CARD_W = "w-[240px] sm:w-[260px] md:w-[280px]";
/* Viewport widths = 1 / 2 / 2 / 3 cards (base / sm / md / lg) */
const VIEWPORT_W = "w-[240px] sm:w-[520px] md:w-[560px] lg:w-[840px]";

/** responsive perView: 1 (<640), 2 (>=640 & <1024), 3 (>=1024) */
function usePerView() {
  const compute = () => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  };
  const [perView, setPerView] = useState(compute);
  useEffect(() => {
    const onResize = () => setPerView(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return perView;
}

export default function TopVenuesCarousel() {
  const [metric, setMetric] = useState("rating"); // "rating" | "bookings"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const perView = usePerView();
  const [page, setPage] = useState(0);

  // Build pages of fixed size so we can translate by -page * 100%
  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < items.length; i += perView) {
      out.push(items.slice(i, i + perView));
    }
    return out.length ? out : [[]];
  }, [items, perView]);

  const pageCount = pages.length;

  // Clamp current page when items/perView change
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        if (metric === "rating") {
          // Top 5 by rating desc
          const { data } = await listVenues({
            limit: 5,
            sort: "rating",
            sortOrder: "desc",
          });
          if (!alive) return;
          setItems(Array.isArray(data) ? data.slice(0, 5) : []);
          return;
        }

        // metric === "bookings" → sample + rank by bookings count
        const pageSize = 25;
        const targetPool = 75;
        let pool = [];
        let pageNum = 1;
        let hasNext = true;

        while (pool.length < targetPool && hasNext) {
          const { data, meta } = await listVenues({
            page: pageNum,
            limit: pageSize,
            sort: "created",
            sortOrder: "desc",
            includeBookings: true, // maps to ?_bookings=true in your api.js
          });
          const chunk = Array.isArray(data) ? data : [];
          pool = pool.concat(chunk);
          hasNext = !!meta?.nextPage;
          pageNum = meta?.nextPage || pageNum + 1;
          if (!hasNext) break;
        }

        // Enrich if bookings missing (older helper fallback)
        const needEnrich = pool.some((v) => !Array.isArray(v?.bookings));
        let withBookings = pool;
        if (needEnrich) {
          const subset = pool.slice(0, targetPool);
          withBookings = await Promise.all(
            subset.map(async (v) => {
              try {
                const full = await getVenue(v.id, { includeBookings: true });
                return full?.data || v;
              } catch {
                return v;
              }
            })
          );
        }

        const ranked = withBookings
          .map((v) => ({
            ...v,
            _bookingsCount: Array.isArray(v.bookings) ? v.bookings.length : 0,
          }))
          .sort((a, b) => {
            const d = (b._bookingsCount || 0) - (a._bookingsCount || 0);
            return d !== 0 ? d : (b.rating || 0) - (a.rating || 0);
          })
          .slice(0, 5);

        if (!alive) return;
        setItems(ranked);
      } catch (e) {
        if (alive) toast.error(e?.message || "Couldn’t load popular venues.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [metric]);

  const prev = () => setPage((p) => (p === 0 ? pageCount - 1 : p - 1));
  const next = () => setPage((p) => (p === pageCount - 1 ? 0 : p + 1));

  return (
    <section className="my-10 sm:my-12 px-2 sm:px-0">
      {/* centered title on top */}
      <div className="text-center">
        <h2 className="font-higuen text-xl text-ocean">Recommended Venues</h2>

        {/* toggle underneath, centered */}
        <div className="mt-3 inline-flex overflow-hidden rounded-[5px] ring-1 ring-[#D23393]">
          <button
            type="button"
            onClick={() => setMetric("rating")}
            className={`px-3 py-1.5 text-sm font-semibold ${
              metric === "rating" ? "bg-[#D23393] text-white" : "bg-white text-[#D23393]"
            }`}
          >
            Top rated
          </button>
          <button
            type="button"
            onClick={() => setMetric("bookings")}
            className={`px-3 py-1.5 text-sm font-semibold ${
              metric === "bookings" ? "bg-[#D23393] text-white" : "bg-white text-[#D23393]"
            }`}
          >
            Most booked
          </button>
        </div>
      </div>

      {/* content */}
      <div className="mt-5 sm:mt-6">
        {loading ? (
          <div className="flex justify-center">
            <div className={`overflow-hidden ${VIEWPORT_W}`}>
              <div className="flex -mx-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`px-2 ${CARD_W}`}>
                    <div className="h-72 w-full animate-pulse rounded-[5px] border border-zinc-200 bg-zinc-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !items.length ? (
          <p className="text-center text-sm text-zinc-600">
            No popular venues yet.
          </p>
        ) : (
          <div className="flex justify-center">
            {/* relative wrapper (no overflow) so arrows aren't clipped */}
            <div className={`relative inline-block ${VIEWPORT_W}`}>
              {/* viewport */}
              <div className="overflow-hidden">
                {/* track of pages */}
                <div
                  className="flex transition-transform duration-500"
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {pages.map((group, idx) => (
                    <div key={idx} className="w-full shrink-0">
                      <div className="flex -mx-2 justify-center">
                        {group.map((v) => (
                          <div key={v.id} className={`px-2 ${CARD_W}`}>
                            <VenueCard venue={v} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* arrows — same size/offset as your other carousels */}
              {pageCount > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={prev}
                    className="
                      absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2
                      h-14 w-14 sm:h-16 sm:w-16
                      flex items-center justify-center
                      text-ocean hover:scale-105 active:scale-95 focus:outline-none
                      z-10
                    "
                  >
                    <span className="block text-5xl sm:text-6xl leading-none -mt-2 select-none">
                      ‹
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={next}
                    className="
                      absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2
                      h-14 w-14 sm:h-16 sm:w-16
                      flex items-center justify-center
                      text-ocean hover:scale-105 active:scale-95 focus:outline-none
                      z-10
                    "
                  >
                    <span className="block text-5xl sm:text-6xl leading-none -mt-2 select-none">
                      ›
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* dots */}
        {pageCount > 1 && !loading && items.length > 0 && (
          <div className="mt-3 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === page ? "true" : undefined}
                onClick={() => setPage(i)}
                className={[
                  "h-2.5 w-2.5 rounded-full transition",
                  i === page ? "bg-ocean" : "bg-zinc-300",
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
