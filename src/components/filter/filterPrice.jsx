"use client";
import { useState, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl";
import useFilterStore from "@/../stores/filterStore";
import { Button, Input } from "@heroui/react";

function FilterPrice({ filterText }) {
  const [isVisible, setIsVisible] = useState(true);
  const filters = useFilterStore((state) => state.filters); // Access stored filters
  const setFilter = useFilterStore((state) => state.setFilter); // Set filters in the store

  // Initialize local states from the store or defaults
  // const [minPrice, setMinPrice] = useState(filters.price?.min || 0);
  // const [maxPrice, setMaxPrice] = useState(filters.price?.max || 500000);
  const [minPrice, setMinPrice] = useState(filters.price?.min?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.price?.max?.toString() || "");


  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle the visibility state
  };

  const applyPriceFilter = () => {
    // setFilter("price", { min: minPrice, max: maxPrice }); // Save to the store
    setFilter("price", { 
      min: minPrice === "" ? 0 : Number(minPrice), 
      max: maxPrice === "" ? 500000 : Number(maxPrice),
    });
  };

  const clearPriceFilter = () => {
    // setMinPrice(0);
    // setMaxPrice(500000);
    // setFilter("price", { min: 0, max: 500000 }); // Reset the store
    setMinPrice("");
    setMaxPrice("");
    setFilter("price", { min: 0, max: 500000 });
  };

  // Sync local state with the store when the component mounts or filters change
  useEffect(() => {
    if (filters.price) {
      // setMinPrice(filters.price.min || 0);
      // setMaxPrice(filters.price.max || 500000);
      setMinPrice(filters.price.min?.toString() || "");
      setMaxPrice(filters.price.max?.toString() || "");
    }
  }, [filters.price]);

  return (
    <>
      {/* Filter Header */}
      {/* <div
        className="flex flex-row justify-between items-center px-5 scmobile:px-3 w-full cursor-pointer"
        onClick={toggleVisibility}
      > */}
      <div className="hidden">
        <span className="scmobile:text-center flex font-bold w-full whitespace-nowrap">
          {filterText}
        </span>
        <SlArrowDown
          className={`${isVisible ? "" : "rotate-180"} transition-transform`}
        />
      </div>

      {/* Filter Content */}
      {isVisible && (
        <div className="mt-2 flex flex-col gap-4 w-full px-5">
          <Input
            label="Harga Minimum"
            labelPlacement="outside"
            placeholder="1.000"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">Rp</span>
              </div>
            }
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            type="number"
          />

          <Input
            label="Harga Maximum"
            labelPlacement="outside"
            placeholder="500.000"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">Rp</span>
              </div>
            }
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
          />

          <div className="flex flex-row justify-center gap-2">
            <Button color="primary" className="w-full" variant="bordered" onClick={applyPriceFilter}>
              Terapkan Harga
            </Button>
            <Button color="danger" className="w-full" variant="bordered" onClick={clearPriceFilter}>
              Hapus filter
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default FilterPrice;
