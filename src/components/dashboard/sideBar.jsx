"use client";
import { useEffect, useState } from "react";
import {
  BiSolidShoppingBag,
  BiSolidTruck,
  BiSolidUserCheck,
  BiSolidCartAdd,
  BiLogIn,
} from "react-icons/bi";
const menus = {
  stockProduct: {
    name: "Stok Produk",
    link: "/stock",
    icon: <BiSolidShoppingBag />,
  },
  supplier: {
    name: "Supplier",
    link: "/supplier",
    icon: <BiSolidTruck />,
  },
  // customer: {
  //   name: "Customer",
  //   link: "/customer",
  //   icon: <BiSolidUserCheck />,
  // },
  transaction: {
    name: "Transaksi Penjualan",
    link: "/transaction",
    icon: <BiSolidCartAdd />,
  },
  purchase: {
    name: "Transaksi Pembelian",
    link: "/purchase",
    icon: <BiSolidCartAdd />,
  },
  logout: {
    name: "Logout",
    link: "/logout",
    icon: <BiLogIn />,
  },
};

export default function SideBar({ setActiveMenu }) {
  const handleActiveMenu = (key) => {
    setActiveMenu(key);
  };

  // useEffect(() => {
  //   console.log("activeMenu", activeMenu);
  // }, [activeMenu]);

  return (
    <>
      <aside
        id="logo-sidebar"
        className="w-64 transition-transform -translate-x-full md:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 hidden md:block"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 pt-2 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {Object.keys(menus).map((key) => (
              <li key={key}>
                <div
                  onClick={() => handleActiveMenu(key)}
                  className="flex items-center p-2 cursor-pointer text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    {menus[key].icon}
                  </span>
                  <span className="ms-3">{menus[key].name}</span>
                </div>
              </li>
            ))}

            {/* <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
              </a>
            </li> */}
          </ul>
        </div>
      </aside>
    </>
  );
}
