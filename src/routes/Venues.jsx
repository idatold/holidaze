// src/routes/Venues.jsx
import { useState, useCallback, useMemo } from "react";
import VenuesHero from "@/components/venues/VenuesHero.jsx";
import VenuesGrid from "@/components/venues/VenuesGrid.jsx";
import TopVenuesCarousel from "@/components/venues/TopVenuesCarousel.jsx";
import SortSelect from "@/components/ui/SortSelect.jsx"; // ⬅️ tiny dropdown

export default function Venues() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [range, setRange] = useState({ dateFrom: null, dateTo: null });

  // NEW: sort UI state (default: newest first)
  const [sortUI, setSortUI] = useState("newDesc");

  const normalizeQuery = (s) => s.trim().replace(/\s+/g, " ");
  const toKeyPart = (d) => {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(d) : d;
    return isNaN(dt) ? "" : dt.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const onSubmit = useCallback(
    (_e, payload) => {
      setSubmitted(normalizeQuery(q));
      const next = payload ?? { dateFrom: null, dateTo: null }; // clear if no dates submitted
      setRange({
        dateFrom: next.dateFrom ?? null,
        dateTo: next.dateTo ?? null,
      });
    },
    [q]
  );

  // map UI value → API sort params
  const sortParams = useMemo(() => {
    switch (sortUI) {
      case "newAsc":
        return { sort: "created", sortOrder: "asc" };
      case "priceAsc":
        return { sort: "price", sortOrder: "asc" };
      case "priceDesc":
        return { sort: "price", sortOrder: "desc" };
      case "newDesc":
      default:
        return { sort: "created", sortOrder: "desc" };
    }
  }, [sortUI]);

  // include sortUI in key so the grid remounts/refetches on sort changes
  const gridKey = useMemo(
    () =>
      `${submitted}|${toKeyPart(range.dateFrom)}|${toKeyPart(
        range.dateTo
      )}|${sortUI}`,
    [submitted, range.dateFrom, range.dateTo, sortUI]
  );

  return (
    <div className="supports-[overflow:clip]:overflow-x-clip overflow-x-hidden">
      <VenuesHero q={q} onQChange={setQ} onSubmit={onSubmit} fullBleed />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {/* Top 5 popular venues (Top rated / Most booked) */}
        <TopVenuesCarousel />

        {/* tiny right-aligned sort dropdown */}
        <div className="mb-4 flex justify-end">
          <SortSelect value={sortUI} onChange={setSortUI} />
        </div>

        {/* dates are consumed by VenuesGrid for availability filtering */}
        <VenuesGrid
          key={gridKey}
          q={submitted}
          dateFrom={range.dateFrom}
          dateTo={range.dateTo}
          sort={sortParams.sort}
          sortOrder={sortParams.sortOrder}
        />
      </main>
    </div>
  );
}
