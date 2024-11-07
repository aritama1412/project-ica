import React from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/react";
import helper from "@/../helper/helper";

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
const CreatePage = () => {
  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambah Pembelian</h1>
      <div className="flex flex-row w-full gap-8 border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-col gap-4 w-1/2 bg-slate-100 p-4">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Nama Supplier</span>
              <Select
                size={"sm"}
                label=""
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
              >
                <SelectItem value="1">Supplier 1</SelectItem>
                <SelectItem value="2">Supplier 2</SelectItem>
                <SelectItem value="3">Supplier 3</SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Nama Produk</span>
              <Select
                size={"sm"}
                label=""
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
              >
                <SelectItem value="1">Produk 1</SelectItem>
                <SelectItem value="2">Produk 2</SelectItem>
                <SelectItem value="3">Produk 3</SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Jumlah</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Tanggal</span>
              <DatePicker
                variant={"underlined"}
                aria-label="date"
                className="max-w-[250px] bg-white px-2 border border-gray-300 rounded-sm"
              />
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Harga</span>
              <input
                readOnly={true}
                type="number"
                className="border bg-gray-200 border-gray-300 px-1 max-w-[250px] cursor-not-allowed"
                placeholder="..."
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Total</span>
              <input
                readOnly={true}
                type="number"
                className="border bg-gray-200 border-gray-300 px-1 max-w-[250px] cursor-not-allowed"
                placeholder="..."
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-slate-100 p-4">
          <div className="grid grid-cols-10 font-semibold text-center gap-2 mb-4">
            <span className="col-span-4 text-left">Produk</span>
            <span className="col-span-2 text-right">Harga</span>
            <span className="col-span-1 text-right">Qty</span>
            <span className="col-span-3 text-right">Total</span>
          </div>
          <div className="grid grid-cols-10 text-center gap-2 mb-2">
            <span className="col-span-4 text-left">Bunga Matahari</span>
            <span className="col-span-2 text-right">{helper(25000)}</span>
            <span className="col-span-1 text-right">1</span>

            <span className="col-span-3 text-right">{helper(25000 * 1)}</span>
          </div>
          <div className="border-t-2 pt-2 border-t-black">
            <div className="grid grid-cols-10 font-semibold text-center gap-2 mb-4">
              <span className="col-span-4 text-left">Grand Total</span>
              <span className="col-span-3 text-right"></span>
              <span className="col-span-3 text-right">{helper(200000)}</span>
              <span className="col-span-2 text-right"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
