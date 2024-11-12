import React from "react";
const columns = [
  { name: "Produk", uid: "product" },
  { name: "Katogori", uid: "category" },
  { name: "Jumlah", uid: "quantity" },
  { name: "Tanggal", uid: "transactionDate" },
  { name: "Catatan", uid: "note" },
  { name: "Status", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const transactions = [
  {
    id: 1,
    productsName: "Anggrek",
    category: "Tanaman Gantung",
    quantity: 3,
    note: "",
    status: "success",
    transactionDate: "2024-11-12 23:00:12",
  },
  {
    id: 2,
    productsName: "Ekor Kucing",
    category: "Tanaman Gantung",
    quantity: 4,
    note: "",
    status: "success",
    transactionDate: "2024-11-12 23:00:12",
  },
  {
    id: 3,
    productsName: "Kaktus Berwarna",
    category: "Tanaman Hias",
    quantity: 12,
    note: "",
    status: "pending",
    transactionDate: "2024-11-12 23:00:12",
  },
  {
    id: 4,
    productsName: "Sirih Belanda",
    category: "Tanaman Hias",
    quantity: 5,
    note: "",
    status: "pending",
    transactionDate: "2024-11-12 23:00:12",
  },
  {
    id: 5,
    productsName: "Roundoup",
    category: "Pupuk",
    quantity: 30,
    note: "FRESH",
    status: "success",
    transactionDate: "2024-11-12 23:00:12",
  },
];

export { columns, transactions };
