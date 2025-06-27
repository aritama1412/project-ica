import React, { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {Input} from "@heroui/input";
import {Textarea, Button} from "@heroui/react";
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const CreatePage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supplierName, setSupplierName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const { data: categoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/get-all-categories`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (categoriesData) {
      setIsLoading(false);
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!supplierName || !category || !phone || !address) {
      showErrorToast("Harap isi semua data.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supplier_name: supplierName,
        id_category: category,
        phone: phone,
        address: address,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create supplier");
    }

    const result = await response.json();
    showSuccessToast("Supplier berhasil ditambahkan.");
    // timeout 1500
    setTimeout(() => {
      router.push("/admin/supplier");
    }, 1500);
  };

  const handleSelectionChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambahkan Supplier Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-row w-full">
          <div className="w-1/3">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
              <Input
                label="Nama Supplier"
                placeholder="Nama Supplier"
                variant="bordered"
                labelPlacement="outside"
                type="text"
                isRequired
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
              <Input
                label="Nomor Supplier"
                placeholder="Nomor Supplier"
                variant="bordered"
                labelPlacement="outside"
                type="number"
                isRequired
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/3">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
              <Select
                  label="Jenis Produk"
                  labelPlacement="outside"
                  className=""
                  placeholder="Pilih Jenis Produk"
                  variant="bordered"
                  isRequired
                  onChange={handleSelectionChange}
                >
                {categories.map((data, index) => (
                  <SelectItem key={data.id_category} value={data.id_category}>
                    {data.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="w-1/3">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
              <Textarea
                classNames={{
                  base: "col-span-12 md:col-span-6 mb-6 md:mb-0",
                  input: "resize-y min-h-[100px]",
                }}
                // className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                label="Alamat"
                isRequired
                labelPlacement="outside"
                placeholder="Alamat"
                variant="bordered"
                isClearable
                // disableAutosize
                // defaultValue={product?.data?.description}
                onChange={(e) => setAddress(e.target.value)}
                onClear={() => setDescription('')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-start mt-10 px-2">
          <Button type="submit" color="success" variant="flat" isLoading={isLoading}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
