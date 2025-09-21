// src/components/venues/BookingPanel.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "@/lib/toast";
import BrandRangeCalendar from "@/components/ui/BrandRangeCalendar";

export default function BookingPanel({ venueId, maxGuests = 1, bookings = [], onBook }) {
  const [range, setRange] = useState([null, null]);
  const [startDate, endDate] = range;
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const today = useMemo(() => startOfDay(new Date()), []);

  // Block existing bookings as whole intervals (check-in .. day before check-out)
  const excludeDateIntervals = useMemo(() => {
    return (bookings || [])
      .map((b) => {
        const s = startOfDay(new Date(b?.dateFrom));
        const e = endOfDay(addDays(startOfDay(new Date(b?.dateTo)), -1));
        if (isNaN(s) || isNaN(e) || e < s) return null;
        return { start: s, end: e };
      })
      .filter(Boolean);
  }, [bookings]);

  const canSubmit =
    !!startDate && !!endDate && guests >= 1 && guests <= (maxGuests || 1) && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      await onBook?.({
        dateFrom: toISODate(startDate),
        dateTo: toISODate(endDate),
        guests,
      });
      toast.success("Booking confirmed!");
      setRange([null, null]);
      // 👉 go to My bookings
      navigate("/account/bookings");
    } catch (err) {
      toast.error(err?.message || "Could not complete booking.");
    } finally {
      setSubmitting(false);
    }
  }

  // keep start <= end
  useEffect(() => {
    if (startDate && endDate && endDate < startDate) setRange([endDate, startDate]);
  }, [startDate, endDate]);

  return (
    <section aria-label="Book this venue" className="mt-8">
      <h3 className="text-center text-ocean font-bold text-xl">Book this venue</h3>
      <p className="mt-1 text-center text-sm text-zinc-600">Pick your dates</p>

      <div className="mt-3 flex justify-center">
        <BrandRangeCalendar
          value={range}
          onChange={setRange}
          minDate={today}
          excludeDateIntervals={excludeDateIntervals}
        />
      </div>

      {/* Legend (Booked vs Available vs Selected) */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-zinc-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-[3px] ring-1 ring-zinc-300 bg-white inline-block" />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-[3px] ring-1 ring-[#D23393]/30 bg-[repeating-linear-gradient(45deg,rgba(210,51,147,.12)_0_6px,rgba(210,51,147,.18)_6px_12px)] inline-block" />
          Booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-[3px] bg-white ring-2 ring-[#D23393] inline-block" />
          Selected
        </span>
      </div>

      {/* Selection summary */}
      <div className="mt-3 text-center text-sm text-zinc-700">
        {startDate ? (
          endDate ? (
            <span>
              {fmt(startDate)} → {fmt(endDate)} ({nights(startDate, endDate)} night
              {nights(startDate, endDate) !== 1 ? "s" : ""})
            </span>
          ) : (
            <span>Check-in: {fmt(startDate)} — choose a check-out date</span>
          )
        ) : (
          <span>Select a check-in date</span>
        )}
      </div>

      {/* Guests + submit */}
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex items-center justify-center gap-6 flex-wrap"
      >
        <div className="min-w-[220px]">
          <label className="block text-sm text-zinc-700 mb-2">Guests:</label>
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="btn-icon btn-icon-pink"
              aria-label="Decrease guests"
            >
              <MinusIcon />
            </button>
            <span className="w-8 text-center font-semibold">{guests}</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(maxGuests || 1, g + 1))}
              className="btn-icon btn-icon-pink"
              aria-label="Increase guests"
            >
              <PlusIcon />
            </button>
            <span className="text-xs text-zinc-500 ml-1">
              Max. {maxGuests || 1} guests
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn btn-pink rounded-[5px] px-6 py-3 disabled:opacity-60"
        >
          {submitting ? "Booking…" : "BOOK NOW"}
        </button>
      </form>
    </section>
  );
}

/* helpers */
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d) { const x = new Date(d); x.setHours(23,59,59,999); return x; }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function toISODate(d) { const x = new Date(d); x.setHours(0,0,0,0); return x.toISOString(); }
function fmt(d) { try { return new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(d); } catch { return d.toLocaleDateString(); } }
function nights(a,b){ const ms=startOfDay(b)-startOfDay(a); return Math.max(1,Math.round(ms/86400000)); }

/* icons */
function MinusIcon(){ return(<svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
function PlusIcon(){ return(<svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
