import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/routes/Home.jsx";
import Login from "@/routes/Auth/Login.jsx";
import Register from "@/routes/Auth/Register.jsx";
import Venues from "@/routes/Venues.jsx";
import Venue from "@/routes/Venue.jsx";
import Profile from "@/routes/Profile.jsx";
import MyBookings from "@/routes/MyBookings.jsx";
import DefaultLayout from "@/layouts/DefaultLayout.jsx";
import PlainLayout from "@/layouts/PlainLayout.jsx";
import RequireAuth from "@/routes/guards/RequireAuth.jsx";
import NotFound from "@/routes/Auth/NotFound.jsx";
import MyVenues from "@/routes/MyVenues";

import ScrollToTop from "@/utils/ScrollToTop.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* ensures new routes start at top */}

      {/* Notifications (success/error/info): bottom-right */}
      <ToastContainer
        position="bottom-right"
        theme="light"
        newestOnTop
        closeButton={false}
      />

      {/* Centered confirm toasts (used by toast.confirm) */}
      <ToastContainer
        enableMultiContainer
        containerId="center"
        position="top-center"
        theme="light"
        closeButton={false}
        limit={3}
        className="!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !p-0"
      />

      <Routes>
        
        <Route index element={<Home />} />

        
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
        
          <Route
            path="bookings"
            element={
              <RequireAuth>
                <MyBookings />
              </RequireAuth>
            }
          />
        
          <Route
            path="my-venues"
            element={
              <RequireAuth>
                <MyVenues />
              </RequireAuth>
            }
          />
        </Route>

     
        <Route element={<PlainLayout />}>
          <Route path="venues" element={<Venues />} />
          <Route path="venues/:id" element={<Venue />} />
         
          <Route path="venue/:id" element={<Venue />} />
        </Route>

    
        <Route element={<DefaultLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
