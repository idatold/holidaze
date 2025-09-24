import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_BASE } from "@/lib/api";
import { getStoredName, getAccessToken } from "@/lib/auth";
import toast from "@/lib/toast";
import VenueCard from "@/components/venues/VenueCard";
import CardCarouselOne from "@/components/ui/CardCarouselOne";

const baseEndsWithHolidaze = /\/holidaze\/?$/.test(API_BASE);
const HOLIDAZE_PREFIX = baseEndsWithHolidaze ? "" : "/holidaze";
const h = (p) => `${HOLIDAZE_PREFIX}${p}`;

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
function EmptyState({ text, cta = null }) {
  return (
    <div className="mx-auto mt-2 rounded-[5px] border border-dashed border-[#006492]/30 p-4 text-center text-sm text-ocean/80 w-[240px] sm:w-[260px] md:w-[280px]">
      <p>{text}</p>
      {cta}
    </div>
  );
}

export default function VenuesCarouselPanel({
  profileName,
  isManager = false,
}) {
  if (!isManager) return null;
  return <VenuesCarouselPanelInner profileName={profileName} />;
}

function VenuesCarouselPanelInner({ profileName }) {
  const token = getAccessToken();
  const fromAuth = getStoredName();
  const name = profileName || fromAuth;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!token || !name) {
      setLoading(false);
      return () => {};
    }
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          h(`/profiles/${encodeURIComponent(name)}/venues`),
          { params: { sort: "created", sortOrder: "desc", limit: 6 } }
        );
        if (!alive) return;
        setRows(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        if (alive)
          toast.error(
            e?.response?.data?.message ||
              e?.message ||
              "Couldn’t load your venues"
          );
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
          <CardCarouselOne
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
