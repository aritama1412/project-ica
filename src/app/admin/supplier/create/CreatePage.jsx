import React, { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/react";
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
    `http://localhost:4000/categories/get-all-categories`,
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
    // send data thru json body to this url http://localhost:4000/suppliers/create
    const response = await fetch("http://localhost:4000/suppliers/create", {
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

    // const formData = new FormData();
    // formData.append(
    //   "supplier",
    //   JSON.stringify({
    //     supplier_name: supplierName,
    //     id_category: category,
    //     phone: phone,
    //     address: address,
    //   })
    // );

    // try {
    //   const response = await fetch("http://localhost:4000/suppliers/create", {
    //     method: "POST", // Or POST if necessary
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to create supplier");
    //   }

    //   const result = await response.json();
    //   alert("Supplier created successfully!");
    //   router.back();
    //   // Redirect or update the state here if needed
    // } catch (error) {
    //   console.error("Error creating supplier:", error);
    //   alert("Error creating supplier");
    // }
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambahkan Supplier Baru</h1>
      <div className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Nama Supplier</span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Jenis Produk</span>
              <Select
                size={"sm"}
                label=""
                isLoading={isLoading}
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((data, index) => (
                  <SelectItem key={index} value={data.id_category}>
                    {data.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Nomor Supplier</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Alamat</span>
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
