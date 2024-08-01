"use client";
import Image from "next/image";
import logo from "../../../public/images/logos/logo1.jpg";

import { useState } from "react";
import Link from "next/link";

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

  return (
    <div className="flex flex-col justify-center items-center sticky border-b-2 z-[1]">
      <div className="flex flex-row gap-10 w-full justify-start items-center pt-5 pb-3 scmobile:pt-0 scmobile:pb-0">
        <Link href="/" className="cursor-pointer">
          <Image
            className="object-cover w-[100px] max-w-[100px] h-[100px] max-h-[100px]"
            src={logo}
            width={100}
            height={100}
            loading="eager"
            alt="flowers"
          />
        </Link>
        <ul className="flex flex-row gap-10 scmobile:hidden scmed:gap-5 w-full justify-start items-center font-bold relative pl-4">
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
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
