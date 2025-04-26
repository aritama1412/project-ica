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
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import moment from "moment";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Transaction({ setActiveMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSWR(
    `http://localhost:4000/sales/get-all-sales`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 10;

  // Filtered Data Based on Search Query
  // Filtered Data Based on Search Query
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    if (!searchQuery) return data.data;

    return data.data.filter((item) => {
      return (
        item.bill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    router.push(`/admin/transaction/view/${id}`);
  };
  const handleEdit = (id) => {
    router.push(`/admin/transaction/edit/${id}`);
  };

  const renderTableCell = (columnKey, item) => {
    if (columnKey === "action") {
      return (
        <div className="flex flex-row gap-3">
          <Tooltip content="Details">
            <span
              onClick={() => handleView(item?.id_sale)}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit">
            <span
              onClick={() => handleEdit(item?.id_sale)}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EditIcon />
            </span>
          </Tooltip>
        </div>
      );
    }

    if (columnKey === "date_sale") {
      return moment(item[columnKey]).format("DD-MM-YYYY HH:mm");
    }

    if (columnKey === "grand_total") {
      return item[columnKey].toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    }

    return item[columnKey];
  };

  return (
    <div className="p-4 border border-gray-200 w-[calc(100%-255px)]">
      <h1 className="text-3xl">Transaksi Penjualan</h1>
      <div className="mt-10">
        <div className="flex items-center justify-between mt-2 mb-4">
          <span>&nbsp;</span>
          <input
            type="text"
            placeholder="Search..."
            className=" border border-gray-400 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <TableColumn key="bill">No Bill</TableColumn>
            <TableColumn key="customer_name">Nama</TableColumn>
            <TableColumn key="customer_phone">HP</TableColumn>
            <TableColumn key="status">Status</TableColumn>
            <TableColumn key="date_sale">Tanggal</TableColumn>
            <TableColumn key="grand_total">Total</TableColumn>
            <TableColumn key="action">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody
            items={paginatedData}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow key={item?.id_sale}>
                {(columnKey) => (
                  <TableCell>{renderTableCell(columnKey, item)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
