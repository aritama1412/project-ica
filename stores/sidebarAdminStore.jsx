import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSidebarAdmin = create(
  persist(
    (set) => ({
      menu: "", // Initial state for `menu`
      setMenu: (menu) => set({ menu }), // Update `menu` value
    }),
    {
      name: "active-sidebar", // Unique name for storage key
    }
  )
);

export default useSidebarAdmin;
