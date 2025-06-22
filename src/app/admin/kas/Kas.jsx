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

  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cashflow/get-cashflow`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

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

  const loadingState = isLoading || totalItems === 0 ? "loading" : "idle";

  // Paginated Data
  const paginatedData = React.useMemo(() => {
    return filteredData;
  }, [filteredData]);


  return (
    <div className="p-4 border border-gray-200 w-[calc(100%-255px)]">
      <h1 className="text-3xl">
        Kas:{" "}
        {data && data.data[0].balance.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        })}
      </h1>
      <div className="mt-10">
        <Table aria-label="Example table with client async pagination">
          <TableHeader>
            <TableColumn className="min-w-[100px]" key="tanggal">
              Tanggal
            </TableColumn>
            <TableColumn key="bill">Bill</TableColumn>
            <TableColumn key="keterangan" className="text-sm">
              Keterangan
            </TableColumn>
            <TableColumn key="income">Debit</TableColumn>
            <TableColumn key="cash_out">Kredit</TableColumn>
            <TableColumn className="min-w-[130px]" key="balance">
              Saldo
            </TableColumn>
          </TableHeader>
          <TableBody
            items={paginatedData}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
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
                {(columnKey) => {
                  if (columnKey === "tanggal") {
                    return (
                      <TableCell>
                        {moment(item.tanggal).format("DD-MM-YYYY")}
                      </TableCell>
                    );
                  }

                  if (columnKey === "cash_out") {
                    return (
                      <TableCell>
                        {item.cash_out.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                    );
                  }

                  if (columnKey === "income") {
                    return (
                      <TableCell>
                        {item.income.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                    );
                  }

                  if (columnKey === "balance") {
                    return (
                      <TableCell>
                        {item.balance.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                    );
                  }

                  if (columnKey === "keterangan") {
                    if (item.income > 0) {
                      return (
                        <TableCell className="text-sm">
                          <strong>Penjualan:</strong> {item.keterangan}
                        </TableCell>
                      );
                    }
                    if (item.cash_out > 0) {
                      return (
                        <TableCell className="text-sm">
                          <strong>Re-stock:</strong> {item.keterangan}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell className="text-sm">{item.keterangan}</TableCell>
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
