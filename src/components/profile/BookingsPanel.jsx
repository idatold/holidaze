import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_BASE } from "@/lib/api";
import { getStoredName, getAccessToken } from "@/lib/auth";
import toast from "@/lib/toast";
import VenueCard from "@/components/venues/VenueCard";

const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const h = (p) => `${HOLIDAZE_PREFIX}${p}`;

/* utils */
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function fmt(d) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

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

function EmptyState({ text }) {
  return (
    <div className="mx-auto mt-2 rounded-[5px] border border-dashed border-[#006492]/30 p-4 text-center text-sm text-ocean/80 w-[240px] sm:w-[260px] md:w-[280px]">
      <p>{text}</p>
    </div>
  );
}

/* Reusable one-card-at-a-time carousel */
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
              "
            >
              <span className="block text-5xl sm:text-6xl leading-none -mt-2 select-none">
                ›
              </span>
            </button>
          </>
        )}
      </div>

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

export default function BookingsPanel({ profileName }) {
  const token = getAccessToken();   // ❗ direct call (no optional chaining)
  const fromAuth = getStoredName(); // ❗ direct call (no optional chaining)
  const name = profileName || fromAuth;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

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
          h(`/profiles/${encodeURIComponent(name)}/bookings`),
          {
            params: {
              _venue: true,
              sort: "dateFrom",
              sortOrder: "asc",
              limit: 100,
            },
          }
        );
        if (!alive) return;
        setRows(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        if (alive)
          toast.error(
            e?.response?.data?.message || e?.message || "Couldn’t load bookings"
          );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [name, token]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const upcoming = useMemo(() => {
    return rows
      .filter((b) => {
        const to = new Date(b?.dateTo);
        return !isNaN(to) && startOfDay(to) >= today; // “checkout today” still upcoming
      })
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
      .slice(0, 6);
  }, [rows, today]);

  const past = useMemo(() => {
    return rows
      .filter((b) => {
        const to = new Date(b?.dateTo);
        return !isNaN(to) && startOfDay(to) < today;
      })
      .sort((a, b) => new Date(b.dateTo) - new Date(a.dateTo)) // most recent first
      .slice(0, 6);
  }, [rows, today]);

  return (
    <section>
      <SectionTitleLink to="/bookings">My bookings</SectionTitleLink>

      {!token ? (
        <EmptyState text="Please log in to see your bookings." />
      ) : !name ? (
        <EmptyState text="We couldn’t detect your profile. Try logging in again." />
      ) : loading ? (
        <div className="flex justify-center">
          <div className="h-48 w-[240px] sm:w-[260px] md:w-[280px] rounded-[5px] bg-white/60 animate-pulse" />
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <SubTitle>Upcoming trips</SubTitle>
          {upcoming.length ? (
            <CardCarousel
              items={upcoming}
              renderItem={(b) => (
                <>
                  <VenueCard venue={b.venue} />
                  <p className="mt-2 text-center text-xs text-ink/70">
                    {fmt(b.dateFrom)} — {fmt(b.dateTo)}
                  </p>
                </>
              )}
            />
          ) : (
            <EmptyState text="No upcoming trips yet." />
          )}

          {/* Past */}
          <SubTitle className="mt-8">Past trips</SubTitle>
          {past.length ? (
            <CardCarousel
              items={past}
              renderItem={(b) => (
                <>
                  <VenueCard venue={b.venue} />
                  <p className="mt-2 text-center text-xs text-ink/70">
                    {fmt(b.dateFrom)} — {fmt(b.dateTo)}
                  </p>
                </>
              )}
            />
          ) : (
            <EmptyState text="No past trips yet." />
          )}
        </>
      )}
    </section>
  );
}
