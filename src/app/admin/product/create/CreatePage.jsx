import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {Input} from "@heroui/input";
import {Textarea, Button, DatePicker} from "@heroui/react";
import { StockIcon } from "@/components/icons/StockIcon";
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CreatePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [showInCatalog, setShowInCatalog] = useState(null);
  const [images, setImages] = useState([]); // State for multiple images

  const { data: categoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/get-all-categories`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const { data: suppliersData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/get-all-suppliers`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    console.log('categoriesData', categoriesData)
    if (categoriesData) {
      setIsLoading(false);
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    console.log('suppliersData', suppliersData)
    if (suppliersData) {
      setIsLoading(false);
      setSuppliers(suppliersData.data);
    }
  }, [suppliersData]);

  // Handle file input change (allow multiple files)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    if (files.length <= 5) {
      setIsValid(true);
      setImages(files); // Store multiple files in the state
    } else {
      setIsValid(false);
      showErrorToast('Maksimal unggah 5 gambar.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Create FormData to include the images
    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("id_category", selectedCategory);
    formData.append("id_supplier", selectedSupplier);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("status", showInCatalog);
    formData.append("stock", stock);
    formData.append("creator", 1); 
    images.forEach((image) => {
      formData.append("images", image); // Append each image file
    });

  try {
    console.log({
      productName,
      selectedCategory,
      selectedSupplier,
      price,
      description,
      showInCatalog,
      stock,
      images,
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/create`, {
      method: "POST", // Or POST if necessary
      body: formData,
    });

    let result;
    try {
      result = await response.json();
    } catch (err) {
      console.warn("Failed to parse JSON response:", err);
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      console.error("Backend error:", result);
      throw new Error(result.message || "Failed to create product");
    }

    showSuccessToast('Produk berhasil dibuat.');
    setTimeout(() => {
      router.push("/admin/product");
    }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating product:", error);
      showErrorToast("Terjadi kesalahan.");
    }
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambahkan Produk Baru</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row border border-gray-300 px-6 py-4 mt-4 rounded-sm"
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row">
            <div className="w-1/3">
              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                {/* flat | bordered | faded | underlined */}
                <Input
                  label="Nama Produk"
                  placeholder="Nama Produk"
                  variant="bordered"
                  labelPlacement="outside"
                  type="text"
                  // defaultValue={product?.data?.product_name}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Input
                  label="Harga"
                  placeholder="0"
                  min={0}
                  variant="bordered"
                  labelPlacement="outside"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Rp</span>
                    </div>
                  }
                  type="number"
                  // defaultValue={product?.data?.price}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Select
                  label="Munculkan di Katalog"
                  placeholder="Silahkan pilih ..."
                  variant="bordered"
                  labelPlacement="outside"
                  defaultSelectedKeys="" // add this line
                  selectedKeys={[showInCatalog && showInCatalog.toString()]}
                  onChange={(e) => setShowInCatalog(e.target.value)} // Update on change
                >
                  <SelectItem key="1" value="1" textValue="Ya">
                    Ya
                  </SelectItem>
                  <SelectItem key="0" value="0" textValue="Tidak">
                    Tidak
                  </SelectItem>
                </Select>
              </div>
            </div>

            <div className="w-1/3">
              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Select
                  isLoading={isLoading}
                  label="Jenis Produk"
                  placeholder="Silahkan pilih ..."
                  variant="bordered"
                  labelPlacement="outside"
                  onSelectionChange={(key) => setSelectedCategory(Array.from(key)[0])} // Update on change
                >
                  {categories.map((data) => (
                    <SelectItem key={data.id_category} value={data.id_category}>
                      {data.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Input
                  endContent={
                    <StockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Jumlah Stok"
                  variant="faded"
                  labelPlacement="outside"
                  placeholder="0"
                  min={0}
                  type="number"
                  // defaultValue={product?.data?.stock}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  readOnly
                />
              </div>

              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Input
                  label="Upload Gambar (Max 5 images)"
                  placeholder="Upload Gambar"
                  variant="bordered"
                  labelPlacement="outside"
                  type="file"
                  multiple
                  onChange={handleImageChange} // Handle image change
                  description="You can upload up to 5 images."
                />
              </div>
            </div>

            <div className="w-1/3">
              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Select
                  isLoading={isLoading}
                  label="Supplier"
                  placeholder="Silahkan pilih ..."
                  variant="bordered"
                  labelPlacement="outside"
                  onSelectionChange={(key) => setSelectedSupplier(Array.from(key)[0])} // Update on change
                >
                  {suppliers.map((data) => (
                    <SelectItem key={data.id_supplier} value={data.id_supplier}>
                      {data.supplier_name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1 mb-3 min-w-[350px] px-2">
                <Textarea
                  classNames={{
                    base: "col-span-12 md:col-span-6 mb-6 md:mb-0",
                    input: "resize-y min-h-[100px]",
                  }}
                  // className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
                  label="Deskripsi"
                  labelPlacement="outside"
                  placeholder="Deskripsi ..."
                  variant="bordered"
                  isClearable
                  disableAutosize
                  // defaultValue={product?.data?.description}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onClear={() => setDescription('')}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start mt-10 gap-2 ml-2">
            <Button type="submit" color="success" variant="flat" className={`px-4 py-1 ${isValid ? '' : 'disabled !cursor-not-allowed'}`} isDisabled={!isValid} isLoading={isLoading}>
              Simpan
            </Button>
            {!isValid && <small className="text-red-500 font-semibold">Tolong unggah ulang gambar sesuai ketentuan.</small>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
