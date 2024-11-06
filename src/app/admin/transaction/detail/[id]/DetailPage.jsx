import React from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/react";
import helper from "@/../helper/helper";
import { getLocalTimeZone, today } from "@internationalized/date";

const dropData = [
  {
    name: "Tanaman Hias",
    value: "Tanaman Hias",
  },
  {
    name: "Tanaman Buah",
    value: "Tanaman Buah",
  },
  {
    name: "Pupuk Kimia",
    value: "Pupuk Kimia",
  },
  {
    name: "Pot Gantung",
    value: "Pot Gantung",
  },
];

const cart = [
  {
    name: "Tanaman Hias",
    price: 10000,
    qty: 3,
  },
  {
    name: "Tanaman Buah",
    price: 10000,
    qty: 1,
  },
  {
    name: "Pupuk Kimia",
    price: 10000,
    qty: 2,
  },
  {
    name: "Pot Gantung",
    price: 10000,
    qty: 1,
  },
];
const EditPage = () => {
  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambahkan Produk Baru</h1>
      <div className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-row w-full gap-8">
          <div className="flex flex-col gap-3 w-1/2 bg-slate-100 p-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="Name">
                Nama
              </label>
              <input
                type="text"
                placeholder="..."
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="phone">
                Nomor Telepon
              </label>
              <input
                type="text"
                placeholder="..."
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="address">
                Alamat Lengkap
              </label>
              <input
                type="text"
                placeholder="..."
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px]"
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
                className="max-w-[300px] border border-gray-300 !bg-white rounded-lg"
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
                className="max-w-[300px] bg-white px-2 border border-gray-300 rounded-sm"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-slate-100 p-4">
            <div className="grid grid-cols-10 font-semibold text-center gap-2 mb-4">
              <span className="col-span-4 text-left">Produk</span>
              <span className="col-span-2 text-right">Harga</span>
              <span className="col-span-1 text-right">Qty</span>
              <span className="col-span-3 text-right">Total</span>
            </div>
            {cart.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-10 text-center gap-2 mb-2"
              >
                <span className="col-span-4 text-left">{item.name}</span>
                <span className="col-span-2 text-right">
                  {helper(item.price)}
                </span>
                <span className="col-span-1 text-right">{item.qty}</span>

                <span className="col-span-3 text-right">
                  {helper(item.price * item.qty)}
                </span>
              </div>
            ))}
            <div className="border-t-2 pt-2 border-t-black">
              <div className="grid grid-cols-10 font-semibold text-center gap-2 mb-4">
                <span className="col-span-4 text-left">Grand Total</span>
                <span className="col-span-3 text-right"></span>
                <span className="col-span-3 text-right">
                  {helper(
                    cart
                      .map((item) => item.price * item.qty)
                      .reduce((a, b) => a + b, 0)
                  )}
                </span>
                <span className="col-span-2 text-right"></span>
              </div>
            </div>
            <div className="flex flex-row items-end justify-between mt-10">
              <div className="flex flex-col">
                <span>Status</span>
                <span className="bg-sky-400 px-3 py-1  rounded-lg">
                  Telah dikonfirmasi
                </span>
              </div>
              <button className="bg-blue-500 px-5 py-2 rounded-lg text-white">
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
