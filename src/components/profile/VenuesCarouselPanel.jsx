import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_BASE } from "@/lib/api";
import { getStoredName, getAccessToken } from "@/lib/auth";
import toast from "@/lib/toast";
import VenueCard from "@/components/venues/VenueCard";

/* same prefix logic as your BookingsPanel/MyBookings.jsx */
const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const h = (p) => `${HOLIDAZE_PREFIX}${p}`;

/* UI bits matched to BookingsPanel */
function SectionTitleLink({ children, to }) {
  return (
    <Link
      to={to}
      className="mb-6 block text-center font-higuen text-ocean text-xl underline underline-offset-4 hover:no-underline"
    >
      {children}
    </Link>
  );
}

function SubTitle({ children, className = "" }) {
  return (
    <h3
      className={[
        "mt-2 mb-1 text-center font-arsenal text-ink text-base font-normal",
        className,
      ].join(" ")}
    >
      {children}
    </h3>
  );
}

function EmptyState({ text, cta }) {
  return (
    <div className="mx-auto mt-2 rounded-[5px] border border-dashed border-[#006492]/30 p-4 text-center text-sm text-ocean/80 w-[240px] sm:w-[260px] md:w-[280px]">
      <p>{text}</p>
      {cta}
    </div>
  );
}

/* Reusable one-card-at-a-time carousel (identical visuals to BookingsPanel) */
function CardCarousel({ items, renderItem }) {
  const [index, setIndex] = useState(0);
  const viewportWidths = "w-[240px] sm:w-[260px] md:w-[280px]";

  useEffect(() => {
    setIndex((i) => (items.length ? Math.min(i, items.length - 1) : 0));
  }, [items.length]);

  const prev = () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1));

  if (!items.length) return null;

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="relative inline-block">
        {/* viewport shows exactly ONE card */}
        <div className={`overflow-hidden ${viewportWidths}`}>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((it) => (
              <div key={it.id} className="w-full shrink-0">
                {renderItem(it)}
              </div>
            ))}
          </div>
        </div>

        {/* arrows */}
        {items.length > 1 && (
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
              "
            >
              <span className="block text-5xl sm:text-6xl leading-none -mt-2 select-none">‹</span>
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
              "
            >
              <span className="block text-5xl sm:text-6xl leading-none -mt-2 select-none">›</span>
            </button>
          </>
        )}
      </div>

      {/* dots */}
      {items.length > 1 && (
        <div className="mt-3 mb-2 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={[
                "h-2.5 w-2.5 rounded-full transition",
                i === index ? "bg-ocean" : "bg-zinc-300",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Venues carousel for Profile page.
 * - Shows the **latest 6** venues created by the user.
 * - Only renders when logged in; optionally hide when not a venue manager.
 */
export default function VenuesCarouselPanel({ profileName, isManager = true, hideWhenNotManager = true }) {
  const token = getAccessToken?.();
  const fromAuth = getStoredName?.();
  const name = profileName || fromAuth;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optionally hide if user isn't a venue manager
  if (hideWhenNotManager && !isManager) return null;

  useEffect(() => {
    let alive = true;
    if (!token || !name) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          h(`/profiles/${encodeURIComponent(name)}/venues`),
          {
            params: {
              sort: "created",
              sortOrder: "desc",
              limit: 6, // latest 6
            },
          }
        );
        if (!alive) return;
        setRows(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        if (alive)
          toast.error(e?.response?.data?.message || e?.message || "Couldn’t load your venues");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [name, token]);

  return (
    <section>
      {/* My venues heading is a link */}
      <SectionTitleLink to="/my-venues">My venues</SectionTitleLink>

      {!token ? (
        <EmptyState text="Please log in to see your venues." />
      ) : loading ? (
        <div className="flex justify-center">
          <div className="h-48 w-[240px] sm:w-[260px] md:w-[280px] rounded-[5px] bg-white/60 animate-pulse" />
        </div>
      ) : rows.length ? (
        <>
          <SubTitle>Latest spaces</SubTitle>
          <CardCarousel
            items={rows}
            renderItem={(v) => <VenueCard venue={v} />}
          />
        </>
      ) : (
        <EmptyState
          text="You haven’t created any venues yet."
          cta={
            <Link to="/my-venues" className="btn btn-pink mt-3 inline-flex">
              Create a venue
            </Link>
          }
        />
      )}
    </section>
  );
}
