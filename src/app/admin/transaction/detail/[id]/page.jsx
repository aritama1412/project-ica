"use client";
import logo from "../../../../../../public/images/logos/logo1.jpg";
import React, { useState } from "react";
import { Header } from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import DetailPage from "./DetailPage";

const Page = () => {
  const [activeMenu, setActiveMenu] = useState("");

  return (
    <div className="flex flex-col mx-auto max-h-full min-h-screen  ">
      <Header logo={logo} />
      <div className="flex flex-row h-full min-w-full w-full">
        <SideBar setActiveMenu={setActiveMenu} />

        <DetailPage />
      </div>
    </div>
  );
};

export default Page;