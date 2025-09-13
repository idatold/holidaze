// src/components/profile/BookingsPanel.jsx
import { Link } from "react-router-dom";

function EmptyState({ text, cta }) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#006492]/30 p-4 text-center text-sm text-ocean/80">
      <p>{text}</p>
      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
}

export default function BookingsPanel() {
  return (
    <section>
      <h2 className="mb-2 text-center font-higuen text-ocean text-xl">My bookings</h2>
      <EmptyState
        text="No bookings yet."
        cta={<Link to="/venues" className="underline text-ocean">Browse venues</Link>}
      />
    </section>
  );
}
