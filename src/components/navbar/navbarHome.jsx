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
  
  return (
    <div className="flex flex-col justify-center items-center sticky border-b-2 z-[10] ">
      <div className="flex flex-row justify-center items-center w-full px-[15px] py-[10px] bg-[#EDE8DC] mx-auto">
        <Link href="/" className="cursor-pointer">
          <div className="relative w-[80px] h-[80px]">
            <Image
              className="object-cover rounded-full"
              src={logo} priority
              width={80}
              height={80}
              loading="eager"
              alt="flowers"
            />
          </div>
        </Link>
        <ul className="flex flex-row gap-10 hideNavBar:hidden scmed:gap-5 w-full items-center font-bold relative pl-4 text-[#664343]">
          <li
            className={`cursor-pointer relative group transition-all duration-300 ease-in-out`}
            onMouseEnter={() => setHoveredItem(null)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => router.push("/products") }
          >
            Katalog
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
          </li>
          <li
            className={`cursor-pointer relative group transition-all duration-300 ease-in-out`}
            onMouseEnter={() => setHoveredItem(null)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => router.push("/search-order") }
          >
            Cek Pesanan
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarHome;
