"use client"
import FilterSection from "@/components/filter/filterSection";
import Navbar from "@/components/navbar/navbar";
import ProductCard from "@/components/products/productCard";
import { CiFilter } from "react-icons/ci";
import {useState} from "react";
// import {
  // Modal,
  // ModalContent,
  // ModalHeader,
  // ModalBody,
  // ModalFooter,
  // useDisclosure,
  // RadioGroup,
  // Radio,
// } from "@nextui-org/modal";
import { 
  Button, 
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  RadioGroup,
  Radio, } from "@nextui-org/react";
import { BiCart } from "react-icons/bi";
import Link from "next/link";

const Page = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <main className="flex flex-col w-screen max-w-[1280px] mx-auto h-full min-h-screen">
      <Navbar />
      <div className="flex flex-col sm:flex-row ">
        {/* <div className="flex flex-col gap-2 scmobile:flex-row scmobile:gap-2 scmobile:overflow-x-auto items-center h-full w-[320px] scmobile:w-full max-w-[320px] scmobile:max-w-full mt-[20px] scmobile:mt-1 scmobile:mb-1 px-2"> */}
          <div className="hidden sm:flex flex-col gap-2 items-center h-full w-[320px] max-w-[320px] mt-[20px] mb-1">
            <FilterSection />
          </div>
          <div className="flex flex-row justify-between items-center px-4 py-2 sm:hidden">
            <div onClick={onOpen} className="flex justify-start items-center h-[35px] gap-2 cursor-pointer bg-gray-200 px-2" >
              <CiFilter h={17} width={17} className="h-[17px] w-[17px]" />
              <span>Filter</span>
            </div>
            <Link
                href="/checkout"
                className="bg-[#006769] border-2 border-[#40A578] text-[#FFFAE6] px-2 py-2 flex items-center justify-center hover:bg-[#40A578] transition-all duration-300"
              >
              <BiCart h={17} width={17} className="h-[17px] w-[17px]" />
            </Link>
          </div>

        <div className="w-full flex flex-col gap-5 mb-5">
          <ProductCard />
        </div>

        <Modal isOpen={isOpen} placement={'bottom-center'} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Filter</ModalHeader>
              <ModalBody>
                <FilterSection />
              </ModalBody>
              {/* <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
      </div>
    </main>
  );
};

export default Page;
