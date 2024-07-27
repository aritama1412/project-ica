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
          className=" flex scmobile:min-w-[180px] scmobile:max-w-[180px] scmin:max-w-[280px] scmin:max-h-full scmin:min-h-[580px] scmobile:max-h-full scmobile:min-h-[350px]  flex-col max-w-[300px] max-h-full min-h-[580px] mt-3 cursor-pointer"
        >
          <div key={flower.id}>
            <div className="flex flex-row items-center justify-between w-full px-3 py-3 scmobile:px-[2px] scmobile:py-1">
              <div className="flex items-center bg-[#e5e7eb] px-2 rounded-md">
                <FaRegStar />
                <span className="pl-1 scmobile:text-mobilesm">
                  {flower.rating}
                </span>
              </div>

              <span
                className={`scmobile:text-mobilesm ${
                  flower.isBestseller
                    ? "font-bold px-2 text-[#34669F] bg-[#E5F2FF] rounded-md text-right"
                    : "hidden"
                }`}
              >
                Paling Populer
              </span>
            </div>
            <div className="flex justify-center rounded-lg w-full min-w-[150px]">
              <Image
                className="object-cover items-center w-[300px] max-w-[300px] h-[378px] max-h-[378px] scmobile:max-w-[179px] scmobile:max-h-[179px] scmin:max-w-[280px] scmin:max-h-[400px] scmin:min-h-full"
                src={flower.img}
                width={300}
                height={378}
                style={{ width: "300px", height: "378px" }}
                loading="eager"
                alt="flowers"
              />
            </div>
            <div className="flex flex-col max-h-[75px]">
              <p className="font-bold text-xl pt-1 mt-1 scmobile:text-mobilexl line-clamp-1 break-words min-h-[38px]">
                {flower.name}
              </p>
              <hr className="mb-2" />
              <p className="line-clamp-2 break-words min-h-[3.2rem] mb-2">
                {flower.description}
              </p>
              <hr className="mt-2" />

              <div className="flex flex-row items-center justify-between">
                <span>Stok: {flower.stocks}</span>
                <h2 className="font-semibold">
                  {flower.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </h2>
              </div>
              <hr />
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};
