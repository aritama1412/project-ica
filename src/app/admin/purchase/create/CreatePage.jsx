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
import { showSuccessToast, showErrorToast } from "@/components/toast/ToastNotification";
import {Input} from "@heroui/input";
import {Textarea, Button} from "@heroui/react";

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
    // filter, only show supplier with status='1'
    const newSuppliers = suppliersData?.data.filter(supplier => supplier.status === '1');
    if (suppliersData) {
      setIsLoading(false);
      setSuppliers(newSuppliers);
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
      showErrorToast("Harap pilih produk dan masukkan jumlah yang valid.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(createProducts.length === 0 ) {
      showErrorToast("Masukkan setidaknya 1 produk.")
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

        showSuccessToast('Data Pembelian berhasil dibuat.');
        setTimeout(() => {
          router.push("/admin/purchase");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error creating purchase:", error);
        showErrorToast('Terjadi kesalahan.');
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
      <form onSubmit={handleSubmit} className="flex flex-row w-full gap-8 border border-gray-300 px-6 py-4 mt-4 rounded-sm">
        <div className="flex flex-row gap-4 w-1/2 border border-gray-200 p-4">
          <div className="w-1/2">
            <div className="flex flex-col gap-1 mb-3 ">
              <Autocomplete
                label="Nama Produk"
                placeholder="Silahkan pilih ..."
                variant="bordered"
                labelPlacement="outside"
                isLoading={isLoading}
                defaultItems={products}
                defaultSelectedKey={[idProduct.toString()]}
                onSelectionChange={onSelectionChange} 
                isRequired
              >
                {(item) => <AutocompleteItem key={item.id_product}>{item.product_name}</AutocompleteItem>}
              </Autocomplete>
            </div>

            <div className="flex flex-col gap-1 mb-3 ">
              <Input
                label="Jumlah"
                placeholder="Jumlah"
                variant="bordered"
                labelPlacement="outside"
                type="number"
                isRequired
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 mb-3 ">
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
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                isRequired
              />
            </div>

            <Button type="button" onClick={handleSaveProduct} color="success" variant="flat" isLoading={isLoading}>
              Tambah
            </Button>
          </div>

          <div className="w-1/2">
            <div className="flex flex-col gap-1 mb-3 ">
              <Select
                label="Nama Supplier"
                placeholder="Silahkan pilih ..."
                labelPlacement="outside"
                className=""
                isLoading={isLoading}
                selectedKeys={[selectedSupplier.toString()]}
                onChange={handleSelectionChange}
                isRequired
              >
                {suppliers.map((data) => (
                  <SelectItem key={data.id_supplier} value={data.id_supplier}>
                    {data.supplier_name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1 mb-3 ">
              <label className="text-sm">Tanggal <span className="text-red-500">*</span></label>
              <DatePicker
                variant="bordered"
                label=""
                placeholder="Pilih Tanggal"
                className=""
                value={date}
                onChange={setDate}
                isRequired
              />
            </div>

            <div className="flex flex-col gap-1 mb-3 ">
              
              <Input
                readOnly
                label="Total"
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
                value={totalPrice}
                isRequired
              />
            </div>
          </div>

        </div>
        <div className="w-full md:w-1/2 border border-gray-200 p-4">
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
            <Textarea
              classNames={{
                base: "col-span-12 md:col-span-6 mb-6 md:mb-0",
                input: "resize-y min-h-[40px]",
              }}
              // className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0"
              label="Catatan"
              labelPlacement="outside"
              placeholder="Catatan ..."
              variant="bordered"
              isClearable
              // disableAutosize
              onChange={(e) => setNote(e.target.value)}
              onClear={() => setNote('')}
            />
          </div>
          
          <Button type="submit" color="success" variant="flat" isLoading={isLoading}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
