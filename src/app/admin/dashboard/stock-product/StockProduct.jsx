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
} from "@heroui/react";

import { columns, transactions } from "./data";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";

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

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export default function StockProduct({ setActiveMenu }) {
  const [selectedColor, setSelectedColor] = React.useState("warning");
  const handleActiveMenu = (key) => {
    setActiveMenu(key);
  };
  const renderCell = React.useCallback((transactions, columnKey) => {
    const cellValue = transactions[columnKey];

    switch (columnKey) {
      case "product":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {transactions.productsName}
            </p>
          </div>
        );
      case "category":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {transactions.category}
            </p>
          </div>
        );
      case "quantity":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {transactions.quantity}
            </p>
          </div>
        );
      case "transactionDate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {formatDate(transactions.transactionDate)}
            </p>
          </div>
        );
      case "note":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{transactions.note}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[transactions.status]}
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
                onClick={() => alert("xxx")}
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
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  useEffect(() => {
    const result = transactions.filter((transaction) =>
      transaction.productsName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTransactions(result);
  }, [searchQuery]);

  return (
    <div className="p-4 border border-gray-200">
      <h1>Produk</h1>
      <div className="mt-2">
        <div className="flex items-center justify-between mt-2 mb-4">
          <Button
            color="primary"
            size="sm"
            onClick={() => handleActiveMenu("createStockProduct")}
          >
            Tambah Barang
          </Button>
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
          <TableBody items={filteredTransactions}>
            {(item) => (
              <TableRow key={item.id}>
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
