"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaRegStar } from "react-icons/fa6";
import useFilterStore from "@/../stores/filterStore";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const filters = useFilterStore((state) => state.filters);

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch(
        `http://localhost:4000/products/get-all-products`,
        {
          cache: "no-store",
        }
      );
      const products = await res.json();
      setProducts(products.data);
    };

    getProducts();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const applyFilters = (products) => {
    let filteredProducts = products;

    // Category Filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.id_category === filters.category
      );
    }

    // Price Filter
    if (filters.price) {
      const { min, max } = filters.price;
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // Add more filters here...

    return filteredProducts;
  };

  const filteredProducts = applyFilters(products);

  return (
    <>
      {filteredProducts &&
        filteredProducts.length > 0 &&
        filteredProducts.map((flower) => (
          <Link
            href={`/products/${flower.id_product}`}
            key={flower.id_product}
            className=" flex flex-col min-h-[350px] w-[175px] min-w-[175px] cursor-pointer rounded-md shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <div key={flower.id_product} className="w-full ">
              <div className="relative flex justify-center rounded-lg w-full min-w-[175px]">
                <Image
                  className="object-cover"
                  src={`http://localhost:4000` + flower.Images[0].image}
                  width={175}
                  height={175}
                  style={{ width: "175px", height: "175px" }}
                  loading="eager"
                  alt="flowers"
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
                  {/* <div className="flex items-center bg-[#e5e7eb] px-2 rounded-md">
                    <FaRegStar />
                    <span className="pl-1 scmobile:text-mobilesm">
                      {flower.rating}
                    </span>
                  </div> */}
                  <span>Stok: {flower.stock}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </>
  );
}
