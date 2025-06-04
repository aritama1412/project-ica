"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";

const fetcher = (url) => fetch(url).then((res) => res.json());

const EditPage = () => {
  const router = useRouter();
  const { editId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [idSupplier, setIdSupplier] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const { data: supplier } = useSWR(
    `http://localhost:4000/suppliers/get-supplier?id=${editId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const { data: categoriesData } = useSWR(
    `http://localhost:4000/categories/get-all-categories`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (supplier) {
      setIsLoading(false);
      setIdSupplier(supplier?.data?.id_supplier);
      setName(supplier?.data?.supplier_name);
      setAddress(supplier?.data?.address);
      setPhone(supplier?.data?.phone);
      setCategory(supplier?.data?.id_category);
      setStatus(supplier?.data?.status);
    }
  }, [supplier]);

  // Handle form submission to update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name || !category || !phone || !address || !status) {
      console.log('name: '+ name + ' category: ' + category + ' phone: ' + phone + ' address: ' + address + ' status: ' + status);
      alert("Harap isi semua field.");
      return;
    }

    const response = await fetch("http://localhost:4000/suppliers/edit", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_supplier: idSupplier,
        supplier_name: name,
        id_category: category,
        phone: phone,
        address: address,
        status: status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create supplier");
    }

    const result = await response.json();
    alert("Supplier edited successfully!");
    router.back();
  };

  const handleSelectionChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Edit Supplier</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm"
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Nama Supplier <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Jenis Produk <span className="text-red-500">*</span></label>
              <Select
                size={"sm"}
                label=""
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                selectedKeys={[category.toString()]}
                // defaultSelectedKeys={[category && category.toString()]}
                // value={category}
                onChange={handleSelectionChange}
              >
                {categoriesData &&
                  categoriesData?.map((data, index) => (
                    <SelectItem key={index} value={data.value}>
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Alamat <span className="text-red-500">*</span></label>
              <textarea
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                value={address || ""}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <label>Status <span className="text-red-500">*</span></label>
              <Select
                size={"sm"}
                label=""
                aria-label="Status"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                selectedKeys={[status.toString()]}
                value={status}
                onChange={(e) => setStatus(e.target.value)} // Update on change
              >
                <SelectItem key="1" defaultValue="1" textValue="Ya">
                  Aktif
                </SelectItem>
                <SelectItem key="0" defaultValue="0" textValue="Tidak">
                  Non Aktif
                </SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex items-start mt-10">
            <button
              type="submit"
              className="bg-sky-300 px-4 py-1 rounded-md border-2 border-sky-800"
            >
              Simpan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPage;
