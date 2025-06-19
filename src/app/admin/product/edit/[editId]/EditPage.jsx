"use client";

import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {Input} from "@heroui/input";
import {Textarea, Button} from "@heroui/react";
import { StockIcon } from "@/components/icons/StockIcon";
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";

const fetcher = (url) => fetch(url).then((res) => res.json());

const EditPage = () => {
  const router = useRouter();
  const { editId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [showInCatalog, setShowInCatalog] = useState(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [productData, setProductData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const { data: product } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-product?id=${editId}`,
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

  const { data: suppliersData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/get-all-suppliers`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    console.log('suppliersData', suppliersData)
    if (suppliersData) {
      setIsLoading(false);
      setSuppliers(suppliersData.data);
    }
  }, [suppliersData]);

  // Populate the form with product and category data
  useEffect(() => {
    if (product?.data) {
      setProductName(product?.data?.product_name);
      setSelectedCategory(product?.data?.id_category);
      setSelectedSupplier(product?.data?.id_supplier);
      setShowInCatalog(product?.data?.status); // Assuming status corresponds to catalog visibility
      setPrice(product?.data?.price);
      setStock(product?.data?.stock);
      setDescription(product?.data?.description);
      setProductData(product?.data);
    }

    if (categoriesData) {
      setIsLoading(false);
      setCategories(categoriesData);
    }
  }, [product, categoriesData]);

  // Handle file input change (allow multiple files)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    if (files.length <= 5) {
      setIsValid(true);
      setImages(files); // Store multiple files in the state
    } else {
      setIsValid(false);
      showErrorToast('You can only upload a maximum of 5 images.');
    }
  };

  // set data for setisloading state
  useEffect(() => {

    let newLoadingStates = {};
    product?.data?.Images && product.data.Images.map((image, index) => {
      return newLoadingStates[image.id_image] = false;
    });
    setLoadingStates(newLoadingStates);
    console.log('newLoadingStates', newLoadingStates)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  useEffect(() => {
    console.log('loadingStates', loadingStates)
  }, [loadingStates])

  const handleDeleteImage = (imageId) => {
    console.log('imageId', imageId)
    // loadingStates to true, match the id
    setLoadingStates((prevState) => ({
      ...prevState,
      [imageId]: true,
    }));

    // delete 
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/delete-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_image: imageId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "success") {
          console.log('data.status', data.status)
          // hit again api get product detail
          // remove image from product
          const newProduct = productData.Images.filter((image) => image.id_image !== imageId);
          setProductData((prevState) => ({
            ...prevState,
            Images: newProduct,
          }));

          // setLoadingStates((prevState) => ({
          //   ...prevState,
          //   [imageId]: false,
          // }));
        }else{
          showErrorToast(data.message);
        }
      });
  }

  // Handle form submission to update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedProduct = {
      id_product: editId,
      product_name: productName,
      id_category: selectedCategory,
      price: price,
      description: description,
      status: showInCatalog,
      editor: 1, // Assuming this is the logged-in user's ID (you might need to adjust this)
    };

    // Create FormData to include the images
    const formData = new FormData();
    formData.append("id_product", editId);
    formData.append("product_name", productName);
    formData.append("id_category", selectedCategory);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("status", showInCatalog);
    formData.append("editor", 1); // Assuming the editor is the logged-in user
    images.forEach((image) => {
      formData.append("images", image); // Append each image file
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/edit`, {
        method: "POST", // Or POST if necessary
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const result = await response.json();
      showSuccessToast('Product updated successfully!');
      setTimeout(() => {
        router.push("/admin/product");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating product:", error);
      showErrorToast(data.message);
    }
  };

  return (
    <div className="flex flex-col p-4 w-screen">
      <h1 className="text-3xl font-bold">Edit Produk</h1>
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
                {/* <span>Munculkan di Katalog</span> */}
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
                  defaultSelectedKeys={[selectedCategory.toString()]}
                  selectedKeys={[selectedCategory.toString()]}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)} // Update on change
                >
                  {categories &&
                    categories.map((category, index) => (
                      <SelectItem
                        key={category.id_category.toString()}
                        value={category.id_category.toString()}
                        textValue={category.name} // Add this for accessibility
                      >
                        {category.name}
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
                  className="cursor-pointer"
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
                  defaultSelectedKeys={[selectedSupplier.toString()]}
                  selectedKeys={[selectedSupplier.toString()]}
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)} // Update on change
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
          
          <div className="border-1 border-gray-300 rounded-md px-3 py-3 flex flex-wrap gap-4 w-full mx-2 mt-[15px]">
            {productData?.Images && productData.Images.length > 0 ? (
              productData.Images.map((image, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 min-h-[220px] max-w-[200px] flex-grow"
                  style={{ flex: "0 0 auto" }} // Ensures items maintain their size and wrap as needed
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image.image}`}
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}${image.image}`)}
                    alt={image.image}
                    className="max-w-[200px] min-h-[200px] max-h-[200px] object-cover"
                    width={200}
                    height={200}
                  />
                  <Button
                    color="danger"
                    variant="flat"
                    isLoading={!!loadingStates[image.id_image]} // Ensure this is specific to the image ID
                    onClick={() => handleDeleteImage(image.id_image)}
                    className="max-w-[200px]"
                  >
                    Hapus
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-gray-500 w-full text-center">Gambar tidak ditemukan</div>
            )}
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

export default EditPage;
