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

  const { data: supplier } = useSWR(
    `http://localhost:4000/suppliers/get-supplier?id=${viewId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Detail Supplier</h1>
      <form className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Nama Supplier</span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={supplier?.data?.supplier_name}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Kategori </span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={supplier?.data?.Category?.name}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Alamat</span>
              <textarea
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={supplier?.data?.address || ""}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>No. Telp</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                defaultValue={supplier?.data.phone}
                disabled
              />
            </div>
          </div>

          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Status</span>
              <Select
                isDisabled
                size={"sm"}
                label=""
                aria-label="Status"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                defaultSelectedKeys="" // add this line
                selectedKeys={[supplier?.data?.status.toString()]}
              >
                <SelectItem key="1" defaultValue="1" textValue="Ya">
                  Ya
                </SelectItem>
                <SelectItem key="0" defaultValue="0" textValue="Tidak">
                  Tidak
                </SelectItem>
              </Select>
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
