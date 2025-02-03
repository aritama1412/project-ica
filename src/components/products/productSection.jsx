"use client";
// import { ProductCard } from "./productCard";
import ProductCard from "./productCard"; // Note the default import

// const ProductSection = () => {
const ProductSection = () => {
  return (
    // bg-green-400
    <div className="w-full grid scmobile:grid-cols-2 scmed:grid-cols-2 sc4row:grid-cols-4 sc3row:grid-cols-3 sc2row:grid-cols-2 grid-cols-5 gap-2 place-items-center mt-[20px]">
      {/* <div className="w-full flex flex-wrap gap-5 place-items-center cursor-pointer"> */}
      <ProductCard />
    </div>
  );
};

export default ProductSection;
