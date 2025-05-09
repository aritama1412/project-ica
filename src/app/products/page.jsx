import React from "react";
import FilterSection from "@/components/filter/filterSection";
import ProductSection from "@/components/products/productSection";
import Navbar from "@/components/navbar/navbar";

const page = () => {
  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-full min-h-screen">
      <Navbar />
      <div className="flex flex-row gap-5 pb-[30px]">
        <FilterSection />
        <ProductSection />
      </div>
    </main>
  );
};

export default page;
