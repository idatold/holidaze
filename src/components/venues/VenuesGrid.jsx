// src/components/venues/VenuesGrid.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "@/lib/toast";
import { listVenues, searchVenues, getVenue } from "@/lib/api";
import VenueCard from "./VenueCard";

const PAGE_SIZE = 12;

/* ───────── helpers ───────── */
function toISODate(d) {
  if (!d) return null;
  if (d instanceof Date && !isNaN(d)) return d.toISOString().slice(0, 10);
  if (typeof d === "string") return d.slice(0, 10);
  return null;
}
// inclusive on both ends for string YYYY-MM-DD comparisons
function rangesOverlap(aFrom, aTo, bFrom, bTo) {
  return !(aTo < bFrom || aFrom > bTo);
}
function dayBefore(iso) {
  if (!iso) return iso;
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
async function mapWithLimit(items, limit, mapper) {
  const out = new Array(items.length);
  let i = 0,
    active = 0;
  return await new Promise((resolve, reject) => {
    const pump = () => {
      while (active < limit && i < items.length) {
        const idx = i++;
        active++;
        Promise.resolve(mapper(items[idx], idx))
          .then((res) => (out[idx] = res))
          .catch(reject)
          .finally(() => {
            active--;
            if (i >= items.length && active === 0) resolve(out);
            else pump();
          });
      }
    };
    pump();
  });
}
const hasBookings = (v) => Array.isArray(v?.bookings);

/* ───────── component ───────── */
export default function VenuesGrid({
  q = "",
  dateFrom = null,
  dateTo = null,
  sort = "created",    // ⬅️ NEW (from parent)
  sortOrder = "desc",  // ⬅️ NEW (from parent)
}) {
  const isSearching = useMemo(() => q.trim().length > 0, [q]);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const haveRange = useMemo(
    () => dateFrom instanceof Date && dateTo instanceof Date,
    [dateFrom, dateTo]
  );
  const normFrom = useMemo(() => toISODate(dateFrom), [dateFrom]);
  const normTo = useMemo(() => toISODate(dateTo), [dateTo]);

  async function fetchBasePage(page = 1) {
    const args = {
      page,
      limit: PAGE_SIZE,
      sort,
      sortOrder,
      // Hint the API to include bookings when we actually need them.
      // Your api.js should translate this to `_bookings=true`.
      includeBookings: haveRange,
    };
    return isSearching ? await searchVenues(q.trim(), args) : await listVenues(args);
  }

  async function enrichAndFilter(list) {
    if (!list?.length) return [];

    // If API already included bookings for us, no N+1 needed.
    const input =
      haveRange && !hasBookings(list[0])
        ? await mapWithLimit(list, 4, async (v) => {
            try {
              const full = await getVenue(v.id, { includeBookings: true });
              return full?.data || v;
            } catch {
              return v; // fail-soft
            }
          })
        : list;

    if (!haveRange) return input;

    // normalize requested range to exclusive checkout (end becomes previous day)
    const reqFrom = normFrom;
    const reqToIncl = dayBefore(normTo);

    return input.filter((v) => {
      const bookings = Array.isArray(v?.bookings) ? v.bookings : [];
      for (const b of bookings) {
        const bFrom = (b?.dateFrom || "").slice(0, 10);
        const bToIncl = dayBefore((b?.dateTo || "").slice(0, 10));
        if (!bFrom || !bToIncl) continue;
        if (rangesOverlap(reqFrom, reqToIncl, bFrom, bToIncl)) {
          return false;
        }
      }
      return true;
    });
  }

  // Fetch first page; if dates are set, auto-pull more pages until we fill PAGE_SIZE or run out.
  async function fetchInitial() {
    try {
      setLoading(true);
      setItems([]);
      setMeta(null);

      let page = 1;
      let acc = [];
      let metaLocal = null;
      const seen = new Set();

      while (true) {
        const { data, meta } = await fetchBasePage(page);
        metaLocal = meta || null;

        const filtered = await enrichAndFilter(data || []);
        for (const v of filtered) {
          if (!seen.has(v.id)) {
            acc.push(v);
            seen.add(v.id);
          }
        }

        const haveEnough = haveRange ? acc.length >= PAGE_SIZE : true;
        const hasNext = !!meta?.nextPage;

        if (haveEnough || !hasNext) break;
        page = meta.nextPage;
      }

      setItems(acc);
      setMeta(metaLocal);
    } catch (e) {
      toast.error(e?.message || "Couldn’t load venues");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function fetchMore() {
    if (!meta?.nextPage) return;
    try {
      setLoadingMore(true);
      const { data, meta: newMeta } = await fetchBasePage(meta.nextPage);
      const filtered = await enrichAndFilter(data || []);
      // dedupe on append
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const add = filtered.filter((v) => !seen.has(v.id));
        return [...prev, ...add];
      });
      setMeta(newMeta || null);
    } catch (e) {
      toast.error(e?.message || "Couldn’t load more venues");
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, q, normFrom, normTo, sort, sortOrder]);

  const canLoadMore = !!meta?.nextPage;

  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-[5px] border border-zinc-200 bg-zinc-100"
          />
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <p className="text-zinc-600">
        {haveRange ? "No available venues for that date range." : "No venues found."}
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="btn btn-outline-pink px-6 py-2"
          disabled={!canLoadMore || loadingMore}
          onClick={fetchMore}
        >
          {loadingMore ? "Loading…" : canLoadMore ? "Load more" : "No more results"}
        </button>
      </div>
    </>
  );
}
