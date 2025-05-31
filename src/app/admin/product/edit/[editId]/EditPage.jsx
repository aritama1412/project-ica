"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const fetcher = (url) => fetch(url).then((res) => res.json());

const EditPage = () => {
  const router = useRouter();
  const { editId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
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

  const { data: product } = useSWR(
    `http://localhost:4000/products/get-product?id=${editId}`,
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

  // Populate the form with product and category data
  useEffect(() => {
    if (product?.data) {
      setProductName(product?.data?.product_name);
      setSelectedCategory(product?.data?.id_category);
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
      setImages(files); // Store multiple files in the state
    } else {
      alert("You can only upload a maximum of 5 images.");
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
    // hit http://localhost:4000/products/delete-image with data id_image
    // on success remove data from view
    fetch("http://localhost:4000/products/delete-image", {
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
          alert(data.message);
        }
      });
  }

  // Handle form submission to update product
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch("http://localhost:4000/products/edit", {
        method: "POST", // Or POST if necessary
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const result = await response.json();
      alert("Product updated successfully!");
      router.back();
      // Redirect or update the state here if needed
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    }
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Edit Produk</h1>
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
                // defaultValue={product?.data?.product_name}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Jenis Produk</span>
              <Select
                size={"sm"}
                isLoading={isLoading}
                label=""
                aria-label="Category"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
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
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Harga</span>
              <input
                type="text"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                // defaultValue={product?.data?.price}
                value={price}
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
                // defaultValue={product?.data?.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Jumlah Stok</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                // defaultValue={product?.data?.stock}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                readOnly
              />
            </div>
            {/* <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Tanggal Masuk</span>
              <DatePicker
                variant={"underlined"}
                aria-label="date"
                className="max-w-[250px] bg-white px-2 border border-gray-300 rounded-sm"
                placeholder="Pilih tanggal masuk"
                defaultValue={product?.data?.date}
              />
            </div> */}
          </div>

          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
              <span>Munculkan di Katalog</span>
              <Select
                size={"sm"}
                label=""
                aria-label="Status"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
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
            {/* Upload Images */}
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

          <hr />
          
          <div className="border-1 border-gray-300 rounded-md px-3 py-3 flex flex-row gap-4">
            {productData?.Images && productData.Images.length > 0 ? (
              productData.Images.map((image, index) => {
                return (
                  <div key={index} className="flex flex-col gap-3 min-h-[220px]">
                    <Image
                      src={`http://localhost:4000${image.image}`}
                      onClick={() => window.open(`http://localhost:4000${image.image}`)}
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
                    >
                      Hapus
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">Gambar tidak ditemukan</div>
            )}
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
