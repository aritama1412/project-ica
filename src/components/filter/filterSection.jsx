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

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const colors = [
  { id: 1, name: "Red", code: "#FF0000" },
  { id: 2, name: "Green", code: "#00FF00" },
  { id: 3, name: "Blue", code: "#0000FF" },
  { id: 4, name: "Yellow", code: "#FFFF00" },
  { id: 5, name: "Cyan", code: "#00FFFF" },
  { id: 6, name: "Magenta", code: "#FF00FF" },
  { id: 7, name: "Black", code: "#000000" },
  { id: 8, name: "White", code: "#FFFFFF" },
  { id: 9, name: "Orange", code: "#FFA500" },
  { id: 10, name: "Purple", code: "#800080" },
  { id: 11, name: "Pink", code: "#FFC0CB" },
  { id: 12, name: "Brown", code: "#A52A2A" },
  { id: 13, name: "Gray", code: "#808080" },
];

const flowers = [
  { id: 1, name: "Tanaman Hias", category: "flowers" },
  { id: 2, name: "Tanaman Toga", category: "flowers" },
  { id: 3, name: "Tanaman Buah-buahan", category: "flowers" },
];

const vases = [
  { id: 1, name: "Pot Plastik", category: "vases" },
  { id: 2, name: "Pot Gantung", category: "vases" },
  { id: 3, name: "Pot Semen", category: "vases" },
];

const services = [
  { id: 1, name: "Jasa Perawatan Taman", category: "services" },
  { id: 2, name: "Pembuatan taman dan kolam", category: "services" },
  { id: 3, name: "Menerima dekorasi taman pengantin", category: "services" },
];

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
      setCategories(categoriesData);
    }
  }, [categoriesData]);


  return (
    <div className="flex flex-col scmobile:flex-row scmobile:gap-2 scmobile:overflow-x-auto items-center h-full w-[320px] scmobile:w-full max-w-[320px] scmobile:max-w-full mt-[20px] scmobile:mt-1 scmobile:mb-1 px-2">
      <FilterCard data={flowers} filterText="Tanaman" />
      <FilterCard data={vases} filterText="Pot" />
      <FilterCard data={services} filterText="Jasa" />
      <FilterCard data={flowers} filterText="Media Tanam" />
      <FilterCard data={vases} filterText="Pupuk Kimia" />
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
