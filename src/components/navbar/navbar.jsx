"use client";
import Image from "next/image";
import logo from "../../../public/images/logos/logo1.jpg"; // oke

import { useState } from "react";
import Link from "next/link";
import useCounter from "../../../stores/store";
import useCart from "../../../stores/cartStore";
import { BiCart } from "react-icons/bi";
import { useRouter } from "next/navigation";

const Dropdown = ({ items }) => (
  <ul className="bg-white absolute shadow-md rounded ml-[-16px]">
    {items.map((item, index) => (
      <li
        key={index}
        className="px-4 py-2 cursor-pointer w-[200px] font-normal text-sm hover:bg-gray-100"
      >
        {item}
      </li>
    ))}
  </ul>
);

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const counter = useCounter();
  const cart = useCart();
  const router = useRouter();

  const menuData = {
    Tanaman: ["Tanaman Hias", "Tanaman Toga", "Tanaman Buah-buahan"],
    Pot: ["Pot Plastik", "Pot Gantung", "Pot Semen"],
    "Media Tanam": ["Organik (Pupuk)", "Kokopit"],
    "Pupuk Kimia": ["Npk", "Tsp", "Orea", "Lanet"],
    Jasa: [
      "Jasa Perawatan Taman",
      "Pembuatan taman dan kolam",
      "Menerima dekorasi taman pengantin",
    ],
  };

  const handleCekPesanan = () => {
    router.push("/search-order");
  };

  return (
    <div className="flex flex-col justify-center items-center sticky border-b-2 z-[10] ">
      <div className="flex flex-row gap-10 w-full justify-start scmed:justify-between items-center pt-5 pb-3 px-8 scmobile:pt-0 scmobile:pb-0 bg-[#EDE8DC] ">
        <Link href="/" className="cursor-pointer">
          <Image
            className="object-cover w-[100px] max-w-[100px] h-[100px] max-h-[100px] rounded-full"
            src={logo}
            width={100}
            height={100}
            loading="eager"
            alt="flowers"
          />
        </Link>
        <ul className="flex flex-row gap-10 scmobile:hidden scmed:gap-5 w-full justify-start items-center font-bold relative pl-4 text-[#664343]">
          {Object.keys(menuData).map((key, index) => (
            <li
              key={index}
              className={`cursor-pointer relative ${
                hoveredItem === key
                  ? "group transition-all duration-300 ease-in-out"
                  : ""
              }`}
              onMouseEnter={() => setHoveredItem(key)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {key}
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>

              {hoveredItem === key && <Dropdown items={menuData[key]} />}
            </li>
          ))}
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
        <div className="flex flex-row gap-3">
          <Link
            href="/checkout"
            className="flex flex-row items-center justify-center gap-2 bg-[#40A578] border-2 border-[#006769] rounded-md text-[#FFFAE6] min-w-[100px] scmed:min-w-[50px] scmobile:min-w-[50px] px-3 scmed:px-1 scmobile:px-1 py-1"
          >
            <span>{cart && cart.count}</span>
            <BiCart />
            <span className="hidden sm:block scmed:hidden">Checkout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
