"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import FilterSection from "../../components/filter/filterSection";
import { DatePicker } from "@heroui/react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import useCart from "@/../stores/cartStore";
import helper from "@/../helper/helper";
import { getLocalTimeZone, today } from "@internationalized/date";
import {Input} from "@heroui/input";
import {Textarea, Button} from "@heroui/react";
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";

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
    if (!phone.trim()) {
      alert("Harap isi nomor telepone.");
      return;
    }
    if (!name.trim()) {
      alert("Harap isi nomor nama.");
      return;
    }
    if (!address.trim()) {
      alert("Harap isi alamat.");
      return;
    }
    if (!pickupPoint.trim()) {
      alert("Harap isi pengambilan.");
      return;
    }
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
      date_estimation: formattedDate,
      pick_up_type: pickupPoint,
      created_by: 1,
      details: savedCart.map((item) => ({
        id_product: item.id,
        price: item.price,
        quantity: parseInt(item.quantity, 10),
      })),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        const isConfirmed = window.confirm(`Transaction created successfully. Do you want to proceed?`);
        
        if (isConfirmed) {
          const phoneNumber = "6288989918089"; 
          const orderNumber = result.data.bill; 
          const message = encodeURIComponent(`Halo, saya ingin melanjutkan pembayaran. Nomor pesanan saya: ${orderNumber}`);
          const waLink = `https://wa.me/${phoneNumber}?text=${message}`;
          window.open(waLink, "_blank");

          cart.clearCart(); // Clear the cart after successful transaction
          setPhone("");
          setName("");
          setAddress("");
          setPickupPoint("");

        }
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
          <div className="flex flex-col gap-3 w-1/2 scmobile:w-full border border-slate-300 p-4">
            <div className="flex flex-col gap-1">
              <Input
                label="Nomor Telepon"
                placeholder="08xxxxxxxxxx"
                variant="bordered"
                inputMode="numeric"
                labelPlacement="outside"
                type="text"
                // defaultValue={product?.data?.product_name}
                isRequired
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) { // Allow only digits
                    setPhone(value);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                label="Nama"
                placeholder="Nama Anda"
                variant="bordered"
                labelPlacement="outside"
                type="text"
                value={name}
                isRequired
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Textarea
                classNames={{
                  base: "col-span-12 md:col-span-6 mb-6 md:mb-0",
                  input: "resize-y min-h-[100px]",
                }}
                // className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                label="Alamat Lengkap"
                labelPlacement="outside"
                placeholder="Jl Melati No.3"
                variant="bordered"
                isClearable
                isRequired
                // disableAutosize
                // defaultValue={product?.data?.description}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onClear={() => setAddress('')}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Select
                label="Pengambilan"
                placeholder="Silahkan pilih ..."
                variant="bordered"
                labelPlacement="outside"
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
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
                onClick={() => createTransaction()}
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
