"use client";
import React from "react";
import Navbar from "../../components/navbar/navbar";
import FilterSection from "../../components/filter/filterSection";
import { Input } from "@nextui-org/react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BiArrowToBottom } from "react-icons/bi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const Page = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-full min-h-screen ">
      <Navbar />
      <div className="flex flex-col gap-5 pt-14 px-6  items-center">
        <div className="flex flex-col gap-7 bg-gray-200 w-full max-w-[900px] p-5 rounded-md items-center">
          <h1>Silahkan masukkan nomor telepon atau nomor resi pesanan anda</h1>
          <hr />

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              type="text"
              label="Nomor telelpon / nomor resi"
              className="border-2 border-gray-200 hover:border-2 hover:border-[#fbba1c] rounded-lg focus-within:border-2 focus-within:border-[#fbba1c]"
            />
          </div>

          <button
            type="button"
            className="flex flex-row gap-[6px] items-center justify-center bg-[#fbba1c] px-5 py-1 rounded-md hover:shadow-md"
          >
            Cari
            <BiSearchAlt2 className="mt-[2px]" />
          </button>
        </div>
        <div className="w-full bg-slate-100 ">
          <div className="grid grid-cols-6 font-semibold text-center gap-2 mb-4 bg-[#fbba1c] p-4 rounded-t-2xl">
            <span className="col-span-1 text-left">Tanggal</span>
            <span className="col-span-1 text-right">Nomor Invoice</span>
            <span className="col-span-1 text-right">Nomor HP</span>
            <span className="col-span-1 text-right">Total</span>
            <span className="col-span-1 text-right">Status</span>
            <span className="col-span-1 text-right">#</span>
          </div>

          <div className="grid grid-cols-6 text-center items-center gap-2 mb-2 px-4">
            <span className="col-span-1 text-left">13-11-2024 12:00</span>
            <span className="col-span-1 text-right">INV-ICA-RX001</span>
            <span className="col-span-1 text-right">082707332928</span>
            <span className="col-span-1 text-right">25000</span>
            <span className="col-span-1 text-right">Selesai</span>
            <span className="col-span-1 text-right">
              <BiSearchAlt2
                onClick={onOpen}
                className="float-right hover:bg-[#fbba1c] w-[40px] rounded-md"
              />
            </span>
          </div>
        </div>

        <Modal size={"5xl"} isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Detail
                </ModalHeader>
                <ModalBody>
                  <div className="w-full bg-slate-100 p-4">
                    <div className="grid grid-cols-6 font-semibold text-center gap-2 mb-4">
                      <span className="col-span-3 text-left">Produk</span>
                      <span className="col-span-1 text-right">Harga</span>
                      <span className="col-span-1/4 text-right">Qty</span>
                      <span className="col-span-1 text-right">Total</span>
                    </div>

                    <div className="grid grid-cols-6 text-center gap-2 mb-2">
                      <span className="col-span-3 text-left">
                        Bunga Matahari
                      </span>
                      <span className="col-span-1 text-right">35.000</span>
                      <span className="col-span-1/4 text-right">10</span>
                      <span className="col-span-1 text-right">350000</span>
                    </div>
                    <div className="border-t-2 pt-2 border-t-black">
                      <div className="grid grid-cols-6 font-semibold text-center gap-2 mb-4">
                        <span className="col-span-3 text-left">
                          Grand Total
                        </span>
                        <span className="col-span-1/4 text-right"></span>
                        <span className="col-span-1 text-right">12</span>
                        <span className="col-span-1 text-right">12</span>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
};

export default Page;
