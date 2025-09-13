import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/routes/Home.jsx";
import Login from "@/routes/Auth/Login.jsx";
import Register from "@/routes/Auth/Register.jsx";
import Venues from "@/routes/Venues.jsx";
import Venue from "@/routes/Venue.jsx";
import Profile from "@/routes/Profile.jsx";
import DefaultLayout from "@/layouts/DefaultLayout.jsx";
import PlainLayout from "@/layouts/PlainLayout.jsx";
import RequireAuth from "@/routes/guards/RequireAuth.jsx"; // 👈 add this

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home: NO layout */}
        <Route index element={<Home />} />

        {/* Gradient + padded pages */}
        <Route element={<DefaultLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Route>

        {/* Full-bleed pages */}
        <Route element={<PlainLayout />}>
          <Route path="venues" element={<Venues />} />
          <Route path="venues/:id" element={<Venue />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
