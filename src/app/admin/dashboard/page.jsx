"use client";
import Image from "next/image";
import logo from "../../../../public/images/logos/logo1.jpg";
import React, { useState } from "react";
import { Header } from "@/components/dashboard/header";
import SideBar from "@/components/dashboard/sideBar";
import Content from "@/components/dashboard/content";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("");

  return (
    <div className="flex flex-col mx-auto max-h-full min-h-screen  ">
      <Header logo={logo} />
      <div className="flex flex-row h-full">
        <SideBar setActiveMenu={setActiveMenu} />
        <h1 className="p-5 font-bold text-3xl">Hello Admin</h1>
        {/* <Content activeMenu={activeMenu} setActiveMenu={setActiveMenu} /> */}
      </div>
    </div>
  );
};

export default Dashboard;
