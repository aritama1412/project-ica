import React from "react";
import { ProductCard } from "./productCard";

const data = [
  {
    id: 1,
    name: "Mawar Putih",
    img: "/images/flowers/rose.jpg",
    description: "Bunga mawar wangi.",
    price: 15000,
    rating: 4.7,
    isBestseller: true,
    stocks: 25,
    category: "flowers",
  },
  {
    id: 2,
    name: "Mawar Merah",
    img: "/images/flowers/rose 3.jpg",
    description:
      "Dengan kelopak yang berwarna merah terang, mawar merah adalah simbol dari gairah dan keberanian.",
    price: 20000,
    rating: 4.8,
    isBestseller: true,
    stocks: 25,
    category: "flowers",
  },
  {
    id: 3,
    name: "Anggrek Kalimantan",
    img: "/images/flowers/anggrek 1.jpg",
    description:
      "Anggrek ungu melambangkan kemewahan dan keanggunan, sering dipandang sebagai simbol kekayaan.",
    price: 25000,
    rating: 4.6,
    isBestseller: false,
    stocks: 22,
    category: "flowers",
  },
  {
    id: 4,
    name: "Anggrek Putih",
    img: "/images/flowers/anggrek 2.jpg",
    description:
      "Anggrek adalah bunga eksotis yang sering ditanam di dalam pot dan memiliki berbagai warna.",
    price: 30000,
    rating: 4.5,
    isBestseller: false,
    stocks: 17,
    category: "flowers",
  },
  {
    id: 5,
    name: "Anggrek Kecil",
    img: "/images/flowers/anggrek 3.jpg",
    description:
      "Anggrek ungu adalah simbol dari kekuatan dan kebijaksanaan, menjadikannya pilihan yang elegan untuk dekorasi.",
    price: 18000,
    rating: 4.4,
    isBestseller: false,
    stocks: 18,
    category: "flowers",
  },
  {
    id: 6,
    name: "Bunga Matahari Besar",
    img: "/images/flowers/sunflower 1.jpg",
    description:
      "Bunga matahari melambangkan keceriaan dan kebahagiaan, sering dihubungkan dengan sinar matahari dan musim panas.",
    price: 25000,
    rating: 4.9,
    isBestseller: true,
    stocks: 27,
    category: "flowers",
  },
  {
    id: 7,
    name: "Bunga Matahari Kecil",
    img: "/images/flowers/sunflower 2.jpg",
    description:
      "Bunga matahari dikenal karena kemampuannya mengikuti arah matahari, melambangkan kesetiaan dan ketekunan.",
    price: 60000,
    rating: 4.7,
    isBestseller: true,
    stocks: 15,
    category: "flowers",
  },
  {
    id: 8,
    name: "Bunga Matahari Sedang",
    img: "/images/flowers/sunflower 3.jpg",
    description:
      "Bunga matahari memberikan kesan ceria dan penuh semangat, sering digunakan dalam rangkaian bunga untuk menyampaikan harapan baik.",
    price: 18000,
    rating: 4.6,
    isBestseller: false,
    stocks: 38,
    category: "flowers",
  },
];

const ProductSection = () => {
  return (
    // bg-green-400
    <div className="w-full grid scmobile:grid-cols-2 scmed:grid-cols-2 grid-cols-3 gap-1 place-items-center cursor-pointer">
      <ProductCard data={data} />
    </div>
  );
};

export default ProductSection;
