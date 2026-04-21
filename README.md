# Holidaze 🏝️

[![Vite](https://img.shields.io/badge/build-Vite-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/router-React%20Router%20v6-CA4245.svg?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/css-Tailwind-38BDF8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-000.svg)](#license)

A modern venue booking app built with **React + Vite**, styled with **Tailwind**, and powered by the **Noroff Holidaze v2 API**. Search venues, view details, check availability, and book your stay. Manage your profile, bookings, and venues with a clean, responsive UI.

**Live demo:** (https://holidazeidatold.netlify.app/) 
**API docs:** https://v2.api.noroff.dev/docs

---

## ✨ Highlights

- 🔐 **Auth**: Register & log in (Noroff rules: `@stud.noroff.no`, min 8 char password)
- 🏠 **Browse Venues**: Search, paginate, view details, amenities & location
- 📅 **Availability**: Date-range picker disables booked days; min 1 night
- ⭐ **Top Venues Carousel**: Shows **top 5** (by rating / popularity) — **3 visible** at a time, responsive
- ↕️ **Sorting**: Newest/Oldest and Price Low/High (tiny dropdown)
- 👤 **Profile**: Update avatar/banner, bio, venue manager toggle
- 🧳 **Bookings**: Upcoming/past carousels; cancel bookings
- 🏗️ **My Venues**: Create, edit, delete, quick row UI
- 🔔 **Toasts**: Branded success/error/confirm; sizes match message content
- 🧭 **Routing**: `React Router v6` with guarded routes and scroll-to-top
- ⚡ **Fast UX**: Axios instance, localStorage cache for token/profile, global AUTH change events

---

## 🧱 Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS
- **UI**: React-Toastify, React DatePicker
- **Data**: Axios (with interceptors), Noroff Holidaze v2 API
- **State**: Local storage + small event bus (`AUTH_CHANGED_EVENT`)
- **Build/Deploy**: Vite, Netlify (recommended)

---

## 🖼️ Features in Detail

### Venues List

- 🔎 Search by name/description
- 📅 Date‐range availability filter (checkout is **exclusive**)
- ↕️ Sorting: **Newest/Oldest** and **Price Low/High**
- 📄 Pagination with “Load more”
- 🧩 Venue cards show image, rating, price/night, amenities, guests

### Top Venues Carousel

- ⭐ Shows **top 5** venues by rating (fallback popularity heuristic)
- 🖥️ Displays **3 cards** at a time on desktop, shrinks nicely on mobile
- ⬅️ ➡️ Keyboard/tap friendly arrows + dots

### Venue Page

- 🖼️ Gallery with lightbox
- ⭐ Rating, amenities, location chip, price
- 👤 Owner chip (non-clickable here)
- 📖 Sections: info, description, amenities, map
- 🗓️ Booking panel: disables booked days; min 1 night; requires login

### Profile

- 🖼️ Edit avatar & banner (URL validation + preview)
- 🔀 Venue manager toggle (confirm modal)
- 🎠 Bookings panel: upcoming/past carousels with cancel
- 🎠 My venues carousel: latest 6 venues (only for managers)

## 💌 From me

Thanks for checking out **Holidaze** — this was a super fun project to build!  
Built with love, too many coffees, and a tiny sprinkle of chaos. 😄

— _Ida_
