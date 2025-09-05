import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/routes/Home.jsx";
import Login from "@/routes/Auth/Login.jsx";
import Register from "@/routes/Auth/Register.jsx";
import Venues from "@/routes/Venues.jsx";
import Venue from "@/routes/Venue.jsx";
import DefaultLayout from "@/layouts/DefaultLayout.jsx"; // gradient
import PlainLayout from "@/layouts/PlainLayout.jsx";     // plain

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home: NO layout */}
        <Route index element={<Home />} />

        {/* Pages WITH gradient */}
        <Route element={<DefaultLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* add other gradient pages here */}
        </Route>

        {/* Pages WITHOUT gradient */}
        <Route element={<PlainLayout />}>
          <Route path="venues" element={<Venues />} />
          <Route path="venues/:id" element={<Venue />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
