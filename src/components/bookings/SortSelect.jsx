export default function SortSelect({ value, onChange, label = "Sort" }) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600">
      <span className="hidden sm:inline">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
      >
        <option value="startAsc">Start date ↑</option>
        <option value="startDesc">Start date ↓</option>
        <option value="endAsc">End date ↑</option>
        <option value="endDesc">End date ↓</option>
      </select>
    </label>
  );
}
