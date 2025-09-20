import { forwardRef, useId } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/** Our input with a trailing calendar icon that opens the picker */
const PinkInput = forwardRef(function PinkInput(
  { value, onClick, placeholder, className, onChange },
  ref
) {
  return (
    // make the container full width so absolute icon aligns correctly
    <div className="relative w-full">
      <input
        ref={ref}
        value={value || ""}
        onChange={onChange}
        onClick={onClick}
        placeholder={placeholder}
        className={`input-hero control-12 w-full pr-10 ${className || ""}`}
      />
      <button
        type="button"
        onClick={onClick}
        aria-label="Open calendar"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#D23393] rounded-[5px] focus:outline-none"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M7 2v3M17 2v3M3 9h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="3" y="6" width="18" height="15" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>
    </div>
  );
});

/** Brand-styled single date picker (white bg, pink ring, 5px radius, Arsenal) */
export default function BrandDatePicker({
  label,
  selected,
  onChange,
  placeholder = "dd/mm/yyyy",
  className = "",
}) {
  const id = useId();

  return (
    // was: inline-block —> block w-full on mobile, auto on sm+
    <div className={`block w-full sm:w-auto ${className}`}>
      {label && (
        <label htmlFor={id} className="sr-only font-arsenal">
          {label}
        </label>
      )}

      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        /* makes react-datepicker's outer wrapper stretch too */
        wrapperClassName="w-full"
        /* Use our custom input so styles & icon are consistent */
        customInput={<PinkInput className="w-full" />}
        calendarClassName="hz-datepicker"   /* white card, pink ring, 5px */
        popperClassName="hz-popper"
        popperPlacement="bottom-start"
        shouldCloseOnSelect
        /* Portal so it never gets clipped by hero overflow */
        popperContainer={({ children }) => createPortal(children, document.body)}
      />
    </div>
  );
}
