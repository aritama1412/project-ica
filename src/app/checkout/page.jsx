"use client";
import { useEffect, useState } from "react";
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
  const [savedCart, setSavedCart] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  useEffect(() => {
    // console.log("cart", cart);
    setSavedCart(cart.cart);
    // generate log
  }, [cart]);

  console.log("savedCart", savedCart);

  const createTransaction = async () => {
    // if (!cart || !cart.length) {
    //   console.error("Cart is empty!");
    //   return;
    // }
    const today = new Date();

    const formattedDate = `${pickupDate.year}-${String(
      pickupDate.month
    ).padStart(2, "0")}-${String(pickupDate.day).padStart(2, "0")}`;

    console.log("name", name);
    console.log("phone", phone);
    console.log("address", address);
    console.log("pickupPoint", pickupPoint);
    console.log("formattedDate", formattedDate);

    const payload = {
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      grand_total: savedCart.reduce(
        (total, item) => total + item.price * parseInt(item.quantity, 10),
        0
      ),
      status: "0",
      date_sale: today,
      date_pick_up: formattedDate,
      pick_up_type: pickupPoint,
      created_by: 1,
      details: savedCart.map((item) => ({
        id_product: item.id,
        price: item.price,
        quantity: parseInt(item.quantity, 10),
      })),
    };

    try {
      const response = await fetch("http://localhost:4000/sales/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        alert("Transaction created successfully:", result);
      } else {
        console.error("Failed to create transaction:", await response.text());
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

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
            {savedCart &&
              savedCart.map((item, index) => (
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
              <label className="font-bold" htmlFor="phone">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="..."
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) { // Allow only digits
                    setPhone(value);
                  }
                }}
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px] scmobile:max-w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="Name">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="..."
                // value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px] scmobile:max-w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="address">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="..."
                // value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px] scmobile:max-w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="drop point">
                Pengambilan <span className="text-red-500">*</span>
              </label>
              <Select
                // color={"danger"}
                size={"sm"}
                label=""
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                onChange={(e) => setPickupPoint(e.target.value)}
                // onChange={(date) => setPickupDate(date)}
                className="max-w-[300px] scmobile:max-w-full border border-gray-300 !bg-white rounded-lg"
              >
                {dropData.map((data, index) => (
                  <SelectItem key={index} value={data.value}>
                    {data.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="w-full p-2 text-xs bg-white border-1 border-gray-300 rounded-lg">
              <span className="text-red-500">* </span>
                Silahkan mengirimkan bukti pembayaran pada WA Admin
            </div>

            <div className="flex flex-row items-center justify-end mt-5">
              <button
                // onClick={() => createTransaction()}
                onClick={() => {
                  const phoneNumber = "6282337071412"; // Nomor dengan kode negara (62 untuk Indonesia)
                  const orderNumber = "12345"; // Ganti dengan nomor pesanan
                  const message = encodeURIComponent(`Halo, saya ingin melanjutkan pembayaran. Nomor pesanan saya: ${orderNumber}`);
                  const waLink = `https://wa.me/${phoneNumber}?text=${message}`;
                  window.open(waLink, "_blank");
                }}
                className="bg-blue-500 px-5 py-2 rounded-lg text-white"
              >
                Lanjutkan pembayaran pada WA
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
