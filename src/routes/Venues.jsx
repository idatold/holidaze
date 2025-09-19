import { useState } from "react";
import VenuesHero from "@/components/venues/VenuesHero.jsx";
import VenuesGrid from "@/components/venues/VenuesGrid.jsx";

export default function Venues() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(q.trim());
  }

  return (
    <>
      <VenuesHero q={q} onQChange={setQ} onSubmit={onSubmit} fullBleed />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <VenuesGrid q={submitted} />
      </main>
    </>
  );
}
