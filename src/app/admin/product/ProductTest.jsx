import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
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
import useSWR from "swr";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

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

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Product({ setActiveMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSWR(
    `http://localhost:4000/products/get-all-products`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 5;

  // Filtered Data Based on Search Query
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    if (!searchQuery) return data.data;
    return data.data.filter((item) =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.data, searchQuery]);

  const totalItems = filteredData.length;

  const pages = React.useMemo(() => {
    return totalItems > 0 ? Math.ceil(totalItems / rowsPerPage) : 0;
  }, [totalItems, rowsPerPage]);

  const loadingState = isLoading || totalItems === 0 ? "loading" : "idle";

  // Paginated Data
  const paginatedData = React.useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, rowsPerPage]);

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
            className="border border-gray-400 rounded-lg"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset to first page on new search
            }}
          />
        </div>

        <Table
          aria-label="Example table with client async pagination"
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="product_name">Produk</TableColumn>
            <TableColumn key="category">Katogori</TableColumn>
            <TableColumn key="stock">Stok</TableColumn>
            <TableColumn key="description">Deskripsi</TableColumn>
            <TableColumn key="rating">Rating</TableColumn>
            <TableColumn key="name">Status</TableColumn>
            <TableColumn key="action">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody
            items={paginatedData}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow key={item?.id_product}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
