import { forwardRef, useId } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PinkInput = forwardRef(function PinkInput(
  { value, onClick, placeholder, className, onChange, readOnly = true },
  ref
) {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        value={value || ""}
        onChange={onChange}
        onClick={onClick}
        placeholder={placeholder}
        className={`input-hero control-12 w-full pr-10 ${className || ""}`}
        readOnly={readOnly}
      />
      <button
        type="button"
        onClick={onClick}
        aria-label="Open calendar"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#D23393] rounded-[5px] focus:outline-none"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M7 2v3M17 2v3M3 9h18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x="3"
            y="6"
            width="18"
            height="15"
            rx="2"
            ry="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </button>
    </div>
  );
});

export default function BrandDatePicker({
  label,
  selected,
  onChange,
  placeholder = "dd/mm/yyyy",
  className = "",
}) {
  const id = useId();

  return (
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
        onChangeRaw={(e) => e.preventDefault()}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        wrapperClassName="w-full"
        customInput={<PinkInput className="w-full" readOnly />}
        calendarClassName="hz-datepicker"
        popperClassName="hz-popper"
        popperPlacement="bottom-start"
        shouldCloseOnSelect
        popperContainer={({ children }) =>
          // SSR-safe portal
          typeof document === "undefined"
            ? null
            : createPortal(children, document.body)
        }
      />
    </div>
  );
}
