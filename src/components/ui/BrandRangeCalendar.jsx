// src/components/ui/BrandRangeCalendar.jsx
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Inline brand range calendar — single month, no outer ring.
 * It adds `hz-day-booked` (+ edge helpers) to days inside `excludeDateIntervals`
 * so you can style booked days via CSS without !important.
 */
export default function BrandRangeCalendar({
  value = [null, null],
  onChange,
  minDate,
  excludeDateIntervals,   // [{ start: Date, end: Date }]
  excludeDates,
  className = "",
  calendarClassName = "",
  ...rest
}) {
  const [startDate, endDate] = value;

  // Normalize intervals once: start-of-day ms timestamps
  const intervals = Array.isArray(excludeDateIntervals)
    ? excludeDateIntervals
        .map((iv) => ({
          s: startOfDay(iv?.start)?.getTime?.() ?? NaN,
          e: startOfDay(iv?.end)?.getTime?.() ?? NaN,
        }))
        .filter((iv) => Number.isFinite(iv.s) && Number.isFinite(iv.e) && iv.e >= iv.s)
    : [];

  function dayClassName(date) {
    const t = startOfDay(date).getTime();
    for (const iv of intervals) {
      if (t >= iv.s && t <= iv.e) {
        let edge = "";
        if (t === iv.s) edge = " hz-day-booked-edge-start";
        else if (t === iv.e) edge = " hz-day-booked-edge-end";
        return "font-arsenal hz-day-booked" + edge;
      }
    }
    return "font-arsenal";
  }

  return (
    <div className={`rounded-[5px] overflow-hidden ${className}`}>
      <ReactDatePicker
        inline
        selectsRange
        shouldCloseOnSelect={false}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        minDate={minDate}
        monthsShown={1}                          // one month only
        excludeDateIntervals={excludeDateIntervals}
        excludeDates={excludeDates}
        calendarClassName={`hz-datepicker ${calendarClassName}`} // uses your branded styles
        dayClassName={dayClassName}
        {...rest}
      />
    </div>
  );
}

/* utils */
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
