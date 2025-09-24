export default function Spinner({
  size = "md",
  className = "",
  label = "Loading…",
}) {
  const dim = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-5 w-5";

  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <span
        aria-hidden="true"
        className={[
          "inline-block animate-spin rounded-full",
          "border-2 border-zinc-300 border-t-[#D23393]",
          dim,
          className,
        ].join(" ")}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
