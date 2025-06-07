"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import helper from "@/../helper/helper";

const fetcher = (url) => fetch(url).then((res) => res.json());

const EditPage = () => {
  const router = useRouter();
  const [tanggalBeli, setTanggalBeli] = useState(parseDate("2025-01-01"));
  const { editId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [estimationDate, setEstimationDate] = useState(parseDate("2025-01-01"));
  const [dateReceived, setDateReceived] = useState(null);

  const { data: transaction } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/get-sale?id=${editId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  // Update status whenever transaction changes
  useEffect(() => {
    if (transaction?.data?.status != undefined) {
      setStatus(transaction.data.status);
    }
    if (transaction?.data?.date_estimation != undefined) {
      setEstimationDate(parseDate(transaction?.data?.date_estimation.split("T")[0]));
    }

    console.log('date_received', transaction?.data?.date_received)
    if (transaction?.data?.date_received != null) {
      setDateReceived(parseDate(transaction?.data?.date_received.split("T")[0]));
    }

  }, [transaction]);

  const handleSubmit = async () => {
    const idSale = transaction?.data?.id_sale;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sale: idSale,
          status: `${status}`,
          date_estimation: estimationDate,
          date_received: dateReceived,
          updated_by: 1,
          updated_at: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit transaction");
      }

      const result = await response.json();
      alert("Transaction edited successfully!");
      router.push("/admin/transaction");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleStatus = (e) => {
    setStatus(e.target.value); 
    // handleSubmit(e.target.value);
  };

  useEffect(() => {
    console.log('estimationDate', estimationDate)
    console.log('dateReceived', dateReceived)
  }, [estimationDate, dateReceived]);

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
                Estimasi tanggal diterima
              </label>
              <DatePicker
                variant={"underlined"}
                aria-label="date"
                value={estimationDate}
                onChange={setEstimationDate}
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
                <Select
                  size={"sm"}
                  label=""
                  aria-label="Status"
                  placeholder="Silahkan pilih ..."
                  className="w-full min-w-[200px] border border-gray-300 !bg-white rounded-lg"
                  selectedKeys={[status]}
                  onChange={handleStatus}
                >
                  <SelectItem key="menunggu pembayaran" defaultValue="0" textValue="Menun ggu Pembayaran">
                    Menunggu Pembayaran
                  </SelectItem>
                  <SelectItem key="proses" defaultValue="1" textValue="Proses">
                    Proses
                  </SelectItem>
                  <SelectItem key="selesai" defaultValue="2" textValue="Selesai">
                    Selesai
                  </SelectItem>
                  <SelectItem key="batal" defaultValue="3" textValue="Batal">  
                    Batal
                  </SelectItem>
                </Select>
              </div>
            </div>
            <div className="flex flex-row items-end justify-between mt-10">
              <div div className="flex flex-col gap-1">
                <label className="font-bold" htmlFor="pickup date">
                  Tanggal diterima
                </label>
                <DatePicker
                  variant={"underlined"}
                  aria-label="date"
                  value={dateReceived}
                  onChange={setDateReceived}
                  isLoading={isLoading}
                  className="max-w-[300px] bg-white px-2 border border-gray-300 rounded-sm"
                />
              </div>
              <div className="flex items-start mt-10">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-sky-300 px-4 py-1 rounded-md border-2 border-sky-800"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
