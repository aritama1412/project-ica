"use client";
import FilterSection from "../components/filter/filterSection.jsx";
import Navbar from "../components/navbar/navbar.jsx";
import Image from "next/image.js";
import NavbarHome from "@/components/navbar/navbarHome.jsx";
import Link from "next/link.js";

export default function Home() {

  return (
    <main className="flex flex-col justify-center w-full min-w-screen max-w-screen mx-auto h-full min-h-screen bg-red-500">
      <NavbarHome />
      <div className="relative w-full h-screen">
        <Image
          src="/images/home/01.jpg"
          alt="logo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-white text-4xl md:text-6xl font-bold">
              Pondok Daun
            </h1>
            <h1 className="text-white text-4xl md:text-6xl font-bold">
              Toko bunga andalanmu
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-full sm:min-h-[1200px] w-full bg-white mx-auto">
        <div className="flex flex-row min-h-[200px] sm:h-[400px] w-full max-w-[1280px] ">
          <div className="flex justify-center items-center w-1/2">
            <Image
              src="/images/home/07.jpg"
              alt="logo"
              height={300}
              width={300}
              className="object-cover rounded-lg max-h-[150px] max-w-[150px] sm:min-h-[300px] sm:min-w-[300px] "
            />
          </div>
          <div className="flex flex-col justify-center text-center gap-4 items-center w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold">Fresh</h1>
            <p className="text-sm md:text-lg font-bold text-gray-500">Bunga dari kami selalu segar dan merupakan kualitas terbaik.</p>
          </div>
        </div>
        <div className="flex flex-row min-h-[200px] sm:h-[400px] w-full max-w-[1280px] ">
          <div className="flex flex-col justify-center text-center gap-4 items-center w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold">Lengkap</h1>
            <p className="text-sm md:text-lg font-bold text-gray-500">Kami menyediakan berbagai kebutuhan berkebun anda seperti pot, pupuk dan sebagainya.</p>
          </div>
          <div className="flex justify-center items-center w-1/2">
            <Image
              src="/images/home/05.jpg"
              alt="logo"
              height={300}
              width={300}
              className="object-cover rounded-lg max-h-[150px] max-w-[150px] sm:min-h-[300px] sm:min-w-[300px] "
            />
          </div>
        </div>
        <div className="flex flex-row min-h-[200px] sm:h-[400px] w-full max-w-[1280px] ">
          <div className="flex justify-center items-center w-1/2">
            <Image
              src="/images/home/06.jpg"
              alt="logo"
              height={300}
              width={300}
              className="object-cover rounded-lg max-h-[150px] max-w-[150px] sm:min-h-[300px] sm:min-w-[300px] "
            />
          </div>
          <div className="flex flex-col justify-center text-center gap-4 items-center w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold">Mudah</h1>
            <p className="text-sm md:text-lg font-bold text-gray-500">Beli bunga keinginanmu tanpa harus melakukan registrasi.</p>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[300px]">
        <Image
          src="/images/home/08.jpg"
          alt="logo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col gap-3 justify-center items-center text-2xl">
            <Link href="/products" className="bg-black rounded-md hover:bg-amber-700 transition-all duration-300 ease-in-out border-1 border-white px-4 py-2 text-white font-bold min-w-[50px]">
              Beli sekarang 🌼
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
