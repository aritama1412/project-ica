import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCounter = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: "counter-storage", // Unique name for storage key
    }
  )
);

export default useCounter;
