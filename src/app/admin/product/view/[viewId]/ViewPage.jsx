"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ViewPage = () => {
  const router = useRouter();
  const { viewId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const { data: product } = useSWR(
    `http://localhost:4000/products/get-product?id=${viewId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Detail Produk</h1>
      <form className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Nama Produk</span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={product?.data?.product_name}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Jenis Produk</span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={product?.data?.Category?.name}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Harga</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={product?.data?.price}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Deskripsi</span>
              <textarea
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={product?.data?.description}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Jumlah Stok</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={product?.data?.stock}
                disabled
              />
            </div>
          </div>

          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Munculkan di Katalog</span>
              <Select
                isDisabled
                size={"sm"}
                label=""
                aria-label="Status"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                defaultSelectedKeys="" // add this line
                selectedKeys={[product?.data?.status.toString()]}
              >
                <SelectItem key="1" defaultValue="1" textValue="Ya">
                  Ya
                </SelectItem>
                <SelectItem key="0" defaultValue="0" textValue="Tidak">
                  Tidak
                </SelectItem>
              </Select>
            </div>
            {/* Upload Images */}
            <div className="flex flex-col gap-1 mb-3">
              <span>Upload Gambar (Max 5 images)</span>
              <input
                type="file"
                className="border border-gray-300 px-1 max-w-[250px]"
                multiple
                disabled
              />
              <small className="text-gray-500">
                You can upload up to 5 images.
              </small>
            </div>
          </div>
          <div className="flex items-start mt-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-sky-300 px-4 py-1 rounded-md border-2 border-sky-800"
            >
              Kembali
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewPage;
