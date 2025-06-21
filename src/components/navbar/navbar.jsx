"use client";
import Image from "next/image";
import logo from "../../../public/images/logos/logo1.jpg"; // Logo import

import { useState } from "react";
import Link from "next/link";
import useCart from "../../../stores/cartStore";
import { BiCart } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for hamburger and close

const Navbar = () => {
  const cart = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu

  return (
    <div className="flex flex-col justify-center items-center border-b-2 z-[10]">
      <div className="bg-[#EDE8DC] sticky flex flex-row justify-between w-full px-5 items-center">
        <Link href="/" className="cursor-pointer">
          <Image
            className="object-cover w-[100px] max-w-[100px] h-[100px] max-h-[100px] rounded-full hover:opacity-90 transition-opacity duration-300"
            src={logo} priority
            width={100}
            height={100}
            loading="eager"
            alt="flowers"
          />
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="text-2xl md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Menu Items */}
        <ul
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-[#EDE8DC] md:static md:flex md:flex-row md:gap-5 md:items-center md:w-auto font-bold text-[#664343]`}
        >
          <li
            className="cursor-pointer relative group transition-all duration-300 ease-in-out p-4 md:p-0 hover:text-[#006769]"
            onClick={() => {
              router.push("/products");
            }}
          >
            Katalog
          </li>
          <li
            className="cursor-pointer relative group transition-all duration-300 ease-in-out p-4 md:p-0 hover:text-[#006769]"
            onClick={() => {
              router.push("/search-order");
            }}
          >
            Cek Pesanan
          </li>
          <li className="p-4 md:p-0">
            <Link
              href="/checkout"
              // className="bg-[#006769] border-2 border-[#40A578] rounded-full text-[#FFFAE6] px-2 py-2 flex items-center justify-center hover:bg-[#40A578] transition-all duration-300"
              className="flex items-center gap-2 justify-center bg-[#006769] border-2 border-[#40A578] rounded-full text-[#FFFAE6] px-2 py-2  hover:bg-[#40A578] transition-all duration-300"
            >
              <BiCart className="w-8 h-8 " />
              {cart && cart.count > 0 && (
                // <span className="absolute top-4 right-3 p-3 scmobile:top-4 scmobile:right-6 flex items-center justify-center border-2 border-[#006769] w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                <span className="text-lg border-1 border-white rounded-full w-8 h-8 flex items-center justify-center">
                  {cart.count}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
