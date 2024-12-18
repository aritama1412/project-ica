"use client";
import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import React, { useEffect } from "react";
import useCounter from "@/../stores/store";
import useCart from "@/../stores/cartStore";
import { useState } from "react";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useOpenFilterStore from "@/../stores/openFilterStore";
const colors = [
  { id: 1, name: "Red", code: "#FF0000" },
  { id: 2, name: "Green", code: "#00FF00" },
  { id: 3, name: "Blue", code: "#0000FF" },
  { id: 4, name: "Yellow", code: "#FFFF00" },
  { id: 5, name: "Cyan", code: "#00FFFF" },
  { id: 6, name: "Magenta", code: "#FF00FF" },
  { id: 7, name: "Black", code: "#000000" },
  { id: 8, name: "White", code: "#FFFFFF" },
  { id: 9, name: "Orange", code: "#FFA500" },
  { id: 10, name: "Purple", code: "#800080" },
  { id: 11, name: "Pink", code: "#FFC0CB" },
  { id: 12, name: "Brown", code: "#A52A2A" },
  { id: 13, name: "Gray", code: "#808080" },
];

const flowers = [
  {
    id: 1,
    name: "Mawar Merah",
    imgs: [
      "/images/flowers/rose.jpg",
      "/images/flowers/rose 2.jpg",
      "/images/flowers/rose 3.jpg",
    ],
    description: "Bunga mawar wangi.",
    price: 15000,
    rating: 4.7,
    isBestseller: true,
    stocks: 25,
    category: "flowers",
  },
  {
    id: 2,
    name: "Mawar Putih",
    imgs: [
      "/images/flowers/white-rose.jpg",
      "/images/flowers/white-rose-2.jpg",
      "/images/flowers/white-rose-3.jpg",
    ],
    description:
      "Dengan kelopak yang berwarna merah terang, mawar merah adalah simbol dari gairah dan keberanian.",
    price: 20000,
    rating: 4.8,
    isBestseller: true,
    stocks: 25,
    category: "flowers",
  },
  {
    id: 3,
    name: "Anggrek Kalimantan",
    imgs: [
      "/images/flowers/anggrek 1.jpg",
      "/images/flowers/anggrek 2.jpg",
      "/images/flowers/anggrek 3.jpg",
    ],
    description:
      "Anggrek ungu melambangkan kemewahan dan keanggunan, sering dipandang sebagai simbol kekayaan.",
    price: 25000,
    rating: 4.6,
    isBestseller: false,
    stocks: 22,
    category: "flowers",
  },
  {
    id: 4,
    name: "Anggrek Putih",
    imgs: [
      "/images/flowers/anggrek 4.jpg",
      "/images/flowers/anggrek-5.jpg",
      "/images/flowers/anggrek-6.jpg",
    ],
    description:
      "Anggrek adalah bunga eksotis yang sering ditanam di dalam pot dan memiliki berbagai warna.",
    price: 30000,
    rating: 4.5,
    isBestseller: false,
    stocks: 17,
    category: "flowers",
  },
  {
    id: 5,
    name: "Anggrek Kecil",
    imgs: [
      "/images/flowers/anggrek-7.jpg",
      "/images/flowers/anggrek-6.jpg",
      "/images/flowers/anggrek-5.jpg",
    ],
    description:
      "Anggrek ungu adalah simbol dari kekuatan dan kebijaksanaan, menjadikannya pilihan yang elegan untuk dekorasi.",
    price: 18000,
    rating: 4.4,
    isBestseller: false,
    stocks: 18,
    category: "flowers",
  },
  {
    id: 6,
    name: "Bunga Matahari Besar",
    imgs: [
      "/images/flowers/sunflower 1.jpg",
      "/images/flowers/sunflower-5.jpg",
      "/images/flowers/sunflower-6.jpg",
      "/images/flowers/sunflower-7.jpg",
    ],
    description:
      "Bunga matahari melambangkan keceriaan dan kebahagiaan, sering dihubungkan dengan sinar matahari dan musim panas.",
    price: 25000,
    rating: 4.9,
    isBestseller: true,
    stocks: 27,
    category: "flowers",
  },
  {
    id: 7,
    name: "Bunga Matahari Kecil",
    imgs: [
      "/images/flowers/sunflower 2.jpg",
      "/images/flowers/sunflower-5.jpg",
      "/images/flowers/sunflower-6.jpg",
      "/images/flowers/sunflower-7.jpg",
    ],
    description:
      "Bunga matahari dikenal karena kemampuannya mengikuti arah matahari, melambangkan kesetiaan dan ketekunan.",
    price: 60000,
    rating: 4.7,
    isBestseller: true,
    stocks: 15,
    category: "flowers",
  },
  {
    id: 8,
    name: "Bunga Matahari Sedang",
    imgs: [
      "/images/flowers/sunflower-7.jpg",
      "/images/flowers/sunflower-6.jpg",
      "/images/flowers/sunflower-5.jpg",
    ],
    description:
      "Bunga matahari memberikan kesan ceria dan penuh semangat, sering digunakan dalam rangkaian bunga untuk menyampaikan harapan baik.",
    price: 18000,
    rating: 4.6,
    isBestseller: false,
    stocks: 38,
    category: "flowers",
  },
];

const vases = [
  { id: 1, name: "Pot Plastik" },
  { id: 2, name: "Pot Gantung" },
  { id: 3, name: "Pot Semen" },
];

const services = [
  { id: 1, name: "Jasa Perawatan Taman" },
  { id: 2, name: "Pembuatan taman dan kolam" },
  { id: 3, name: "Menerima dekorasi taman pengantin" },
];

const Page = (data) => {
  const selected = flowers.find((item) => item.id == data.params.productId);
  const counter = useCounter();
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const openFilter = useOpenFilterStore();

  useEffect(() => {
    openFilter.setFilter(null);
    // eslint-disable-next-line
  }, []);

  const addToCart = () => {
    const item = {
      id: selected.id,
      name: selected.name,
      img: selected.img,
      price: selected.price,
      quantity: quantity,
    };

    cart.add(item, quantity); // Pass both item and quantity to add
  };

  const handleQuantity = (type) => {
    console.log("quantity before: ", quantity);
    if (type === "+") {
      setQuantity(quantity + 1);
    }
    console.log("quantity after: ", quantity);
  };
  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-full min-h-screen scmobile:pb-[100px]">
      <Navbar />
      <div className="mt-10 ml-3 gap-9 flex flex-row scmobile:flex-col scmobile:mt-0 scmobile:ml-0 scmobile:gap-2">
        {/* <Image
          className="object-cover w-[300px] max-w-[300px] scmobile:w-full scmobile:min-w-full h-[378px] max-h-[378px] rounded-lg scmobile:rounded-none"
          src={selected.img}
          width={300}
          height={378}
          loading="eager"
          width={100}
          height={100}
          alt="flowers"
        /> */}
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 1,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 1,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {selected.imgs.map((item, index) => (
            <Image
              key={index}
              src={item}
              // src="https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              // style={{
              //   display: "block",
              //   height: "100%",
              //   margin: "auto",
              //   width: "100%",
              // }}
              className="object-contain w-full scmobile:w-full scmobile:min-w-full h-[378px] max-h-[378px] rounded-lg scmobile:rounded-none"
              width={300}
              height={378}
              loading="eager"
              alt="flowers"
            />
          ))}
        </Carousel>
        <div className="flex flex-col gap-5 w-full scmobile:px-4">
          <h1 className="line-clamp-2 text-2xl font-semibold">
            {selected.name}
          </h1>
          <h2 className="text-3xl font-bold">
            {selected.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h2>
          <h3 className="font-semibold scmobile:mt-0 border-t border-t-gray-300 pt-4">
            Informasi
          </h3>
          <p>{selected.description}</p>
          <div className="flex flex-row gap-3 scmobile:hidden">
            <input
              type="number"
              min={0}
              className="rounded-md px-3 text-center border border-gray-500 w-[150px]"
              placeholder="Jumlah"
              defaultValue={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button
              onClick={() => addToCart()}
              className="transition duration-300 motion-reduce:transition-none
                  leading-normal active:bg-[#16423C] active:text-[#C4DAD2] ease-in-out
                  bg-[#16423C] px-10 py-3 w-[150px] text-gray-200 rounded-xl border-2
                  border-[#C4DAD2] hover:bg-[#fff] hover:text-[#16423C]
                  hover:border-[#16423C]"
            >
              Beli
            </button>
          </div>

          <div className="hidden scmobile:fixed scmobile:bottom-0 scmobile:left-0 scmobile:block scmobile:px-4 py-2 w-full inset-x-0 bg-white shadow-[0px_-10px_40px_10px_rgba(0,_0,_0,_0.1)] border-gray-300">
            <div className="flex flex-row items-center justify-between bottom-0">
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-[32px] h-[32px] px-1 border border-gray-500 rounded-md"
                >
                  <svg
                    enableBackground="new 0 0 10 10"
                    viewBox="0 0 10 10"
                    x="0"
                    y="0"
                    className="shopee-svg-icon"
                  >
                    <polygon points="4.5 4.5 3.5 4.5 0 4.5 0 5.5 3.5 5.5 4.5 5.5 10 5.5 10 4.5"></polygon>
                  </svg>
                </button>
                <input
                  type="number"
                  min={0}
                  className="rounded-md px-3 text-center border border-gray-500 w-[75px]"
                  placeholder="Jumlah"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-[32px] h-[32px] px-1 border border-gray-500 rounded-md"
                >
                  <svg
                    enableBackground="new 0 0 10 10"
                    viewBox="0 0 10 10"
                    x="0"
                    y="0"
                    className="shopee-svg-icon icon-plus-sign"
                  >
                    <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5"></polygon>
                  </svg>
                </button>
              </div>
              <button
                onClick={() => addToCart()}
                className="transition duration-300 motion-reduce:transition-none
                  leading-normal active:bg-gray-900 active:text-gray-100 ease-in-out
                  bg-[#16423C] px-10 py-3 w-[150px] text-gray-200 rounded-xl border-2
                  border-gray-50 hover:bg-[#6A9C89] hover:text-gray-800
                  hover:border-gray-800 "
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
