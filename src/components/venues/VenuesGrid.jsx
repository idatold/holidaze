import { useEffect, useMemo, useState } from "react";
import toast from "@/lib/toast";
import { listVenues, searchVenues } from "@/lib/api";
import VenueCard from "./VenueCard";

const PAGE_SIZE = 12;

export default function VenuesGrid({ q = "" }) {
  const isSearching = useMemo(() => q.trim().length > 0, [q]);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  async function fetchPage(page = 1, append = false) {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const args = { page, limit: PAGE_SIZE, sort: "created", sortOrder: "desc" };
      const { data, meta } = isSearching
        ? await searchVenues(q.trim(), args)
        : await listVenues(args);
      setMeta(meta || null);
      setItems((prev) => (append ? [...prev, ...(data || [])] : data || []));
    } catch (e) {
      toast.error(e?.message || "Couldn’t load venues");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, q]);

  const canLoadMore = !!meta?.nextPage;

  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={i} className="h-72 rounded-[5px] bg-zinc-100 border border-zinc-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return <p className="text-zinc-600">No venues found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="btn btn-outline-pink px-6 py-2"
          disabled={!canLoadMore || loadingMore}
          onClick={() => fetchPage(meta.nextPage, true)}
        >
          {loadingMore ? "Loading…" : canLoadMore ? "Load more" : "No more results"}
        </button>
      </div>
    </>
  );
}
