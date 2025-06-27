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
  Tooltip,
  getKeyValue,
  Button,
  Link,
  Input
} from "@heroui/react";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { MenuGridIcon } from "@/components/icons/MenuGridIcon";
import { showSuccessToast } from "@/components/toast/ToastNotification";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Supplier({ setActiveMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = React.useState(1);
  const [isDeleted, setIsDeleted] = useState(false);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/get-all-suppliers`,
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
        item.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status_info?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery)
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
    router.push(`/admin/supplier/edit/${id}`);
  };
  
  const handleDelete = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/suppliers/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_supplier: id }),
    })
      .then((response) => response.json())
      .then((data) => 
        data.status == 'success' ? setIsDeleted(true) : showErrorToast("Gagal menghapus produk.")
    );
  };

  useEffect(() => {
    if (isDeleted) {
      showSuccessToast("Supplier berhasil dihapus.");
      window.location.reload(); // Full reload
      setTimeout(() => {
        router.push("/admin/supplier");
        setIsDeleted(false);
      }, 1500);
    }
  }, [isDeleted, router]);

  return (
    <div className="p-4 border border-gray-200 w-[calc(100%-255px)]">
      <h1 className="text-3xl">Supplier</h1>
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            // showAnchorIcon
            as={Link}
            color="default"
            href="/admin/supplier/create"
            variant="shadow"
          >
            Tambah Supplier
          </Button>
          <Input
            endContent={
              <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            // label="Search..."
            variant="bordered"
            // labelPlacement="inside"
            placeholder="Cari ..."
            className="max-w-[300px]"
            type="text"
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
            <TableColumn key="supplier_name">Name</TableColumn>
            <TableColumn key="phone">phone</TableColumn>
            <TableColumn key="status_info">Status</TableColumn>
            <TableColumn key="action" width={25} align="end">
              <MenuGridIcon size="1rem" />
            </TableColumn>
          </TableHeader>
          <TableBody
            items={paginatedData}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow key={item?.id_supplier}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "action" ? (
                      <div className="flex flex-row gap-3">
                        {/* <Tooltip content="Details">
                          <span
                            onClick={() => handleView(item?.id_supplier)}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EyeIcon />
                          </span>
                        </Tooltip> */}
                        <Tooltip content="Edit">
                          <span
                            onClick={() => handleEdit(item?.id_supplier)}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EyeIcon />
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete">
                          <span
                            onClick={() => handleDelete(item?.id_supplier)}
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
