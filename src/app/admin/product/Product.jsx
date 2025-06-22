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
import ImageWithFallback from "@/components/admin/ImageWithFallback";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { MenuGridIcon } from "@/components/icons/MenuGridIcon";
import { showSuccessToast } from "@/components/toast/ToastNotification";

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
        data.status == 'success' ? setIsDeleted(true) : showErrorToast("Gagal menghapus produk.")
    );
  };

  useEffect(() => {
    if (isDeleted) {
      showSuccessToast("Produk berhasil dihapus.");
      window.location.reload(); // Full reload
      setTimeout(() => {
        router.push("/admin/product");
        setIsDeleted(false);
      }, 1500);
    }
  }, [isDeleted, router]);

  return (
    <div className="p-4 border border-gray-200 w-[calc(100%-255px)]">
      <h1 className="text-3xl">Produk</h1>
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            // showAnchorIcon
            as={Link}
            color="default"
            href="/admin/product/create"
            variant="shadow"
          >
            Tambah Barang
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
          aria-label="Table"
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
            <TableColumn key="image">Gambar</TableColumn>
            <TableColumn key="product_name">Produk</TableColumn>
            <TableColumn key="id_category">Katogori</TableColumn>
            <TableColumn key="price" align="center">Harga</TableColumn>
            <TableColumn key="stock" align="center">Stok</TableColumn>
            {/* <TableColumn key="description">Deskripsi</TableColumn> */}
            {/* <TableColumn key="rating">Rating</TableColumn> */}
            <TableColumn key="status_info" align="center">Status</TableColumn>
            <TableColumn key="action" align="center" width={25}>
                <div className="flex justify-center items-center">
                  <MenuGridIcon size="1rem" />
                </div>
              </TableColumn>
          </TableHeader>
          <TableBody items={paginatedData} loadingContent={<Spinner />} loadingState={loadingState}>
            {(item) => (
              <TableRow key={item?.id_product}>
                {(columnKey) => {
                
                  if (columnKey === "image") {
                    const imageUrl = item?.Images?.[0]?.image
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.Images[0].image}`
                      : "https://placehold.co/500x500?text=Not+Found";

                    return (
                      <TableCell>
                        <ImageWithFallback
                          src={imageUrl}
                          fallback="https://placehold.co/50x50"
                          alt={item?.product_name || "Product Image"}
                          width={50}
                          height={50}
                          className="max-h-[50px] max-w-[50px] object-cover rounded-md"
                        />
                      </TableCell>
                    );
                  }

                  if (columnKey === "id_category") {
                    return (
                      <TableCell>
                        {item?.Category?.name || "N/A"}
                      </TableCell>
                    );
                  }

                  if (columnKey === "price") {
                    return (
                      <TableCell className="text-right">
                        {item?.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,                          
                        })}
                      </TableCell>
                    );
                  }

                  if (columnKey === "action") {
                    return (
                      <TableCell>
                        <div className="relative flex items-center gap-2">
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
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell>
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
