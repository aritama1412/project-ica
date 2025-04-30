"use client";
import { useRef, useState } from "react";
import FilterCard from "./filterCard";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Checkbox } from "@nextui-org/checkbox";
import useOpenFilterStore from "@/../stores/openFilterStore";
import { useEffect } from "react";
import useSWR from "swr";
import FilterPrice from "./filterPrice";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const FilterSection = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [dataFilter, setDataFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const openFilter = useOpenFilterStore();
  const modalEl = useRef();

  useEffect(() => {
    console.log("openFilter", openFilter);
    if (openFilter && openFilter.filter !== null) {
      setDataFilter(openFilter.filter);
      onOpen();
    }
  }, [openFilter, onOpen, setDataFilter]);

  const closeFilterHandler = () => {
    openFilter.setFilter(null);
    setDataFilter([]);
    onClose(); // function to close your modal
  };

  
  const { data: categoriesData } = useSWR(
    `http://localhost:4000/categories/get-all-categories`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    console.log('categoriesData', categoriesData)
    if (categoriesData) {
      categoriesData.unshift({ id_category: 0, name: "Semua Kategori" });
      setCategories(categoriesData);
    }
  }, [categoriesData]);


  return (
    <div className="flex flex-col scmobile:flex-row scmobile:gap-2 scmobile:overflow-x-auto items-center h-full w-[320px] scmobile:w-full max-w-[320px] scmobile:max-w-full mt-[20px] scmobile:mt-1 scmobile:mb-1 px-2">
      <FilterCard data={categories} filterText="Kategori" />
      <FilterPrice data={categories} filterText="Harga" />
      <Modal
        isOpen={isOpen}
        placement={"bottom-center"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1" ref={modalEl}>
                {dataFilter && dataFilter[0].category}
              </ModalHeader>
              <ModalBody>
                {dataFilter &&
                  // <RadioGroup label="Select your favorite city">
                  //   <Radio value="buenos-aires">Buenos Aires</Radio>
                  //   <Radio value="sydney">Sydney</Radio>
                  //   <Radio value="san-francisco">San Francisco</Radio>
                  //   <Radio value="london">London</Radio>
                  //   <Radio value="tokyo">Tokyo</Radio>
                  // </RadioGroup>
                  dataFilter.map((item, index) => (
                    <Checkbox key={index} color="success">
                      {item.name}
                    </Checkbox>
                  ))}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => closeFilterHandler()}
                  // onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => closeFilterHandler()}
                  // onPress={onClose}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FilterSection;
