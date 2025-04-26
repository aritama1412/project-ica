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

const fetcher = (url) => fetch(url).then((res) => res.json());

const ViewPage = () => {
  const router = useRouter();
  const [tanggalBeli, setTanggalBeli] = useState(parseDate("2025-01-01"));
  const { viewId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const { data: transaction } = useSWR(
    `http://localhost:4000/sales/get-sale?id=${viewId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Detail Penjualan</h1>
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
                  {transaction?.data?.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
