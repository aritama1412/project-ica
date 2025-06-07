"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BiSolidShoppingBag,
  BiSolidTruck,
  BiSolidCartAdd,
  BiLogIn,
  BiSolidDashboard,
  BiMoney,
  BiBarChartAlt,
  BiCartAlt,
  BiSolidStoreAlt,
} from "react-icons/bi";
import useSidebarAdmin from "@/../stores/sidebarAdminStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Install js-cookie if not already installed

const menus = {
  dashboard: {
    name: "Dashboard",
    link: "dashboard",
    icon: <BiBarChartAlt />,
  },
  stockProduct: {
    name: "Produk",
    link: "product",
    icon: <BiSolidStoreAlt />,
  },
  supplier: {
    name: "Supplier",
    link: "supplier",
    icon: <BiSolidTruck />,
  },
  transaction: {
    name: "Transaksi Penjualan",
    link: "transaction",
    icon: <BiSolidCartAdd />,
  },
  purchase: {
    name: "Transaksi Pembelian",
    link: "purchase",
    icon: <BiCartAlt />,
  },
  kas: {
    name: "Kas",
    link: "kas",
    icon: <BiMoney />,
  },
  logout: {
    name: "Logout",
    link: "#",
    icon: <BiLogIn />,
  },
};

export default function SideBar() {
  const activeMenu = useSidebarAdmin((state) => state.menu); // Access current `menu` state
  const setActiveMenu = useSidebarAdmin((state) => state.setMenu); // Access `setMenu` method
  const [lowStock, setLowStock] = useState(0);
  const router = useRouter();

  const handleActiveMenu = (key) => {
    setActiveMenu(key); // Update the menu value in the store
  };

  const handleLogout = () => {
    // Delete the authentication token
    Cookies.remove("authToken");

    // Redirect to the login page
    router.push("/admin/login");
  };

  useEffect(() => {
    console.log("activeMenu", activeMenu);
  }, [activeMenu]);

  const getLowStockUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-low-stock`;
  // Fetch functions
  const fetchLowStock = async () => {
    try {
      const response = await fetch(getLowStockUrl);
      const data = await response.json();
      console.log('data', data)
      // get length
      setLowStock(data.data.length)
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    fetchLowStock();

    // disable eslint
    // eslint-disable-next-line 
  }, []);

  return (
    <>
      <aside
        id="logo-sidebar"
        className="w-64 min-w-64 transition-transform -translate-x-full md:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 hidden md:block"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 pt-2 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {Object.keys(menus).map((key) => (
              <li key={key}>
                {key === "logout" ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-2 cursor-pointer text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group w-full"
                  >
                    <span className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      {menus[key].icon}
                    </span>
                    <span className="ms-3">{menus[key].name}</span>
                  </button>
                ) : (
                  <Link
                    href={`/admin/` + menus[key].link}
                    onClick={() => handleActiveMenu(menus[key].link)}
                    className={`flex items-center p-2 cursor-pointer ${
                      activeMenu === menus[key].link ? "bg-gray-200" : ""
                    } text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group`}
                  >
                    <span className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      {menus[key].icon}
                    </span>
                    <span className="ms-3 flex flex-row justify-between items-center w-full">
                      {menus[key].name} 
                      {menus[key].name == 'Dashboard' && lowStock && lowStock > 0? (
                        <h5 className="text-xs bg-red-500 px-2 text-white font-bold rounded-md">{lowStock}</h5> 
                      ): null}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
