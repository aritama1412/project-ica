"use client";
import { useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import FilterSection from "../../components/filter/filterSection";
import ProductSection from "../../components/products/productSection";
import { DatePicker } from "@nextui-org/react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import useCart from "@/../stores/cartStore";
import helper from "@/../helper/helper";
import { getLocalTimeZone, today } from "@internationalized/date";

const dropData = [
  {
    name: "Ambil di tempat",
    value: "Ambil di tempat",
  },
  {
    name: "Antar ke rumah",
    value: "Antar ke rumah",
  },
];

const Page = () => {
  const cart = useCart();
  useEffect(() => {
    console.log("cart", cart);
  }, [cart]);

  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-full min-h-screen">
      <Navbar />
      <div className="flex flex-col gap-5">
        <div className="mt-5">
          <h1 className="text-xl text-black font-bold">
            Silahkan isi formulir untuk melanjutkan
          </h1>
        </div>
        <div className="flex flex-row scmobile:flex-col w-full gap-8">
          <div className="w-full md:w-1/2 scmobile:w-full bg-slate-100 border-2 border-slate-300 p-4">
            <div className="grid grid-cols-12 text-sm font-semibold text-center gap-2 mb-4">
              <span className="col-span-4 scmobile:col-span-3 text-left">
                Produk
              </span>
              <span className="col-span-2 scmobile:col-span-3 text-right">
                Harga
              </span>
              <span className="col-span-1 text-right">Qty</span>
              <span className="col-span-3 scmobile:col-span-4 text-right">
                Total
              </span>
              <span className="col-span-2 scmobile:col-span-1 text-right"></span>
            </div>
            {cart.cart.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 text-sm text-center gap-2 mb-2 scmobile:border-t scmobile:border-gray-300 scmobile:pt-2"
              >
                <span className="col-span-4 scmobile:col-span-3 text-left">
                  {item.name}
                </span>
                <span className="col-span-2 scmobile:col-span-3 text-right">
                  {helper(item.price)}
                </span>
                <span className="col-span-1 text-right">{item.quantity}</span>

                <span className="col-span-3 scmobile:col-span-4 text-right">
                  {helper(item.price * item.quantity)}
                </span>
                <span className="col-span-2 scmobile:col-span-1 flex scmobile:flex-col justify-end items-end gap-1 ">
                  <button
                    onClick={() => cart.increaseQuantity(index)} // Increase quantity by index
                    className="flex justify-center p-[1px] border border-black bg-gray-300 items-center rounded-full cursor-pointer"
                  >
                    ➕
                  </button>
                  <button
                    onClick={() => cart.decreaseQuantity(index)} // Decrease quantity by index
                    className="flex justify-center p-[1px] border border-black bg-gray-300 items-center rounded-full cursor-pointer"
                  >
                    ➖
                  </button>
                  <button
                    onClick={() => cart.remove(index)}
                    className="flex justify-center p-[1px] border border-black bg-gray-300 items-center rounded-full cursor-pointer"
                  >
                    ❌
                  </button>
                </span>
              </div>
            ))}
            <div className="border-t-2 pt-2 border-t-black">
              <div className="grid grid-cols-12 font-semibold text-center gap-2 mb-4">
                <span className="col-span-4 text-left">Grand Total</span>
                <span className="col-span-2 text-right"></span>
                <span className="col-span-1 text-right">{cart.count}</span>
                <span className="col-span-3 scmobile:col-span-4 text-right">
                  {helper(
                    cart.cart
                      .map((item) => item.price * item.quantity)
                      .reduce((a, b) => a + b, 0)
                  )}
                </span>
                <span className="col-span-2 scmobile:col-span-1 text-right"></span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-1/2 scmobile:w-full bg-slate-100 border-2 border-slate-300 p-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="Name">
                Nama
              </label>
              <input
                type="text"
                placeholder="..."
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px] scmobile:max-w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="phone">
                Nomor Telepon
              </label>
              <input
                type="text"
                placeholder="..."
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px] scmobile:max-w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="address">
                Alamat Lengkap
              </label>
              <input
                type="text"
                placeholder="..."
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px] scmobile:max-w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="drop point">
                Pengambilan
              </label>
              <Select
                // color={"danger"}
                size={"sm"}
                label=""
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[300px] scmobile:max-w-full border border-gray-300 !bg-white rounded-lg"
              >
                {dropData.map((data, index) => (
                  <SelectItem key={index} value={data.value}>
                    {data.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="pickup date">
                Tanggal Ambil
              </label>
              <DatePicker
                variant={"underlined"}
                aria-label="date"
                minValue={today(getLocalTimeZone())}
                className="max-w-[300px] scmobile:max-w-full bg-white px-2 border border-gray-300 rounded-sm"
              />
            </div>
            <div className="flex flex-row items-center justify-end mt-10">
              <button className="bg-blue-500 px-5 py-2 rounded-lg text-white">
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
