// /src/features/profile/useProfile.js
import { useCallback, useEffect, useState } from "react";
import { getMyProfile, updateProfileMedia } from "@/lib/authApi";

export function useProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(null);

  const refresh = useCallback(async (signal) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getMyProfile(signal);
      const p = res?.data ?? res;
      setData(p);
      return p;
    } catch (e) {
      setErr(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    refresh(ctrl.signal);
    return () => ctrl.abort();
  }, [refresh]);

  // Optional helpers — keeps ProfileMedia lean
  const updateAvatar = async (file) => {
    const res = await updateProfileMedia({ kind: "avatar", file });
    await refresh();
    return res;
  };
  const updateCover = async (file) => {
    const res = await updateProfileMedia({ kind: "cover", file });
    await refresh();
    return res;
  };

  return { data, loading, error, refresh, updateAvatar, updateCover, setData };
}
