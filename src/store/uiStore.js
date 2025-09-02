import { create } from "zustand";

const initialState = {
  // MODALS
  isCreateVenueOpen: false,
  openCreateVenue: () => {},
  closeCreateVenue: () => {},

  // GLOBAL LOADING OVERLAY
  loadingGlobal: false,
  startLoading: () => {},
  stopLoading: () => {},

  // TOAST MESSAGES
  toast: null, // { type: "success" | "error" | "info", message: string }
  showToast: () => {},
  clearToast: () => {},
};

export const useUIStore = create((set) => ({
  ...initialState,
  openCreateVenue: () => set({ isCreateVenueOpen: true }),
  closeCreateVenue: () => set({ isCreateVenueOpen: false }),

  startLoading: () => set({ loadingGlobal: true }),
  stopLoading: () => set({ loadingGlobal: false }),

  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));

// (optional) handy for tests/resets
export const resetUIStore = () => useUIStore.setState(initialState);
