import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFilterStore = create(
  persist(
    (set) => ({
      filters: {}, // Object to hold all filters
      setFilter: (filterName, value) =>
        set((state) => ({
          filters: { ...state.filters, [filterName]: value },
        })),
      clearFilter: (filterName) =>
        set((state) => {
          const updatedFilters = { ...state.filters };
          delete updatedFilters[filterName];
          return { filters: updatedFilters };
        }),
      clearAllFilters: () => set({ filters: {} }),
    }),
    {
      name: "filter-store", // Key for localStorage
      getStorage: () => localStorage, // Use localStorage
    }
  )
);

export default useFilterStore;
