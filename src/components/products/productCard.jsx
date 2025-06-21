"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import useFilterStore from "@/../stores/filterStore";
import useCart from "@/../stores/cartStore";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const filters = useFilterStore((state) => state.filters);

  const fetchProducts = async (page) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-all-products?category=${filters.category}&limit=20&offset=${(page - 1) * 20}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const products = await res.json();
      setProducts(products.data.products);
      setCurrentPage(products.data.currentPage);
      setTotalPages(products.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = async (products) => {
    let filtered = products;

    // Category Filter
    if (filters.category || filters.category === 0) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-all-products?category=${filters.category}&limit=20&offset=${(currentPage - 1) * 20}`
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

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    applyFilters(products);
  }, [products, filters]);

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [filters]);

  const [savedCart, setSavedCart] = useState([]);
  const cart = useCart();
  useEffect(() => {
    setSavedCart(cart.cart);
  }, [cart]);

  return (
    <>
      <div className="flex !flex-row w-full h-full">
        <div className="w-full grid grid-cols-2 gap-2 place-items-center lg:grid-cols-3 xl:grid-cols-4 mt-[20px]">
          {isLoading || filteredProducts.length === 0 ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col min-h-[310px] w-[175px] min-w-[175px] cursor-pointer rounded-md shadow-md animate-pulse bg-gray-200"
              >
                <div className="w-full h-[175px] bg-gray-300 rounded-t-md"></div>
                <div className="flex flex-col gap-1 p-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            ))
          ) : (
            filteredProducts.map((flower) => {
              const totalQuantityInCart = savedCart
                .filter((item) => item.id === flower.id_product)
                .reduce((total, item) => total + item.quantity, 0);

              const adjustedStock = Math.max(
                flower.stock - totalQuantityInCart,
                0
              );

              return (
                <Link
                  href={`/products/${flower.id_product}`}
                  key={flower.id_product}
                  className="flex flex-col min-h-[310px] w-[175px] min-w-[175px] cursor-pointer rounded-md shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
                >
                  <div className="relative flex justify-center rounded-lg w-full min-w-[175px]">
                    <Image
                      className="object-cover"
                      src={
                        flower.Images && flower.Images[0]
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${flower.Images[0].image}`
                          : "https://placehold.co/600x600?text=Image+Not+Found"
                      }
                      width={175}
                      height={175}
                      style={{ width: "175px", height: "175px" }}
                      loading="eager"
                      alt="flowers"
                      unoptimized={true}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x600?text=Image+Not+Found";
                        e.currentTarget.onerror = null; // Prevent infinite loop
                      }}
                    />
                    {flower.isBestseller && (
                      <span className="text-xs absolute top-0 right-0 pr-1 pl-2 pb-[1px] font-semibold rounded-bl-lg text-[#603F26] bg-[#F9E400]">
                        Paling Populer
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 p-2">
                    <p className="text-xs font-semibold line-clamp-2 break-words min-h-[40px]">
                      {flower.product_name}
                    </p>
                    <hr />
                    <p className="text-xs line-clamp-2 break-words min-h-[2rem]">
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
                      <span>Stok: {adjustedStock}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}

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
