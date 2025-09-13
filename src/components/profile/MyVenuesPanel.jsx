// src/components/profile/MyVenuesPanel.jsx
import { Link } from "react-router-dom";

function EmptyState({ text, cta }) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#006492]/30 p-4 text-center text-sm text-ocean/80">
      <p>{text}</p>
      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
}

export default function MyVenuesPanel({ isManager }) {
  return (
    <section>
      <h2 className="mb-2 text-center font-higuen text-ocean text-xl">My venues</h2>
      {isManager ? (
        <EmptyState
          text="You haven’t created any venues yet."
          cta={<Link to="/venues/create" className="btn btn-pink mt-2">Create venue</Link>}
        />
      ) : (
        <p className="text-center text-sm text-ocean/80">
          Enable “Venue manager” to list your spaces.
        </p>
      )}
    </section>
  );
}
