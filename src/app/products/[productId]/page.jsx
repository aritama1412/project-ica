"use client";
import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useCounter from "@/../stores/store";
import useCart from "@/../stores/cartStore";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useOpenFilterStore from "@/../stores/openFilterStore";

const Page = (data) => {
  const cart = useCart();
  const counter = useCounter();
  const openFilter = useOpenFilterStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    openFilter.setFilter(null);
    const getProducts = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-product?id=${data.params.productId}`,
        {
          cache: "no-store",
        }
      );
      const productJson = await res.json();
      setProduct(productJson.data);
      setIsLoading(false);
    };

    getProducts();
  }, []);

  const handleQuantity = (type) => {
    if (type === "+") {
      setQuantity((prev) => Math.min((product?.stock || 1), prev + 1));
    } else if (type === "-") {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(product?.stock || 1, val)));
  };

  const addToCart = () => {
    if (quantity > product?.stock) {
      alert("Jumlah melebihi stok yang tersedia!");
      return;
    }

    const item = {
      id: product.id_product,
      name: product.product_name,
      img: product.Images?.[0]?.image || null,
      price: product.price,
      quantity,
    };

    cart.add(item, quantity);
    setAddedToCart(true);

    // Reduce local stock
    const newStock = product.stock - quantity;
    setProduct((prev) => ({
      ...prev,
      stock: newStock,
    }));

    // Clamp quantity to new stock
    if (quantity > newStock) {
      setQuantity(newStock > 0 ? newStock : 1);
    }

    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-full min-h-screen scmobile:pb-[100px]">
      <Navbar />
      <div className="mt-10 ml-3 gap-9 flex flex-row scmobile:flex-col scmobile:mt-0 scmobile:ml-0 scmobile:gap-2">
        {isLoading ? (
          <div className="w-full h-[378px] max-h-[378px] rounded-lg scmobile:rounded-none bg-gray-200 animate-pulse"></div>
        ) : product.Images && product.Images.length > 0 ? (
          <Carousel
            arrows
            autoPlaySpeed={3000}
            containerClass="container"
            draggable
            infinite
            keyBoardControl
            pauseOnHover
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
              tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
            }}
            showDots
            slidesToSlide={1}
            swipeable
          >
            {product.Images.map((item, index) => (
              <Image
                key={index}
                src={
                  item.image
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.image}`
                    : "https://placehold.co/600x600?text=Image+Not+Found"
                }
                className="object-contain w-full h-[378px] max-h-[378px] rounded-lg scmobile:rounded-none"
                width={300}
                height={378}
                loading="eager"
                alt="product"
                unoptimized={true}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x600?text=Image+Not+Found";
                  e.currentTarget.onerror = null; // Prevent infinite loop
                }}
              />
            ))}
          </Carousel>
        ) : (
          <p>No images available for this product.</p>
        )}

        <div className="flex flex-col gap-5 w-full scmobile:px-4">
          {isLoading ? (
            <>
              <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
            </>
          ) : (
            <>
              <h1 className="line-clamp-2 text-2xl font-semibold">
                {product.product_name}
              </h1>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold">
                  {product.price
                    ? product.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      })
                    : 0}
                </h2>
                <span className="font-semibold">Stok: {product.stock}</span>
              </div>
              <h3 className="font-semibold border-t border-t-gray-300 pt-4">
                Informasi
              </h3>
              <p>{product.description}</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
