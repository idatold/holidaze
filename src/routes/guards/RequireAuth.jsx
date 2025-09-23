// src/routes/guards/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "@/lib/auth";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        }}
      />
    );
  }

  return children;
}
