import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getStoredName, getAccessToken } from "@/lib/auth";
import { listVenuesByProfile, deleteVenue } from "@/lib/venues";
import toast from "@/lib/toast";
import CreateVenueModal from "@/components/venues/CreateVenueModal";

/* amenity icons */
import wifiIcon from "@/assets/icons/wifi-ocean.svg";
import parkingIcon from "@/assets/icons/parking-ocean.svg";
import breakfastIcon from "@/assets/icons/breakfast-ocean.svg";
import petsIcon from "@/assets/icons/pets-ocean.svg";

/* reuse your pencil icon style */
function PencilIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14.06 4.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function TrashIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* helpers */
function nok(n) {
  try {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
    }).format(n ?? 0);
  } catch {
    return `${n} NOK`;
  }
}
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

/* Row for a venue (mirrors BookingRow style) */
function VenueRow({ venue, onEdit, onDelete }) {
  const img = venue?.media?.[0]?.url;
  const title = venue?.name || "Venue";
  const nightly = toNumber(venue?.price);

  return (
    <li
      className={[
        "rounded-xl bg-white p-3 sm:p-4 shadow transition-all duration-200 border",
        "[border-color:rgba(210,51,147,.20)]",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <Link to={`/venue/${venue?.id || ""}`} className="shrink-0">
          <div
            className={[
              "h-20 w-28 rounded-lg overflow-hidden bg-foam shadow-sm",
              "border [border-color:rgba(210,51,147,.18)]",
            ].join(" ")}
          >
            {img ? (
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                draggable="false"
              />
            ) : null}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/venue/${venue?.id || ""}`}
            className="block font-arsenal text-lg font-bold text-ink truncate hover:underline"
          >
            {title}
          </Link>

          {/* price */}
          {Number.isFinite(nightly) && nightly > 0 && (
            <div className="mt-1 text-sm text-ink/90">
              <span className="text-ink/60">From</span>{" "}
              <span className="font-semibold">{nok(nightly)}</span>{" "}
              <span className="text-ink/60">/ night</span>
            </div>
          )}

          {/* amenities */}
          <div className="mt-2 flex items-center gap-3">
            {venue?.meta?.breakfast && (
              <img
                src={breakfastIcon}
                alt="Breakfast"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
            {venue?.meta?.pets && (
              <img
                src={petsIcon}
                alt="Pets allowed"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
            {venue?.meta?.parking && (
              <img
                src={parkingIcon}
                alt="Parking"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
            {venue?.meta?.wifi && (
              <img
                src={wifiIcon}
                alt="Wi-Fi"
                className="h-5 w-5"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* actions: EDIT, DELETE, then VIEW at the far right */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(venue)}
            aria-label="Edit venue"
            className="btn-icon text-ocean"
            title="Edit"
          >
            <PencilIcon />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(venue)}
            aria-label="Delete venue"
            className="btn-icon btn-icon-pink"
            title="Delete"
          >
            <TrashIcon />
          </button>

          {/* View is last so it sits furthest right */}
          <Link to={`/venue/${venue?.id || ""}`} className="btn btn-pink">
            View
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function MyVenues() {
  const token = getAccessToken?.();
  const name = getStoredName?.();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // single modal reused for both create & edit
  const [editing, setEditing] = useState(null); // a venue object or null
  const openCreate = params.get("create") === "1";

  // clear any stale ?create=1
  useEffect(() => {
    if (params.get("create") === "1") {
      setParams(
        (p) => {
          const n = new URLSearchParams(p);
          n.delete("create");
          return n;
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token || !name) {
      toast.error("Please log in to manage your venues.");
      nav("/login");
      return;
    }
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await listVenuesByProfile(name, {
          sort: "created",
          sortOrder: "desc",
          limit: 100,
        });
        if (!alive) return;
        setRows(Array.isArray(list) ? list : []);
      } catch (e) {
        toast.error(e?.message || "Could not load your venues.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token, name, nav]);

  function openModal() {
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        n.set("create", "1");
        return n;
      },
      { replace: false }
    );
  }
  function closeModal() {
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        n.delete("create");
        return n;
      },
      { replace: false }
    );
  }

  function onEdit(venue) {
    setEditing(venue);
  }
  function onDelete(venue) {
    toast.confirm({
      title: "Delete this venue?",
      message: "This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await deleteVenue(venue.id);
          setRows((prev) => prev.filter((v) => v.id !== venue.id));
          toast.miniSuccess("Venue deleted.");
        } catch (e) {
          toast.error(e?.message || "Could not delete venue.");
        }
      },
    });
  }

  const hasVenues = rows.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* match MyBookings: left-aligned heading + subtext */}
      <h1 className="font-higuen text-white text-3xl font-bold">My venues</h1>
      <p className="mt-1 text-white/90 font-semibold">
        Create and manage your spaces.
      </p>

      {/* centered primary action ONLY */}
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={openModal} className="btn btn-pink">
          Create venue
        </button>
      </div>

      {/* always show the count */}
      <div className="mt-2 text-white/80 text-sm">Venues: {rows.length}</div>

      {/* loading skeleton */}
      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-white/40 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasVenues && (
        <div className="mt-6 rounded-2xl bg-white shadow-md ring-1 ring-black/5 p-6">
          <p className="text-ink">You haven’t created any venues yet.</p>
        </div>
      )}

      {/* Venues list */}
      {!loading && hasVenues && (
        <section className="mt-6 rounded-2xl bg-white shadow-md ring-1 ring-black/5 p-4 sm:p-5">
          <h2 className="font-arsenal font-semibold text-xl text-ink">Your venues</h2>
          <ul className="mt-3 space-y-3">
            {rows.map((v) => (
              <VenueRow
                key={v.id}
                venue={v}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Create (reuse modal) */}
      <CreateVenueModal
        open={openCreate}
        onClose={closeModal}
        onSaved={(v) => setRows((list) => [v, ...list])} // prepend newly created
      />

      {/* Edit (reuse modal) */}
      <CreateVenueModal
        open={!!editing}
        onClose={() => setEditing(null)}
        initial={editing}
        mode="edit"
        onSaved={(v) => {
          setRows((list) => list.map((it) => (it.id === v.id ? v : it)));
          setEditing(null);
        }}
      />
    </main>
  );
}
