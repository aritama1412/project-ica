"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {Input} from "@heroui/input";
import {Textarea, Button} from "@heroui/react";
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";

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
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/get-supplier?id=${editId}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const { data: categoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/get-all-categories`,
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
      showErrorToast('Harap isi semua field.');
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/edit`, {
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
    showSuccessToast('Supplier berhasil di rubah.');
    setTimeout(() => {
      router.push("/admin/supplier");
    }, 1500);
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
          <div className="flex flex-row">
            <div className="w-1/3">
              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Input
                  label="Nama Supplier"
                  placeholder="Nama Supplier"
                  variant="bordered"
                  labelPlacement="outside"
                  type="text"
                  value={name}
                  isRequired
                  onChange={(e) => setName(e.target.value)}
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
                  value={phone}
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
                  isRequired
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

              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Select
                  label="Status"
                  labelPlacement="outside"
                  isRequired
                  selectedKeys={[status.toString()]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)} 
                >
                  <SelectItem key="1" defaultValue="1" textValue="Aktif">
                    Aktif
                  </SelectItem>
                  <SelectItem key="0" defaultValue="0" textValue="Non Aktif">
                    Non Aktif
                  </SelectItem>
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
                  value={address || ""}
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
        </div>
      </form>
    </div>
  );
};

export default EditPage;
