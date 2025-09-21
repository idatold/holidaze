// src/routes/Venues.jsx
import { useState } from "react";
import VenuesHero from "@/components/venues/VenuesHero.jsx";
import VenuesGrid from "@/components/venues/VenuesGrid.jsx";

export default function Venues() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [range, setRange] = useState({ dateFrom: null, dateTo: null });

  function onSubmit(_e, payload) {
    // payload is { dateFrom, dateTo } from the hero
    setSubmitted(q.trim());
    if (payload) {
      setRange({
        dateFrom: payload.dateFrom ?? null,
        dateTo: payload.dateTo ?? null,
      });
    }
  }

  return (
    <div className="supports-[overflow:clip]:overflow-x-clip overflow-x-hidden">
      <VenuesHero q={q} onQChange={setQ} onSubmit={onSubmit} fullBleed />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        {/* dates are consumed by VenuesGrid for availability filtering */}
        <VenuesGrid
          key={`${submitted}|${range.dateFrom ?? ""}|${range.dateTo ?? ""}`}
          q={submitted}
          dateFrom={range.dateFrom}
          dateTo={range.dateTo}
        />
      </main>
    </div>
  );
}
