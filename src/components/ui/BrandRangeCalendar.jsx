import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BrandRangeCalendar({
  value = [null, null],
  onChange,
  minDate,
  excludeDateIntervals,
  excludeDates,
  className = "",
  calendarClassName = "",
  ...rest
}) {
  const [startDate, endDate] = value;

  const intervals = Array.isArray(excludeDateIntervals)
    ? excludeDateIntervals
        .map((iv) => ({
          s: startOfDay(iv?.start)?.getTime?.() ?? NaN,
          e: startOfDay(iv?.end)?.getTime?.() ?? NaN,
        }))
        .filter(
          (iv) => Number.isFinite(iv.s) && Number.isFinite(iv.e) && iv.e >= iv.s
        )
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
        monthsShown={1}
        excludeDateIntervals={excludeDateIntervals}
        excludeDates={excludeDates}
        calendarClassName={`hz-datepicker ${calendarClassName}`}
        dayClassName={dayClassName}
        {...rest}
      />
    </div>
  );
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
