"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import useFilterStore from "@/../stores/filterStore";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const filters = useFilterStore((state) => state.filters);

  const fetchProducts = async (page) => {
    const res = await fetch(
      `http://localhost:4000/products/get-all-products?category=${filters.category}&limit=20&offset=${(page - 1) * 20}`,
      {
        cache: "no-store",
      }
    );
    const products = await res.json();
    setProducts(products.data.products);
    setCurrentPage(products.data.currentPage);
    setTotalPages(products.data.totalPages);
  };

  const applyFilters = async (products) => {
    let filtered = products;

    // Category Filter
    if (filters.category || filters.category === 0) {
      const res = await fetch(
        `http://localhost:4000/products/get-all-products?category=${filters.category}&limit=20&offset=${(currentPage - 1) * 20}`
      );
      const filteredProductsData = await res.json();
      filtered = filteredProductsData.data.products;
    }

    // Price Filter
    if (filters.price) {
      const { min, max } = filters.price;
      filtered = filtered.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // Add more filters here...
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts(currentPage);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    // Apply filters whenever `products` or `filters` change    
    applyFilters(products);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filters]);

  useEffect(() => {
    // Reset pagination and fetch products when filters change
    setCurrentPage(1);
    fetchProducts(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <div className="flex !flex-row w-full h-full">
        <div className="w-full grid grid-cols-5 gap-2 place-items-center mt-[20px]">
          {filteredProducts.length > 0 &&
            filteredProducts.map((flower) => (
              <Link
                href={`/products/${flower.id_product}`}
                key={flower.id_product}
                className="flex flex-col min-h-[350px] w-[175px] min-w-[175px] cursor-pointer rounded-md shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <div key={flower.id_product} className="w-full">
                  <div className="relative flex justify-center rounded-lg w-full min-w-[175px]">
                    <Image
                      className="object-cover"
                      src={
                        flower.Images && flower.Images[0]
                          ? `http://localhost:4000${flower.Images[0].image}`
                          : "https://placehold.co/600x600?text=Image+Not+Found"
                      }
                      width={175}
                      height={175}
                      style={{ width: "175px", height: "175px" }}
                      loading="eager"
                      alt="flowers"
                      unoptimized={true}
                    />
                    {flower.isBestseller && (
                      <span className="text-xs absolute top-0 right-0 pr-1 pl-2 pb-[1px] font-semibold rounded-bl-lg text-[#603F26] bg-[#F9E400]">
                        Paling Populer
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col max-h-[75px] p-2">
                    <p className="text-sm font-semibold scmobile:text-mobilexl line-clamp-2 break-words min-h-[45px] flex items-center">
                      {flower.product_name}
                    </p>
                    <hr className="mb-2" />
                    <p className="text-xs line-clamp-3 break-words min-h-[3.1rem] mb-2">
                      {flower.description}
                    </p>
                    <div className="flex flex-row items-center justify-between">
                      <h2 className="font-semibold">
                        {flower.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </h2>
                    </div>
                    <div className="flex flex-row items-center justify-between mt-2 text-xs">
                      <span>Stok: {flower.stock}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
