"use client";
import Customer from "@/app/admin/dashboard/customer/Customer";
import CreateStockProduct from "@/app/admin/dashboard/stock-product/create/CreateStockProduct";
import StockProduct from "@/app/admin/dashboard/stock-product/StockProduct";
import Supplier from "@/app/admin/dashboard/supplier/Supplier";
import Transaction from "@/app/admin/dashboard/transaction/Transaction";
import React from "react";

export default function Content({ activeMenu, setActiveMenu }) {
  return (
    <>
      {/* <div className="sm:ml-64 bg-green-500 w-screen h-full min-h-screen"> */}
      <div className="w-full h-full ">
        {activeMenu === "transaction" && <Transaction />}
        {activeMenu === "customer" && <Customer />}
        {activeMenu === "supplier" && <Supplier />}
        {activeMenu === "stockProduct" && (
          <StockProduct setActiveMenu={setActiveMenu} />
        )}
        {activeMenu === "createStockProduct" && <CreateStockProduct />}
      </div>
      {/* </div> */}
    </>
  );
}
