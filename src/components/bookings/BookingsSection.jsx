// src/components/bookings/BookingsSection.jsx
/**
 * White card section with a header and a list grid.
 *
 * Props:
 * - id: string (for aria-labelledby)
 * - title: string
 * - count: number
 * - items: any[]
 * - hiddenWhenEmpty?: boolean = true
 * - emptyText?: string
 * - actions?: ReactNode (appears in header on the right)
 * - children: list items (<li>…</li>) rendered inside a <ul>
 */
export default function BookingsSection({
  id,
  title,
  count = 0,
  items = [],
  hiddenWhenEmpty = true,
  emptyText = "No items.",
  actions = null,
  children,
}) {
  if (hiddenWhenEmpty && items.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby={id}>
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-black/5">
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200">
          {/* 👇 Arsenal font applied */}
          <h2 id={id} className="font-arsenal text-xl font-semibold text-ink">
            {title}
          </h2>
          <div className="flex items-center gap-3">
            {actions}
            <span className="text-sm text-zinc-600">{count}</span>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="p-6 text-zinc-600">{emptyText}</div>
        ) : (
          <ul className="grid gap-3 p-3 sm:p-4">
            {children}
          </ul>
        )}
      </div>
    </section>
  );
}
