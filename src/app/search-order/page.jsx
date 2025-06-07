"use client";
import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar";
import FilterSection from "../../components/filter/filterSection";
import { Input } from "@heroui/react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BiArrowToBottom } from "react-icons/bi";
import helper from "@/../helper/helper";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

const Page = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [invoice, setInvoice] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [details, setDetails] = useState([]);

  const search = () => {
    console.log(invoice);

    const getTransactions = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sales/check?invoice=${invoice}`,
        {
          cache: "no-store",
        }
      );
      const result = await res.json();
      setTransactions(result.data);
    };

    getTransactions();
  };

  const openDetail = (details) => {
    onOpen();
    setDetails(details);
    console.log(details);
  };

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
              onChange={(e) => setInvoice(e.target.value)}
              className="border-2 border-gray-200 hover:border-2 hover:border-[#fbba1c] rounded-lg focus-within:border-2 focus-within:border-[#fbba1c]"
            />
          </div>

          <button
            type="button"
            onClick={() => search()}
            className="flex flex-row gap-[6px] items-center justify-center bg-[#fbba1c] px-5 py-1 rounded-md hover:shadow-md"
          >
            Cari
            <BiSearchAlt2 className="mt-[2px]" />
          </button>
        </div>


        <div className="w-full bg-slate-100 overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-6 font-semibold text-center gap-2 mb-4 bg-[#fbba1c] p-4 rounded-t-2xl">
            <span className="col-span-1 text-left">Tanggal Order</span>
            <span className="col-span-1 text-right">Nomor Invoice</span>
            {/* <span className="col-span-1 text-right">Nomor HP</span> */}
            <span className="col-span-1 text-right">Total</span>
            <span className="col-span-1 text-right">Status</span>
            <span className="col-span-1 text-right">Estimasi diterima</span>
            <span className="col-span-1 text-right">#</span>
          </div>

          {transactions && transactions.length > 0 ? (
            transactions.map((item, index) => (
              <div
                key={index}
                className="min-w-[900px] grid grid-cols-6 text-center items-center gap-2 mb-2 px-4"
              >
                <span className="col-span-1 text-left">
                  {new Date(item.date_sale)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .replace(/\//g, "-")
                    .replace(",", "")}
                </span>
                <span className="col-span-1 text-right">{item.bill}</span>
                {/* <span className="col-span-1 text-right">
                  {item.customer_phone}
                </span> */}
                <span className="col-span-1 text-right">
                  {helper(item.grand_total)}
                </span>
                <span className="col-span-1 text-right">{item.status}</span>
                <span className="col-span-1 text-right">
                  {item.date_estimation
                    ? new Date(item.date_estimation)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")
                        .replace(",", "")
                    : "-"}
                </span>
                <span className="col-span-1 text-right">
                  <BiSearchAlt2
                    onClick={() => {
                      openDetail(item);
                    }}
                    className="float-right hover:bg-[#fbba1c] w-[40px] rounded-md"
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="min-w-[900px] grid grid-cols-6 text-center items-center gap-2 mb-2 px-4">
              <span className="col-span-1 text-left">-</span>
              <span className="col-span-1 text-right">-</span>
              <span className="col-span-1 text-right">-</span>
              <span className="col-span-1 text-right">-</span>
              <span className="col-span-1 text-right">-</span>
              <span className="col-span-1 text-right">-</span>
            </div>
          )}
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
                      <span className="col-span-1/4 text-right">Qty</span>
                      <span className="col-span-2 text-right">Total</span>
                    </div>
                    {details.SaleDetails && details.SaleDetails.length > 0 ? (
                      <>
                        {details.SaleDetails.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-6 text-center gap-2 mb-2"
                          >
                            <span className="col-span-3 text-left">
                              {item.Product.product_name || "-"} <br />
                              ({helper(item.price)})
                            </span>
                            <span className="col-span-1/4 text-right">
                              {item.quantity}
                            </span>
                            <span className="col-span-2 text-right">
                              {helper(item.sub_total)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t-2 pt-2 border-t-black">
                          <div className="grid grid-cols-6 font-semibold text-center gap-2 mb-4">
                            <span className="col-span-3 text-left">
                              Grand Total
                            </span>
                            <span className="col-span-1 text-right">
                              {details.SaleDetails.reduce(
                                (total, item) => total + item.quantity,
                                0
                              )}
                            </span>
                            <span className="col-span-2 text-right">
                              {helper(details.SaleDetails.reduce(
                                (total, item) => total + item.sub_total,
                                0
                              ))}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-6 text-center gap-2 mb-2">
                        <span className="col-span-6 text-center">
                          No Sale Details Available
                        </span>
                      </div>
                    )}
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
