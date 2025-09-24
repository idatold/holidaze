// src/components/ui/SortSelect.jsx
export default function SortSelect({ value, onChange, className = "" }) {
  return (
    <label className={["flex items-center gap-2 text-sm text-zinc-600", className].join(" ")}>
      <span className="hidden sm:inline">Sort:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort venues"
        className="rounded-[5px] border border-[#D23393] bg-white px-2 py-1 text-sm focus:outline-none"
      >
        <option value="newDesc">Newest → Oldest</option>
        <option value="newAsc">Oldest → Newest</option>
        <option value="priceAsc">Price: Low → High</option>
        <option value="priceDesc">Price: High → Low</option>
      </select>
    </label>
  );
}
