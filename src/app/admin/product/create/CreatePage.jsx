import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CreatePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
      setImages(files); // Store multiple files in the state
    } else {
      alert("You can only upload a maximum of 5 images.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

alert("Product created successfully!");
router.back();
      // Redirect or update the state here if needed
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product");
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
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Nama Produk</span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Jenis Produk</span>
              <Select
                size={"sm"}
                label=""
                isLoading={isLoading}
                aria-label="category"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                onSelectionChange={(key) => setSelectedCategory(Array.from(key)[0])} // Update on change
              >
                {categories.map((data) => (
    <SelectItem key={data.id_category} value={data.id_category}>
      {data.name}
    </SelectItem>
  ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Harga</span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                onChange={(e) => setPrice(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Supplier</span>
              <Select
                size={"sm"}
                label=""
                isLoading={isLoading}
                aria-label="supplier"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                onSelectionChange={(key) => setSelectedSupplier(Array.from(key)[0])} // Update on change
              >
                {suppliers.map((data) => (
    <SelectItem key={data.id_supplier} value={data.id_supplier}>
      {data.supplier_name}
    </SelectItem>
  ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Jumlah Stok</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                value="0"
                readOnly
              />
            </div>
          </div>

          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Munculkan di Katalog</span>
              <Select
                size={"sm"}
                label=""
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                onChange={setShowInCatalog}
              >
                <SelectItem key="1" value="1">
                  Ya
                </SelectItem>
                <SelectItem key="0" value="0">
                  Tidak
                </SelectItem>
              </Select>
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <span>Upload Gambar (Max 5 images)</span>
              <input
                type="file"
                className="border border-gray-300 px-1 max-w-[250px]"
                multiple
                onChange={handleImageChange} // Handle image change
              />
              <small className="text-gray-500">
                You can upload up to 5 images.
              </small>
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

export default CreatePage;
