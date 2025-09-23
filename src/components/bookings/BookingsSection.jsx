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
      {/* clean card: no outer ring, just a soft shadow */}
      <div className="rounded-2xl bg-white shadow-md">
        <header
          className="
            flex items-center justify-between px-4 sm:px-6 py-4
            border-b
            [border-color:rgba(210,51,147,.25)]   /* subtle brand-pink divider */
          "
        >
          {/* Arsenal section title, black ink */}
          <h2 id={id} className="font-arsenal text-xl font-semibold text-ink">
            {title}
          </h2>

          <div className="flex items-center gap-3">
            {actions}
            <span className="text-sm text-ink/70">{count}</span>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="p-6 text-ink/70">{emptyText}</div>
        ) : (
          <ul className="grid gap-3 p-3 sm:p-4">{children}</ul>
        )}
      </div>
    </section>
  );
}
