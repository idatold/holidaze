import { useState } from "react";
import toast from "@/lib/toast";
import VenuesHero from "@/components/venues/VenuesHero.jsx";

export default function Venues() {
  const [q, setQ] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    toast.info(q ? `Searching for "${q}"…` : "Loading venues…");
    // step 2 will hook real fetching here
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
      <VenuesHero q={q} onQChange={setQ} onSubmit={onSubmit} />
      <section className="mt-8 text-zinc-600">Venues list coming next…</section>
    </main>
  );
}
