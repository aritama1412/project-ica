import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCart = create(
  persist(
    (set) => ({
      count: 0, // Total quantity count
      cart: [], // Array to store cart items

      add: (item, quantity) =>
        set((state) => ({
          cart: [...state.cart, item], // Append new item to cart
          count: state.count + Number(quantity), // Increment count as a number
        })),

      remove: (index) =>
        set((state) => {
          const itemToRemove = state.cart[index];
          if (!itemToRemove) return state; // If item not found, return state as-is

          const quantityToRemove = itemToRemove.quantity;

          return {
            cart: state.cart.filter((_, i) => i !== index), // Remove item by index
            count: state.count - Number(quantityToRemove), // Decrement count by removed item's quantity
          };
        }),

      increaseQuantity: (index) =>
        set((state) => {
          const updatedCart = [...state.cart];
          const item = updatedCart[index];
          if (!item) return state; // If item not found, return state as-is

          // Number(item.quantity) += 1; // Increase the quantity by 1
          item.quantity = Number(item.quantity) + 1;

          return {
            cart: updatedCart,
            count: Number(state.count) + 1, // Increment total count
          };
        }),

      decreaseQuantity: (index) =>
        set((state) => {
          const updatedCart = [...state.cart];
          const item = updatedCart[index];
          if (!item || item.quantity <= 1) return state; // If item not found or quantity is 1, return state as-is

          // Number(item.quantity) -= 1; // Decrease the quantity by 1
          item.quantity = Number(item.quantity) - 1;

          return {
            cart: updatedCart,
            count: Number(state.count) - 1, // Decrement total count
          };
        }),
    }),
    {
      name: "cart-storage", // Unique name for storage key
    }
  )
);

export default useCart;
