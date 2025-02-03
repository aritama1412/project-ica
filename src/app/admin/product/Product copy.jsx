import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
  RadioGroup,
  Radio,
  Button,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
// import { columns, transactions } from "./data";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const colors = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
];

const columns = [
  { name: "Produk", uid: "product" },
  { name: "Katogori", uid: "category" },
  { name: "Jumlah", uid: "quantity" },
  { name: "Tanggal", uid: "transactionDate" },
  { name: "Deskripsi", uid: "note" },
  { name: "Status", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export default function Product({ setActiveMenu }) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = React.useState("warning");
  const [products, setProducts] = useState([]);

  const handleActiveMenu = (key) => {
    setActiveMenu(key);
  };

  const renderCell = React.useCallback(
    (products, columnKey) => {
      const cellValue = products[columnKey];
      const handleEdit = (id) => {
        router.push(`/admin/product/edit/${id}`);
      };

      switch (columnKey) {
        case "product":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {products.product_name}
              </p>
            </div>
          );
        case "category":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {products.id_category}
              </p>
            </div>
          );
        case "quantity":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{products.stock}</p>
            </div>
          );
        case "transactionDate":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {formatDate(products.created_at)}
              </p>
            </div>
          );
        case "note":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {products.description}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[products.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              {/* <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip> */}
              <Tooltip content="Edit">
                <span
                  onClick={() => handleEdit(products.id_product)}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router]
  );

  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredTransactions, setFilteredTransactions] =
  //   useState(transactions);

  // useEffect(() => {
  //   const result = transactions.filter((transaction) =>
  //     transaction.productsName.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredTransactions(result);
  // }, [searchQuery]);

  useEffect(() => {
    fetch("http://localhost:4000/products/get-all-products")
      .then((response) => response.json())
      .then((data) => setProducts(data.data));
  }, []);
  return (
    <div className="p-4 border border-gray-200 w-[calc(100%-255px)]">
      <h1 className="text-3xl">Produk</h1>
      <div className="mt-10">
        <div className="flex items-center justify-between mt-2 mb-4">
          <Link
            href="/admin/product/create"
            className="border-2 border-gray-500 px-4 py-1 rounded-lg bg-gray-200"
          >
            Tambah Barang
          </Link>
          <input
            type="text"
            placeholder="  Search..."
            className=" border border-gray-400 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Table
          aria-label="Example table with custom cells"
          color={selectedColor}
          selectionMode="single"
          defaultSelectedKeys={["2"]}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={products}>
            {(item) => (
              <TableRow key={item.id_product}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
