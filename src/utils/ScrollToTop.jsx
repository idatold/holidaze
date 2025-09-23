import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ smooth = false }) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If navigating to an in-page anchor like /page#section, try to scroll to it.
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        return;
      }
    }
    // Otherwise go to top.
    window.scrollTo({ top: 0, left: 0, behavior: smooth ? "smooth" : "auto" });
  }, [pathname, search, hash, smooth]);

  return null;
}
