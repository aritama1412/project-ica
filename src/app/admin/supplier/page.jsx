"use client";
import Image from "next/image";
import logo from "../../../../public/images/logos/logo1.jpg";
import React, { useState } from "react";
import { Header } from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import SupplierComponent from "./Supplier";

const SupplierPage = () => {
  const [activeMenu, setActiveMenu] = useState("");

  return (
    <div className="flex flex-col mx-auto max-h-full min-h-screen  ">
      <Header logo={logo} />
      <div className="flex flex-row h-full min-w-full">
        <SideBar setActiveMenu={setActiveMenu} />

        <SupplierComponent />
      </div>
    </div>
  );
};

export default SupplierPage;
