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
import moment from "moment";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { MenuGridIcon } from "@/components/icons/MenuGridIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Purchase({ setActiveMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/purchases/get-all-purchases`,
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
  
    return data.data.filter((item) => {
      return (
        item.bill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Check if any supplier_name matches the search query
        item.PurchaseDetails?.some((detail) =>
          detail.Product?.Supplier?.supplier_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) ||
        String(moment(item.date_sale).format("DD-MM-YYYY HH:mm")).includes(
          searchQuery
        ) ||
        item.customer_address
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(item.grand_total).includes(searchQuery) ||
        String(item.customer_phone).includes(searchQuery) ||
        String(item.status).includes(searchQuery)
      );
    });
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
    router.push(`/admin/purchase/view/${id}`);
  };
  const handleEdit = (id) => {
    router.push(`/admin/purchase/edit/${id}`);
  };

  return (
    <div className="p-4 border border-gray-200 w-[calc(100%-255px)]">
      <h1 className="text-3xl">Transaksi Pembelian</h1>
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            // showAnchorIcon
            as={Link}
            color="default"
            href="/admin/purchase/create"
            variant="shadow"
          >
            Tambah Pembelian
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
            isStriped
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
              <TableColumn key="bill">No Bill</TableColumn>
              <TableColumn key="supplier">Supplier</TableColumn>
              <TableColumn key="status">Status</TableColumn>
              <TableColumn key="purchase_date" width={135} >
                Tanggal
              </TableColumn>
              <TableColumn key="grand_total" align="center">Total</TableColumn>
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
                <TableRow key={item?.id_purchase}>
                  {(columnKey) => {
                    if (columnKey === "action") {
                      return (
                        <TableCell>
                          <Tooltip content="Edit">
                            <span
                              onClick={() => handleEdit(item?.id_purchase)}
                              className="flex justify-end text-lg text-default-400 cursor-pointer active:opacity-50"
                            >
                              <EyeIcon />
                            </span>
                          </Tooltip>
                        </TableCell>
                      );
                    }

                    if (columnKey === "purchase_date") {
                      return (
                        <TableCell>
                          {moment(item[columnKey]).format("DD-MM-YYYY HH:mm")}
                        </TableCell>
                      );
                    }

                    if (columnKey === "supplier") {
                      return (
                        <TableCell>
                          {item?.PurchaseDetails?.map(
                            (detail) => detail.Product?.Supplier?.supplier_name
                          )
                            .filter((name) => name)
                            .join(", ") || ""}
                        </TableCell>
                      );
                    }

                    if (columnKey === "grand_total") {
                      return (
                        <TableCell className="text-right">
                          {item[columnKey].toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          })}
                        </TableCell>
                      );
                    }

                    return <TableCell>{item[columnKey]}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}
