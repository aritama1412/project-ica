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
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Product({ setActiveMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = React.useState(1);
  const [isDeleted, setIsDeleted] = useState(false);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-all-products-admin`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 10;

  // Filtered Data Based on Search Query
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    if (!searchQuery) return data.data;

    return data.data.filter(
      (item) =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.Category?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item?.status_info?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleEdit = (id) => {
    router.push(`/admin/product/edit/${id}`);
  };
  const handleDelete = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_product: id }),
    })
      .then((response) => response.json())
      .then((data) => 
        data.status == 'success' ? setIsDeleted(true) : alert("Failed deleting product")
    );
  };

  useEffect(() => {
    if (isDeleted) {
      alert("Product deleted successfully!");
      // reload page
      window.location.reload(); // Full reload
      setIsDeleted(false);
    }
  }, [isDeleted, router]);

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
            <TableColumn key="id_category">Katogori</TableColumn>
            <TableColumn key="stock">Stok</TableColumn>
            <TableColumn key="description">Deskripsi</TableColumn>
            {/* <TableColumn key="rating">Rating</TableColumn> */}
            <TableColumn key="status_info">Status</TableColumn>
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
                  <TableCell>
                    {columnKey === "action" ? (
                      <div className="flex flex-row gap-3">
                        <Tooltip content="Edit">
                          <span
                            onClick={() => handleEdit(item?.id_product)}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EyeIcon />
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete">
                          <span
                            onClick={() => handleDelete(item?.id_product)}
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                          >
                            <DeleteIcon />
                          </span>
                        </Tooltip>
                      </div>
                    ) : columnKey === "id_category" ? (
                      item?.Category?.name || "N/A"
                    ) : (
                      getKeyValue(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
