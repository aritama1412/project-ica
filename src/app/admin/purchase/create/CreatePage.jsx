"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/react";
import helper from "@/../helper/helper";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import moment from "moment";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CreatePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [idProduct, setIdProduct] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [suppliersName, setSuppliersName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const [date, setDate] = useState(parseDate(formattedDate));
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [createProducts, setCreateProducts] = useState([]);

  const { data: rawProducts } = useSWR(
    `http://localhost:4000/products/get-all-products?limit=100&offset=0`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (rawProducts) {
      setProducts(rawProducts.data);
      setIsLoading(false);
    }
  }, [rawProducts]);

  const onSelectionChange = (id) => {
    const selected = products.find(
      (product) => parseInt(product.id_product) === parseInt(id)
    );
    setSelectedProduct(selected);

    setIdProduct(selected.id_product);
    setIdSupplier(selected.id_supplier);
    setPrice(selected.price);

    // search supplier
    // Search for the supplier based on the selected product's supplier ID

    fetch(
      `http://localhost:4000/suppliers/get-supplier?id=${selected.id_supplier}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // Set the supplier name to state
          console.log("data.data.supplier_name", data.data.supplier_name);
          setSuppliersName(data.data.supplier_name);
        }
      })
      .catch((error) => {
        console.error("Error fetching supplier data:", error);
      });
  };

  useEffect(() => {
    console.log("total price changed");
    setTotalPrice(price * quantity);
  }, [price, quantity, selectedProduct]); // Dependency array ensures this runs when `price` or `quantity` changes

  // let formatter = useDateFormatter({ dateStyle: "full" });
  const handleSaveProduct = () => {
    if (!idProduct || quantity <= 0) {
      alert("Please select a product and enter a valid quantity.");
      return;
    }

    const newProduct = {
      idProduct,
      productName: selectedProduct?.product_name,
      idSupplier,
      price,
      quantity,
      totalPrice,
      date: date.toString(), // Optional: format this date properly
    };
    console.log("newProduct", newProduct);

    setCreateProducts((prevProducts) => [...prevProducts, newProduct]);

    // Optionally reset fields after saving
    setIdProduct("");
    setIdSupplier("");
    setQuantity(1);
    setPrice(0);
    setTotalPrice(0);
    setDate(parseDate(formattedDate));
  };

  const handleDeleteProduct = (index) => {
    setCreateProducts(
      (prevProducts) => prevProducts.filter((_, i) => i !== index) // Remove item by index
    );
  };

  const handleSubmit = () => {
    // Prepare the purchase data
    const purchaseData = {
      grand_total: createProducts.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      created_by: 1, // Use the actual user ID
      details: createProducts.map((item) => ({
        id_product: item.idProduct,
        price: item.price,
        quantity: item.quantity,
      })),
    };
    console.log("purchaseData", purchaseData);
    // Make an API call to save the data
    fetch("http://localhost:4000/purchases/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Purchase created successfully:", data);
        // Optionally, clear the form or handle success
        // redirect to http://localhost:3000/admin/purchase
        alert("Purchase created successfully!");
        router.push("/admin/purchase");
      })
      .catch((error) => {
        console.error("Error creating purchase:", error);
      });
  };

  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambah Pembelian</h1>
      <div className="flex flex-row w-full gap-8 border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-col gap-4 w-1/2 bg-slate-100 p-4">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Nama Produk</span>
              <Autocomplete
                size={"sm"}
                className="max-w-[250px] h-[32px] border border-gray-300 !bg-white rounded-lg"
                label=" "
                placeholder="Silahkan pilih ..."
                onSelectionChange={onSelectionChange} // Listen to selection changes
              >
                {products.map((product) => (
                  <AutocompleteItem key={product.id_product}>
                    {product.product_name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Nama Supplier</span>
              {/* <Select
                size={"sm"}
                label=""
                aria-label="Pickup Point"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
              >
                <SelectItem value="1">Supplier 1</SelectItem>
                <SelectItem value="2">Supplier 2</SelectItem>
                <SelectItem value="3">Supplier 3</SelectItem>
              </Select> */}
              <input
                readOnly={true}
                type="text"
                className="border bg-gray-200 border-gray-300 px-1 max-w-[250px] cursor-not-allowed"
                placeholder="..."
                // defaultValue={price}
                defaultValue={suppliersName} // Use `value` instead of `defaultValue`
              />
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Jumlah</span>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Tanggal</span>
              <DatePicker
                variant={"underlined"}
                aria-label="date"
                className="max-w-[250px] h-[32px] bg-white px-2 border border-gray-300 rounded-sm"
                value={date}
                onChange={setDate}
              />
              {/* <p className="text-default-500 text-sm">
                Selected date:{" "}
                {date
                  ? formatter.format(date.toDate(getLocalTimeZone()))
                  : "--"}
              </p> */}
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Harga</span>
              <input
                readOnly={true}
                type="number"
                className="border bg-gray-200 border-gray-300 px-1 max-w-[250px] cursor-not-allowed"
                placeholder="..."
                // defaultValue={price}
                value={price} // Use `value` instead of `defaultValue`
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Total</span>
              <input
                readOnly={true}
                type="number"
                className="border bg-gray-200 border-gray-300 px-1 max-w-[250px] cursor-not-allowed"
                placeholder="..."
                value={totalPrice}
              />
            </div>
          </div>
          <div className="flex items-start mt-10">
            <button
              // type="submit"
              type="button"
              onClick={handleSaveProduct}
              className="bg-sky-300 px-4 py-1 rounded-md border-2 border-sky-800"
            >
              Tambah
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-slate-100 p-4">
          <div className="grid grid-cols-11 font-semibold text-center gap-2 mb-4">
            <span className="col-span-4 text-left">Produk</span>
            <span className="col-span-2 text-right">Harga</span>
            <span className="col-span-1 text-right">Qty</span>
            <span className="col-span-3 text-right">Total</span>
            <span className="col-span-1 text-right">🗑️</span>
          </div>
          {createProducts &&
            createProducts.map((item, index) => (
              <>
                <div
                  className="grid grid-cols-11 text-center gap-2 mb-2"
                  key={index}
                >
                  <span className="col-span-4 text-left">
                    {item.productName}
                  </span>
                  <span className="col-span-2 text-right">
                    {helper(item.price)}
                  </span>
                  <span className="col-span-1 text-right">{item.quantity}</span>

                  <span className="col-span-3 text-right">
                    {helper(item.price * item.quantity)}
                  </span>
                  <span
                    onClick={() => handleDeleteProduct(index)} // Call delete function
                    className="col-span-1 text-right cursor-pointer"
                  >
                    ❌
                  </span>
                </div>
              </>
            ))}
          <div className="border-t-2 pt-2 border-t-black">
            <div className="grid grid-cols-11 font-semibold text-center gap-2 mb-4">
              <span className="col-span-4 text-left">Grand Total</span>
              <span className="col-span-3 text-right"></span>
              <span className="col-span-3 text-right">
                {helper(
                  createProducts.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                )}
              </span>
              <span className="col-span-3 text-right"></span>
            </div>
          </div>
          <button
            // type="submit"
            type="submit"
            onClick={() => handleSubmit()}
            className="bg-sky-300 px-4 py-1 rounded-md border-2 border-sky-800"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
