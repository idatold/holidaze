Holidaze — React + Noroff v2

A small booking app where users can browse venues, book stays, and (if they’re venue managers) create and manage venues. Built with React + Vite, React Router v6, Tailwind, Axios, and React-Toastify — and talks to the Noroff v2 Holidaze API.

✨ Features

Public:

Landing page with video/image hero

Venues listing with search, date filters, paging

Venue detail with gallery, amenities, map & rating

Auth:

Register (Noroff student email required)

Login (stores access token + basic profile in localStorage)

Authed:

My Bookings (active/past, sortable, cancel)

Profile (edit avatar/header via URL, toggle Venue Manager)

My Venues (create/edit/delete venues)

Nice UX:

Toast notifications (success/error/confirm)

Scroll restored to top on route change

Date pickers with brand styling and portal (no clipping)

Booking calendar blocks existing bookings and enforces min 1 night

🧱 Tech Stack

React + Vite

React Router v6

Tailwind CSS

Axios (configured instance with token + API key headers)

React-Toastify (custom branded wrapper)

React-Datepicker (single + range pickers)

Aliased imports via @/ (e.g. @/lib/api)

🚀 Getting Started
# 1) Install
npm install

# 2) Configure env (see below)
cp .env.example .env.local   # then edit values

# 3) Run dev
npm run dev

# 4) Build
npm run build
npm run preview

Environment Variables

You can point at Noroff v2 without changing code. These are supported:

# Axios base for generic & holidaze helpers
VITE_API_URL=https://v2.api.noroff.dev
# or legacy name accepted by api.js
VITE_API_BASE=https://v2.api.noroff.dev

# Base used by authApi.js (auth + holidaze)
VITE_API_BASE_URL=https://v2.api.noroff.dev

# Optional: Noroff API key header
VITE_NOROFF_API_KEY=your_api_key_here


Both api.js and authApi.js normalize trailing slashes. Holidaze paths are safely prefixed (no double /holidaze).

🗂️ Project Structure (high-level)
src/
  assets/               # images, icons
  components/
    bookings/           # BookingsSection, BookingRow, SortSelect
    nav/                # Navbar
    profile/            # Profile components (media, carousels, etc.)
    ui/                 # Modal, CollapseSection, BrandDatePicker, ...
    venues/             # VenueCard, Gallery, BookingPanel, ...
  layouts/
    DefaultLayout.jsx   # gradient bg + navbar + footer
    PlainLayout.jsx     # full-bleed pages
  lib/
    api.js              # axios instance + venue list/search/get
    auth.js             # localStorage + auth change event helpers
    authApi.js          # register/login/profile/updates
    bookings.js         # create & delete bookings
    venues.js           # create/update/delete/list-by-profile
    http.js             # minimal fetch helper (token + API key)
    toast.jsx           # brand toast wrappers (success/error/confirm)
  routes/
    Auth/               # Login, Register, NotFound
    guards/RequireAuth.jsx
    Home.jsx
    MyBookings.jsx
    MyVenues.jsx
    Profile.jsx
    Venue.jsx
    Venues.jsx
  App.jsx               # routes + ScrollToTop + ToastContainers
  main.jsx
  index.css             # Tailwind + toast CSS hooks

🧭 Routing & Layouts

App.jsx

Two ToastContainers:

Bottom-right for standard toasts

Centered for confirm dialogs

ScrollToTop (listens to useLocation() and window.scrollTo(0,0) on pathname change)

Routes:

/ → Home (no layout)

DefaultLayout → /login, /register, /profile, /bookings, /my-venues, * (404)

PlainLayout → /venues, /venues/:id and legacy /venue/:id

RequireAuth guards /profile, /bookings, /my-venues.

Layouts

DefaultLayout: gradient bg, Navbar, padded <main>, Footer

PlainLayout: full-bleed hero pages (no extra padding)

🔐 Auth Flow

loginUser → returns { accessToken, name, email, avatar, banner, venueManager }

storeAccessToken(token) + storeProfileBasics({...})

Global event: emitAuthChange() (string constant AUTH_CHANGED_EVENT)

Navbar & Footer react instantly to login/logout in the same tab

RequireAuth redirects to /login and keeps state.from so you can redirect back if desired

clearAuth() removes token & cached basics and emits the global event

🌐 API Layer

All network calls go through the Axios instance created in src/lib/api.js:

Adds Authorization: Bearer <token> if present

Adds X-Noroff-API-Key if configured

Normalizes base URL & safely prefixes /holidaze (no doubles)

Helpers

api.js

listVenues({ page, limit, sort, sortOrder, includeOwner, includeBookings })

searchVenues(q, sameParamsAsAbove)

getVenue(id, { includeOwner = true, includeBookings = false })

listTopRatedVenues({ limit })

authApi.js

registerUser({ name, email, password, venueManager })

loginUser({ email, password })

getMyProfile(name, { bookings, venues })

updateProfileMedia(name, { avatarUrl, coverUrl, venueManager, bio })

updateVenueManagerStatus(name, { venueManager })

bookings.js

createBooking({ venueId, dateFrom, dateTo, guests })

deleteBooking(bookingId)

venues.js

createVenue(payload)

updateVenue(id, payload)

deleteVenue(id)

listVenuesByProfile(name, { page, limit, sort, sortOrder, includeBookings })

normalizeVenueBody cleans media, clamps rating to 0..5, validates numbers

🧩 UI Highlights

Modal: hazy white backdrop with blur; Esc/outer-click to close; internal scroll

BrandDatePicker: pink input with calendar icon, portal to document.body

BrandRangeCalendar: striped disabled days for existing bookings; edges highlighted

BrandStars: 0.5 increments, custom pink/gray SVG

CollapseSection: animated height + localStorage persistence (persistKey)

Footer: shows Profile or Login link based on auth; listens to storage + AUTH_CHANGED_EVENT

🏨 Venues & Booking UX

VenuesHero: full-bleed header with search + 2 date pickers; submits up

VenuesGrid

PAGE_SIZE=12

If a date range is set: pulls detailed venue pages with bookings in parallel (limited concurrency) and filters out venues overlapping your requested range

“Load more” uses the next page meta

Venue.jsx

Loads getVenue with _owner + _bookings

Gallery (thumbnails + lightbox + keyboard arrows + close)

OwnerChip shows host without linking (we pass linkBase="")

BookingPanel

Disables existing bookings from check-in .. day-before check-out

Enforces minimum 1 night

On success, redirects to /bookings

🧳 Bookings & Profile

MyBookings

Fetches /profiles/:name/bookings?_venue

Splits into Active (not expired) and Past

Sorts by start/end asc/desc

Cancel uses deleteBooking + confirmation toast

Profile

ProfileMedia updates avatar/header by URL (with previews & hi-DPI helpers)

VenueManagerToggle updates status with confirmation

BookingsPanel carousels: upcoming/past (6 each)

VenuesCarouselPanel (only for managers): latest 6 venues

🔔 Toasts

src/lib/toast.jsx wraps Toastify with brand styles:

toast.success, toast.error, toast.info

toast.miniSuccess (compact success)

toast.confirm({...}) (centered dialog with actions)

Two ToastContainers configured in App.jsx (bottom-right & centered)

♿ Accessibility & UX Notes

Buttons/links have labels; keyboard shortcuts for gallery/lightbox (Esc/Arrows)

Datepicker popper uses a portal to avoid clipping under overflow

Scroll resets on navigation (ScrollToTop)

Owner profile not navigable from venue detail (no profile page)

🧹 Code Style / ESLint

Common pattern: if a prop is required by the parent but not used directly (e.g. venueId in BookingPanel), prefix it with _ or remove it to silence no-unused-vars.

Utility functions (date math, NOK formatters) are colocated near usage for clarity.

Tailwind utilities + a small set of btn design-system classes keep styles consistent.

🧪 Troubleshooting

CORS/401: ensure your VITE_NOROFF_API_KEY is valid (if required by your project) and you’re sending a token for protected routes.

Double /holidaze: the helpers guard against this; make sure your base env doesn’t already include /holidaze if you change code.

Calendar clipping: we already portal the popper to document.body.

Owner link showing: pass linkBase="" to OwnerChip (already done in Venue.jsx).

📦 Build & Deploy

npm run build → static assets under dist/

Any static host works (Vercel/Netlify/etc.).
Ensure VITE_* envs are set in your host’s dashboard.

📄 License

MIT (or your preference). Replace this section if needed.