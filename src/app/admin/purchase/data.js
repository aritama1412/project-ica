import React from "react";
const columns = [
  { name: "Id", uid: "id" },
  { name: "Nama Supplier", uid: "name" },
  { name: "Tanggal", uid: "transactionDate" },
  { name: "Total", uid: "total" },
  { name: "Status", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const transactions = [
  {
    id: 1,
    name: "Rendy",
    // transactionDate: Date.now(),
    transactionDate: "2024-11-03 23:52",
    total: 35000,
    status: "success",
  },
  {
    id: 2,
    name: "Jokowi",
    transactionDate: "2024-11-03 23:52",
    total: 35000,
    status: "success",
  },
  {
    id: 3,
    name: "Ica",
    transactionDate: "2024-11-03 23:52",
    total: 35000,
    status: "success",
  },
  {
    id: 4,
    name: "Reta",
    transactionDate: "2024-11-03 23:52",
    total: 35000,
    status: "success",
  },
  {
    id: 5,
    name: "Edwin",
    transactionDate: "2024-11-03 23:52",
    total: 35000,
    status: "success",
  },
];

export { columns, transactions };
