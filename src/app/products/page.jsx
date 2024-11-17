import React from "react";
import Navbar from "../../components/navbar/navbar";
import FilterSection from "../../components/filter/filterSection";
import ProductSection from "../../components/products/productSection";

const page = () => {
  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-full min-h-screen">
      <Navbar />
      <div className="flex flex-row gap-5">
        <FilterSection />
        <ProductSection />
      </div>
    </main>
  );
};

export default page;
