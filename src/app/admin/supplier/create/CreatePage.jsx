import React, { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

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
      alert("Harap isi semua field.");
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
    alert("Supplier created successfully!");
    router.back();
  };

  const handleSelectionChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambahkan Supplier Baru</h1>
      <div className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Nama Supplier <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Jenis Produk <span className="text-red-500">*</span></label>
              <Select
                size={"sm"}
                label=""
                isLoading={isLoading}
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
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
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Nomor Supplier <span className="text-red-500">*</span></label>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Alamat <span className="text-red-500">*</span></label>
              <textarea
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
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
  );
};

export default CreatePage;
