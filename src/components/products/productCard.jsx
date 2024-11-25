import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegStar } from "react-icons/fa6";

export const ProductCard = ({ data }) => {
  return (
    <>
      {data.map((flower) => (
        <Link
          href={`/products/${flower.id}`}
          key={flower.id}
          // bg-red-500
          className=" flex flex-col min-h-[350px] w-[175px] min-w-[175px] cursor-pointer rounded-md shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
        >
          <div key={flower.id} className="w-full ">
            <div className="relative flex justify-center rounded-lg w-full min-w-[175px]">
              <Image
                className="object-cover"
                src={flower.imgs[0]}
                width={175}
                height={175}
                style={{ width: "175px", height: "175px" }}
                loading="eager"
                alt="flowers"
              />
              {flower.isBestseller && (
                <span className="text-xs absolute top-0 right-0 pr-1 pl-2 pb-[1px] font-semibold rounded-bl-lg text-[#603F26] bg-[#F9E400]">
                  Paling Populer
                </span>
              )}
            </div>

            <div className="flex flex-col max-h-[75px] p-2">
              <p className="text-sm font-semibold scmobile:text-mobilexl line-clamp-2 break-words min-h-[45px] flex items-center">
                {flower.name}
              </p>
              <hr className="mb-2" />
              <p className="text-xs line-clamp-3 break-words min-h-[3.1rem] mb-2">
                {flower.description}
              </p>
              <div className="flex flex-row items-center justify-between">
                <h2 className="font-semibold">
                  {flower.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </h2>
              </div>
              <div className="flex flex-row items-center justify-between mt-2 text-xs">
                <div className="flex items-center bg-[#e5e7eb] px-2 rounded-md">
                  <FaRegStar />
                  <span className="pl-1 scmobile:text-mobilesm">
                    {flower.rating}
                  </span>
                </div>
                <span>Stok: {flower.stocks}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};
