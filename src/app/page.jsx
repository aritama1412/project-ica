"use client";
import ProductSection from "../components/products/productSection.jsx";
import FilterSection from "../components/filter/filterSection.jsx";
import Navbar from "../components/navbar/navbar.jsx";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import useOpenFilterStore from "@/../stores/openFilterStore";
import { useEffect } from "react";

export default function Home() {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const openFilter = useOpenFilterStore();

  // useEffect(() => {
  //   if (openFilter !== "") {
  //     onOpen();
  //   }
  // }, [openFilter, onOpen]);

  return (
    <main className="flex flex-col w-full min-w-screen max-w-[1280px] mx-auto h-full min-h-screen ">
      <Navbar />
      <div className="flex flex-row scmobile:flex-col gap-5 scmobile:gap-0 pb-8">
        <FilterSection />
        <ProductSection />
      </div>
      {/* <Modal
        isOpen={isOpen}
        placement={"bottom-center"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </main>
  );
}
