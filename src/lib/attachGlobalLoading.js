// src/lib/attachGlobalLoading.js
import { useUIStore } from "@/store/uiStore";

/**
 * Attaches a global loading overlay to an axios instance.
 * Shows after `delay` ms, hides when all active requests finish.
 * Skip per-request with { __skipGlobalLoading: true } in axios config.
 */
export default function attachGlobalLoading(axiosInstance, { delay = 200 } = {}) {
  let active = 0;
  let timer = null;

  const begin = (config) => {
    if (config?.__skipGlobalLoading) return config;
    active += 1;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        useUIStore.getState().startLoading();
      }, delay);
    }
    return config;
  };

  const end = (config) => {
    if (config?.__skipGlobalLoading) return;
    active = Math.max(0, active - 1);
    if (active === 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      useUIStore.getState().stopLoading();
    }
  };

  axiosInstance.interceptors.request.use(
    (config) => begin(config),
    (error) => {
      end(error?.config);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      end(response?.config);
      return response;
    },
    (error) => {
      end(error?.config);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
