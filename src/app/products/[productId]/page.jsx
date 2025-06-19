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
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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
    };

    getProducts();
  }, []);

  const handleQuantity = (type) => {
    if (type === "+") {
      setQuantity((prev) => Math.min((product.stock || 1), prev + 1));
    } else if (type === "-") {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(product.stock || 1, val)));
  };

  const addToCart = () => {
    if (quantity > product.stock) {
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
        {product.Images && product.Images.length > 0 ? (
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
              />
            ))}
          </Carousel>
        ) : (
          <p>No images available for this product.</p>
        )}

        <div className="flex flex-col gap-5 w-full scmobile:px-4">
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

          {/* Desktop Actions */}
          <div className="flex flex-row gap-3 scmobile:hidden">
            <input
              type="number"
              min={1}
              max={product.stock || 1}
              className="rounded-md px-3 text-center border border-gray-500 w-[150px]"
              placeholder="Jumlah"
              value={quantity}
              onChange={handleInputChange}
            />
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`transition duration-300 px-10 py-3 w-[150px] text-gray-200 rounded-xl border-2
                ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#16423C] hover:bg-white hover:text-[#16423C] hover:border-[#16423C]"
                }`}
            >
              Beli
            </button>
            {addedToCart && (
              <div className="ml-3 text-green-600 font-semibold animate-pulse">
                ✔ Produk telah ditambahkan ke keranjang!
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="hidden scmobile:fixed scmobile:bottom-0 scmobile:left-0 scmobile:block scmobile:px-4 py-2 w-full bg-white shadow-[0px_-10px_40px_10px_rgba(0,_0,_0,_0.1)] border-t border-gray-300">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => handleQuantity("-")}
                  className="w-[32px] h-[32px] border border-gray-500 rounded-md"
                >
                  <svg viewBox="0 0 10 10" className="shopee-svg-icon">
                    <polygon points="0 4.5 10 4.5 10 5.5 0 5.5"></polygon>
                  </svg>
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.stock || 1}
                  value={quantity}
                  onChange={handleInputChange}
                  className="rounded-md px-3 text-center border border-gray-500 w-[75px]"
                />
                <button
                  onClick={() => handleQuantity("+")}
                  className="w-[32px] h-[32px] border border-gray-500 rounded-md"
                >
                  <svg viewBox="0 0 10 10" className="shopee-svg-icon">
                    <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5"></polygon>
                  </svg>
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`transition duration-300 px-10 py-3 w-[150px] rounded-xl border-2
                  ${
                    product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#16423C] text-gray-200 hover:bg-[#6A9C89] hover:text-gray-800 hover:border-gray-800"
                  }`}
              >
                Beli
              </button>
              {addedToCart && (
                <div className="absolute bottom-20 right-3 px-3 py-3 bg-white text-green-700 font-semibold animate-pulse">
                  ✔ Produk telah ditambahkan ke keranjang!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
