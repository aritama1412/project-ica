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
import moment from "moment";
import { EyeIcon } from "@/components/icons/EyeIcon";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Kas({ setActiveMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = React.useState(1);
  const [isDeleted, setIsDeleted] = useState(false);

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cashflow/get-cashflow`,
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
      <h1 className="text-3xl">Kas</h1>
      <div className="mt-10">
        {/* <div className="flex items-center justify-between mt-2 mb-4">
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
        </div> */}

        <Table
          aria-label="Example table with client async pagination"
        >
          <TableHeader>
            <TableColumn className="min-w-[100px]" key="tanggal">Tanggal</TableColumn>
            <TableColumn key="bill">Bill</TableColumn>
            <TableColumn key="keterangan" className="text-sm">Keterangan</TableColumn>
            <TableColumn key="cash_out">Debit</TableColumn>
            <TableColumn key="income">Kredit</TableColumn>
            <TableColumn key="balance">Saldo</TableColumn>
          </TableHeader>
          <TableBody
            items={paginatedData}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => {
              return (
                <TableRow
                  key={item?.bill}
                  onClick={() => {
                    if (item.type === "in") {
                      router.push(`/admin/transaction/view/${item.id_sale}`);
                    } else if (item.type === "out") {
                      router.push(`/admin/purchase/view/${item.id_purchase}`);
                    }
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {(columnKey) => (
                    <TableCell className={columnKey === "keterangan" ? "text-sm" : ""}>
                      {columnKey === "tanggal" ? (
                        moment(item.tanggal).format("DD-MM-YYYY")
                      ) : columnKey === "cash_out" ? (
                        item.cash_out.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })
                      ) : columnKey === "income" ? (
                        item.income.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })
                      ) : columnKey === "balance" ? (
                        item.balance.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            }}
          </TableBody>
        </Table>

      </div>
    </div>
  );
}
