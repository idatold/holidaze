// src/store/uiStore.js
import { create } from "zustand";

const initialState = {
  // MODALS
  isCreateVenueOpen: false,

  // GLOBAL LOADING OVERLAY
  loadingGlobal: false,


  toast: null,
};

export const useUIStore = create((set) => ({
  ...initialState,

  // MODALS
  openCreateVenue: () => set({ isCreateVenueOpen: true }),
  closeCreateVenue: () => set({ isCreateVenueOpen: false }),

  // GLOBAL LOADING OVERLAY
  startLoading: () => set({ loadingGlobal: true }),
  stopLoading: () => set({ loadingGlobal: false }),

  // TOASTS
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),

  // Optional convenience
  reset: () => set(initialState),
}));

// (optional) handy for tests/resets (kept for compatibility)
export const resetUIStore = () => useUIStore.setState(initialState);
