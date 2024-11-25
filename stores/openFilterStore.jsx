import { create } from "zustand";
import { persist } from "zustand/middleware";

// ini ga di simpan di local storage
const useOpenFilterStore = create((set) => ({
  filter: null, // Initial state for `filter`
  setFilter: (filter) => set({ filter }), // Update `filter` value
}));

export default useOpenFilterStore;
