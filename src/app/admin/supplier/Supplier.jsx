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
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Supplier({ setActiveMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSWR(
    `http://localhost:4000/suppliers/get-all-suppliers`,
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

  const handleView = (id) => {
    router.push(`/admin/supplier/view/${id}`);
  };
  const handleEdit = (id) => {
    router.push(`/admin/supplier/edit/${id}`);
  };

  return (
    <div className="p-4 border border-gray-200 w-[calc(100%-255px)]">
      <h1 className="text-3xl">Supplier</h1>
      <div className="mt-10">
        <div className="flex items-center justify-between mt-2 mb-4">
          <Link
            href="/admin/supplier/create"
            className="border-2 border-gray-500 px-4 py-1 rounded-lg bg-gray-200"
          >
            Tambah Supplier
          </Link>
          <input
            type="text"
            placeholder="  Search..."
            className=" border border-gray-400 rounded-lg"
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
            <TableColumn key="action">ACTIONS</TableColumn>
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
                        <Tooltip content="Details">
                          <span
                            onClick={() => handleView(item?.id_supplier)}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EyeIcon />
                          </span>
                        </Tooltip>
                        <Tooltip content="Edit">
                          <span
                            onClick={() => handleEdit(item?.id_supplier)}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EditIcon />
                          </span>
                        </Tooltip>
                        {/* <Tooltip color="danger" content="Delete">
                          <span
                            onClick={() => handleDetail(item?.id_supplier)}
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                          >
                            <DeleteIcon />
                          </span>
                        </Tooltip> */}
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
