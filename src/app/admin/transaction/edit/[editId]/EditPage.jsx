"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
import useSWR from "swr";
import {Input} from "@heroui/input";
import {Textarea, Button} from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import helper from "@/../helper/helper";
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";

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

  const formatDateFromObject = (dateObj) => {
    if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
      return null; // Return null if any part of the date is missing
    }

    const year = dateObj.year;
    const month = dateObj.month.toString().padStart(2, '0');
    const day = dateObj.day.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  useEffect(() => {
    // Handle the API call to mark the transaction as seen
    const markTransactionAsSeen = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/seen?id_sale=${editId}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to mark transaction as seen");
        }

        const result = await response.json();
        console.log("Transaction marked as seen:", result);
      } catch (error) {
        console.error("Error marking transaction as seen:", error.message);
      }
    };

    if (editId) {
      markTransactionAsSeen();
    }
  }, []);

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
          date_estimation: formatDateFromObject(estimationDate),
          date_received: formatDateFromObject(dateReceived),
          updated_by: 1,
          updated_at: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit transaction");
      }

      const result = await response.json();
      showSuccessToast('Supplier berhasil di rubah.');
      setTimeout(() => {
        router.push("/admin/transaction");
      }, 1500);
    } catch (error) {
      showErrorToast("Terjadi kesalahan.");
      console.log('error', error.message)
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
          <div className="flex flex-col gap-3 w-1/2 border border-gray-200 p-4">
            <div className="flex flex-col gap-1">
              <Input
                label="No. Bill"
                placeholder="No. Bill"
                variant="faded"
                labelPlacement="outside"
                type="text"
                value={transaction?.data?.bill}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                label="Nama"
                placeholder="Nama"
                variant="faded"
                labelPlacement="outside"
                type="text"
                value={transaction?.data?.customer_name}
              />
            </div>
            <div className="flex flex-col gap-1">
          <Input
                label="Nomor Telepon"
                placeholder="Nomor Telepon"
                variant="faded"
                labelPlacement="outside"
                type="text"
                value={transaction?.data?.customer_phone}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Textarea
                // classNames={{
                //   base: "col-span-12 md:col-span-6 mb-6 md:mb-0",
                //   input: "resize-y min-h-[100px]",
                // }}
                className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0"
                label="Alamat"
                labelPlacement="outside"
                placeholder="Alamat"
                variant="faded"
                // disableAutosize
                value={transaction?.data?.customer_address || ""}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Select
                label="Pengambilan"
                labelPlacement="outside"
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
              <DatePicker
                label="Estimasi tanggal diterima"
                labelPlacement="outside"
                variant="bordered"
                value={estimationDate}
                onChange={setEstimationDate}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 border border-gray-200 p-4">
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
                <Select
                  label="Status"
                  labelPlacement="outside"
                  isRequired
                  variant="bordered"
                  className="w-full min-w-[200px]"
                  selectedKeys={[status]}
                  onChange={handleStatus}
                >
                  <SelectItem key="menunggu pembayaran" defaultValue="0" textValue="Menunggu Pembayaran">
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
                  className="w-[200px] bg-white px-2 border border-gray-300 rounded-sm"
                />
              </div>
              <div className="flex items-start mt-10">
                <Button type="submit" onClick={handleSubmit} color="success" variant="flat" >
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
