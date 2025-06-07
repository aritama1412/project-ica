"use client";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/react";
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
  const [idProduct, setIdProduct] = useState("");
  const [note, setNote] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [suppliersName, setSuppliersName] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [quantity, setQuantity] = useState(1);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const [date, setDate] = useState(parseDate(formattedDate));
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [createProducts, setCreateProducts] = useState([]);

  const { data: rawProducts } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-all-products-admin`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (rawProducts) {
      console.log('rawProducts', rawProducts)
      setProducts(rawProducts.data);
      setIsLoading(false);
    }
  }, [rawProducts]);

  const { data: suppliersData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/get-all-suppliers`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  useEffect(() => {
    setIsLoading(true);
    console.log('suppliersData', suppliersData)
    if (suppliersData) {
      setIsLoading(false);
      setSuppliers(suppliersData.data);
    }
  }, [suppliersData, selectedSupplier]);

  const onSelectionChange = (id) => {
    const selected = products.find(
      (product) => parseInt(product.id_product) === parseInt(id)
    );
  
    if (selected) {
      console.log('selected:', selected);
      setSelectedProduct(selected);
      setIdProduct(selected.id_product);
      setIdSupplier(selected.id_supplier); // Automatically set supplier ID
      setPrice(selected.price);
  
      // Find and set the corresponding supplier
      const supplier = suppliers.find(
        (sup) => parseInt(sup.id_supplier) === parseInt(selected.id_supplier)
      );
      if (supplier) {
        setSelectedSupplier(supplier.id_supplier); // Automatically select supplier
      }
    }
  };

  useEffect(() => {
    console.log("total price changed");
    setTotalPrice(price * quantity);
  }, [price, quantity, selectedProduct]); 

  const handleSaveProduct = () => {
    if (!idProduct || quantity <= 0 || !date) {
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
      date: date.toString(), 
    };

    setCreateProducts((prevProducts) => [...prevProducts, newProduct]);

    // Optionally reset fields after saving
    setSelectedSupplier("");
    setSelectedProduct("");
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
    if(createProducts.length === 0 ) {
      alert("Please add at least one product.");
      return;
    }
    const purchaseData = {
      grand_total: createProducts.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      created_by: 1,
      note: note,
      details: createProducts.map((item) => ({
        id_product: item.idProduct,
        id_supplier: item.idSupplier,
        price: item.price,
        quantity: item.quantity,
      })),
    };
    console.log("purchaseData", purchaseData);
    // Make an API call to save the data
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/purchases/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Purchase created successfully:", data);

        alert("Purchase created successfully!");
        router.push("/admin/purchase");
      })
      .catch((error) => {
        console.error("Error creating purchase:", error);
      });
  };
  const [value, setValue] = useState([]);
  const handleSelectionChange = (e) => {
    setValue(e.target.value);
    setSelectedSupplier(e.target.value);
    setIdSupplier(parseInt(e.target.value));
  };


  return (
    <div className="flex flex-col p-4 w-full">
      <h1 className="text-3xl font-bold">Tambah Pembelian</h1>
      <div className="flex flex-row w-full gap-8 border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-col gap-4 w-1/2 bg-slate-100 p-4">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <label>Nama Produk <span className="text-red-500">*</span></label>
              <Autocomplete
                size={"sm"}
                label=" "
                aria-label="Produk"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] h-[32px] border border-gray-300 !bg-white rounded-lg"
                isLoading={isLoading}
                defaultItems={products}
                defaultSelectedKey={[idProduct.toString()]}
                onSelectionChange={onSelectionChange} 
              >
                {(item) => <AutocompleteItem key={item.id_product}>{item.product_name}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <label>Nama Supplier <span className="text-red-500">*</span></label>
              <Select
                size={"sm"}
                label=""
                aria-label="supplier"
                placeholder="Silahkan pilih ..."
                className="max-w-[250px] border border-gray-300 !bg-white rounded-lg"
                isLoading={isLoading}
                selectedKeys={[selectedSupplier.toString()]}
                onChange={handleSelectionChange}
              >
                {suppliers.map((data) => (
                  <SelectItem key={data.id_supplier} value={data.id_supplier}>
                    {data.supplier_name}
                  </SelectItem>
                ))}
              </Select>

            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <label>Jumlah <span className="text-red-500">*</span></label>
              <input
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <label>Tanggal <span className="text-red-500">*</span></label>
              <DatePicker
                variant={"underlined"}
                aria-label="date"
                className="max-w-[250px] h-[32px] bg-white px-2 border border-gray-300 rounded-sm"
                value={date}
                onChange={setDate}
              />
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex flex-col gap-1 mb-3 min-w-[300px]">
              <span>Harga</span>
              <input
                readOnly={false}
                type="number"
                className="border border-gray-300 px-1 max-w-[250px]"
                placeholder="..."
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value))}
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
          <div className="flex flex-col gap-1 mb-3 min-w-[350px]">
            <span>Catatan</span>
            <textarea
              type="text"
              className="border border-gray-300 px-1 max-w-[250px]"
              placeholder="..."
              onChange={(e) => setNote(e.target.value)}
            />
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
