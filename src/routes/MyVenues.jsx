import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getStoredName, getAccessToken } from "@/lib/auth";
import { listVenuesByProfile, deleteVenue } from "@/lib/venues";
import toast from "@/lib/toast";
import CreateVenueModal from "@/components/venues/CreateVenueModal";
import VenueRow from "@/components/venues/VenueRow.jsx";

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
            <div key={i} className="h-24 rounded-2xl bg-white/40 animate-pulse" />
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
              <VenueRow key={v.id} venue={v} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      )}

      {/* Create (reuse modal) */}
      <CreateVenueModal
        open={openCreate}
        onClose={closeModal}
        onSaved={(v) => setRows((list) => [v, ...list])}
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
