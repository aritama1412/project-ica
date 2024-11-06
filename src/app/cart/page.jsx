"use client";
import { useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import useCart from "@/../stores/cartStore";
import helper from "@/../helper/helper";

const Cart = () => {
  const cart = useCart();
  useEffect(() => {
    console.log("cart", cart);
  }, [cart]);

  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-[1800px] min-h-screen ">
      <Navbar />
      <div className="flex flex-col gap-5">
        <div className="mt-5">
          <h1 className="text-xl text-black font-bold">Keranjang</h1>
        </div>
        <div className="w-full md:w-1/2 bg-slate-100 p-4">
          <div className="grid grid-cols-7 font-semibold text-center gap-2 mb-4">
            <span className="col-span-3 text-left">Produk</span>
            <span className="col-span-1 text-right">Harga</span>
            <span className="col-span-1/4 text-right">Qty</span>
            <span className="col-span-1 text-right">Total</span>
            <span className="col-span-1 text-right">#</span>
          </div>

          {cart.cart.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-7 text-center gap-2 mb-2"
            >
              <span className="col-span-3 text-left">{item.name}</span>
              <span className="col-span-1 text-right">
                {helper(item.price)}
              </span>
              <span className="col-span-1 text-right">{item.quantity}</span>

              <span className="col-span-1 text-right">
                {helper(item.price * item.quantity)}
              </span>
              <span className="col-span-1 text-right">
                {helper(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t-2 pt-2 border-t-black">
            <div className="grid grid-cols-6 font-semibold text-center gap-2 mb-4">
              <span className="col-span-3 text-left">Grand Total</span>
              <span className="col-span-1 text-right"></span>
              <span className="col-span-1 text-right">{cart.count}</span>
              <span className="col-span-1 text-right">
                {helper(
                  cart.cart
                    .map((item) => item.price * item.quantity)
                    .reduce((a, b) => a + b, 0)
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end mt-10">
            <button className="bg-blue-500 px-5 py-2 rounded-lg text-white">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
