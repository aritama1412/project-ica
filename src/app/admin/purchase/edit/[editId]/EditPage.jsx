"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import helper from "@/../helper/helper";
import moment, { min } from "moment";
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";
import {Input} from "@heroui/input";
import {Textarea, Button} from "@heroui/react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const EditPage = () => {
  const router = useRouter();
  const [tanggalBeli, setTanggalBeli] = useState(parseDate("2025-01-01"));
  const { editId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const { data: transaction } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/purchases/get-purchase?id=${editId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (transaction?.data?.status !== undefined) {
      setStatus(transaction.data.status);
      setNote(transaction.data.note);
      console.log('note:', transaction.data.note);
    }
  }, [transaction]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const idPurchase = transaction?.data?.id_purchase;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/purchases/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_purchase: idPurchase,
          note: note,
          status: `${status}`,
          updated_by: 1,
          updated_at: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit purchase");
      }
      const result = await response.json();
      showSuccessToast('Data berhasil dirubah.');
      setTimeout(() => {
        router.push("/admin/purchase");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Terjadi kesalahan.");
      console.log(error.message);
    }
  };

  const handleStatus = (e) => {
    setStatus(e.target.value); 
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Detail Pembelian</h1>
      <div className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <form onSubmit={handleSubmit} className="flex flex-row w-full gap-8">
          <div className="flex flex-col gap-3 w-1/2 bg-slate-100 p-4">
            <div className="flex flex-col gap-1">
              <Input
                label="No. Bill"
                placeholder="No. Bill"
                variant="bordered"
                labelPlacement="outside"
                type="text"
                value={transaction?.data?.bill}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                label="Tanggal Beli"
                placeholder="Tanggal Beli"
                variant="bordered"
                labelPlacement="outside"
                type="text"
                value={
                  transaction?.data?.purchase_date &&
                  moment(transaction?.data?.purchase_date).format(
                    "DD-MM-YYYY HH:mm"
                  )
                }
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                label="Grand Total"
                placeholder="0"
                readOnly
                variant="bordered"
                labelPlacement="outside"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">Rp</span>
                  </div>
                }
                type="text"
                value={transaction?.data?.grand_total && transaction?.data?.grand_total.toLocaleString("id-ID", { minimumFractionDigits: 0 })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Textarea
                classNames={{
                  base: "col-span-12 md:col-span-6 mb-6 md:mb-0",
                  input: "resize-y min-h-[40px]",
                }}
                // className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0"
                label="Catatan"
                labelPlacement="outside"
                // placeholder="Catatan ..."
                variant="bordered"
                // isClearable
                // disableAutosize
                isReadOnly
                defaultValue={note || ""}
                onChange={(e) => setNote(e.target.value)}
                // onClear={() => setNote('')}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 border border-slate-300 p-4">
            <div className="grid grid-cols-10 font-semibold text-center gap-2 mb-4">
              <span className="col-span-4 text-left">Produk</span>
              <span className="col-span-2 text-right">Harga</span>
              <span className="col-span-1 text-right">Qty</span>
              <span className="col-span-3 text-right">Total</span>
            </div>
            {transaction?.data?.PurchaseDetails.map((item, index) => (
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
                  {transaction?.data?.PurchaseDetails &&
                    helper(
                      transaction?.data?.PurchaseDetails.map(
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
                  label="Nama Supplier"
                  placeholder="Silahkan pilih ..."
                  labelPlacement="outside"
                  className="w-full min-w-[230px]"
                  selectedKeys={[status]}
                  onChange={handleStatus}
                  isRequired
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
              <div className="flex items-start mt-10">
                <Button type="submit" color="success" variant="flat" isLoading={isLoading}>
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
