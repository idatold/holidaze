export default function SortSelect({ value, onChange, label = "Sort" }) {
  // normalize legacy values so UI stays consistent
  const normValue =
    value === "endAsc" ? "startAsc" :
    value === "endDesc" ? "startDesc" :
    value || "startAsc";

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600">
      <span className="hidden sm:inline">{label}:</span>
      <select
        value={normValue}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm focus:outline-none "
      >
        <option value="startAsc">Start date ↑</option>
        <option value="startDesc">Start date ↓</option>
      </select>
    </label>
  );
}
