"use client";
import Image from "next/image";
import React from "react";
import { FaRegStar } from "react-icons/fa6";

export const ProductCard = ({ data }) => {
  return (
    <>
      {data.map((flower) => (
        <div
          className="flex flex-col max-w-[300px] max-h-[462px]  mb-10 mt-3 cursor-pointer"
          key={flower.id}
        >
          <div className="flex flex-row items-center justify-between w-full px-3 py-3">
            <div className="flex items-center bg-[#e5e7eb] px-2 rounded-md">
              <FaRegStar />
              <span className="pl-1">{flower.rating}</span>
            </div>

            <span
              className={`${
                flower.isBestseller
                  ? "font-bold px-2 text-[#34669F] bg-[#E5F2FF] rounded-md"
                  : "hidden"
              }`}
            >
              Paling Populer
            </span>
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              className="object-cover w-[300px] max-w-[300px] h-[378px] max-h-[378px]"
              src={flower.img}
              width={300}
              height={378}
              loading="eager"
              alt="flowers"
            />
          </div>
          <div className="flex grow flex-col max-h-[75px]">
            <h1 className="font-bold text-xl pt-1 mt-1">{flower.name}</h1>
            <p className="line-clamp-2 break-words min-h-[3.2rem]">
              {flower.description}
            </p>
            <h2 className="font-semibold">
              {flower.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h2>
          </div>
        </div>
      ))}
    </>
  );
};