"use client";
import Image from "next/image";
import logo from "../../../public/images/logos/logo1.jpg"; // oke

import { useState } from "react";
import Link from "next/link";
import useCounter from "../../../stores/store";
import useCart from "../../../stores/cartStore";
import { BiCart } from "react-icons/bi";
import { useRouter } from "next/navigation";

const NavbarHome = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const counter = useCounter();
  const cart = useCart();
  const router = useRouter();
 
  const handleCekPesanan = () => {
    router.push("/search-order");
  };

  return (
    // <div className="flex flex-col justify-center items-center sticky border-b-2 z-[10] h-[100px] max-h-[100px]">
    <div className="flex flex-col justify-center items-center sticky border-b-2 z-[10] h-[100px] max-h-[100px]">
      {/* <div className="flex flex-row justify-center w-full px-[15px] py-[10px] bg-[#EDE8DC] "> */}
      <div className="flex flex-row justify-center w-full px-[15px] py-[10px] bg-[#EDE8DC]">
        <Link href="/" className="cursor-pointer">
          <div className="relative w-[80px] h-[80px]">
            <Image
              className="object-cover rounded-full"
              src={logo}
              width={80}
              height={80}
              loading="eager"
              alt="flowers"
            />
          </div>
        </Link>
        <ul className="flex flex-row gap-10 hideNavBar:hidden scmed:gap-5 w-full justify-start items-center font-bold relative pl-4 text-[#664343]">
          <li
            className={`cursor-pointer relative group transition-all duration-300 ease-in-out`}
            onMouseEnter={() => setHoveredItem(null)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => handleCekPesanan()}
          >
            Cek Pesanan
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
          </li>
        </ul>
        <div className="flex flex-row justify-center items-center ">
          <Link
            href="/checkout"
            // hover add shadow
            className="hover:shadow-md hover:shadow-black transition-all duration-300 ease-in-out rounded-full  p-3"
          >
            <BiCart className="w-8 h-8" />
            {cart && cart.count > 0 && (
              <span className="absolute top-9 right-6 p-3 scmobile:top-4 scmobile:right-6 flex items-center justify-center border-2 border-[#006769] w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                {cart && cart.count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarHome;
