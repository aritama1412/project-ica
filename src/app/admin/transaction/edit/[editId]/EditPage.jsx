"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
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

const fetcher = (url) => fetch(url).then((res) => res.json());

const EditPage = () => {
  const router = useRouter();
  const [tanggalBeli, setTanggalBeli] = useState(parseDate("2025-01-01"));
  const { editId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const { data: transaction } = useSWR(
    `http://localhost:4000/sales/get-sale?id=${editId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const handleSubmit = async (statusValue) => {
    const idSale = transaction?.data?.id_sale;
    console.log("idSale", idSale);
    console.log("statusValue", statusValue);
    try {
      const response = await fetch("http://localhost:4000/sales/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sale: idSale,
          status: `${statusValue}`,
          updated_by: 1,
          updated_at: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit transaction");
      }

      const result = await response.json();
      alert("Transaction edited successfully!");
      router.back();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Edit Penjualan</h1>
      <div className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-row w-full gap-8">
          <div className="flex flex-col gap-3 w-1/2 bg-slate-100 p-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="Name">
                No. Bill
              </label>
              <input
                type="text"
                placeholder="..."
                defaultValue={transaction?.data?.bill}
                disabled
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="Name">
                Nama
              </label>
              <input
                type="text"
                placeholder="..."
                defaultValue={transaction?.data?.customer_name}
                disabled
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
                defaultValue={transaction?.data?.customer_phone}
                disabled
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="address">
                Alamat
              </label>
              {/* <input
                type="text"
                placeholder="..."
                className="px-2 py-[2px] text-gray-700 border border-gray-300 rounded-sm max-w-[300px]"
              /> */}
              <textarea
                type="text"
                className="border border-gray-300 px-1 max-w-[300px] text-gray-700"
                placeholder="..."
                defaultValue={transaction?.data?.customer_address || ""}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="drop point">
                Pengambilan
              </label>
              <Select
                isDisabled
                size={"sm"}
                label=""
                aria-label="Status"
                placeholder="Silahkan pilih ..."
                className="max-w-[300px] border border-gray-300 !bg-white rounded-lg"
                defaultSelectedKeys="" // add this line
                selectedKeys={[transaction?.data?.pick_up_type.toString()]}
              >
                <SelectItem key="1" defaultValue="1" textValue="Delivery">
                  Delivery
                </SelectItem>
                <SelectItem key="0" defaultValue="0" textValue="On the Spot">
                  On the spot
                </SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="pickup date">
                Tanggal Ambil
              </label>
              <DatePicker
                variant={"underlined"}
                aria-label="date"
                value={
                  transaction?.data?.date_pick_up &&
                  parseDate(transaction?.data?.date_pick_up.split("T")[0])
                }
                isDisabled
                isLoading={isLoading}
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
            {transaction?.data?.SaleDetails.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-10 text-center gap-2 mb-2"
              >
                <span className="col-span-4 text-left">
                  {item.Product.product_name}
                </span>
                <span className="col-span-2 text-right">
                  {helper(item.price)}
                </span>
                <span className="col-span-1 text-right">{item.quantity}</span>

                <span className="col-span-3 text-right">
                  {helper(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t-2 pt-2 border-t-black">
              <div className="grid grid-cols-10 font-semibold text-center gap-2 mb-4">
                <span className="col-span-4 text-left">Grand Total</span>
                <span className="col-span-3 text-right"></span>
                <span className="col-span-3 text-right">
                  {transaction?.data?.SaleDetails &&
                    helper(
                      transaction?.data?.SaleDetails.map(
                        (item) => item.price * item.quantity
                      ).reduce((a, b) => a + b, 0)
                    )}
                </span>
                <span className="col-span-2 text-right"></span>
              </div>
            </div>
            <div className="flex flex-row items-end justify-between mt-10">
              <div className="flex flex-col">
                <span>Status</span>
                <span className="bg-sky-400 px-3 py-1  rounded-lg">
                  {transaction?.data?.status === "0"
                    ? "Pending"
                    : transaction?.data?.status === "1"
                    ? "Lunas"
                    : "Batal"}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                {(transaction?.data?.status === "0" ||
                  transaction?.data?.status === "2") && (
                  <button
                    onClick={() => handleSubmit(1)}
                    className="bg-gray-500 px-5 py-2 rounded-lg text-white"
                  >
                    Lunaskan
                  </button>
                )}
                {(transaction?.data?.status === "1" ||
                  transaction?.data?.status === "2") && (
                  <button
                    onClick={() => handleSubmit(0)}
                    className="bg-blue-500 px-5 py-2 rounded-lg text-white"
                  >
                    Pendingkan
                  </button>
                )}
                {transaction?.data?.status !== "2" && (
                  <button
                    onClick={() => handleSubmit(2)}
                    className="bg-red-500 px-5 py-2 rounded-lg text-white"
                  >
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
