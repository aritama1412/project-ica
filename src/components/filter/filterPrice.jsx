"use client";
import { useState, useEffect } from "react";
import { SlArrowDown } from "react-icons/sl";
import useFilterStore from "@/../stores/filterStore";
import { Button, Input } from "@nextui-org/react";

function FilterPrice({ filterText }) {
  const [isVisible, setIsVisible] = useState(true);
  const filters = useFilterStore((state) => state.filters); // Access stored filters
  const setFilter = useFilterStore((state) => state.setFilter); // Set filters in the store

  // Initialize local states from the store or defaults
  const [minPrice, setMinPrice] = useState(filters.price?.min || 0);
  const [maxPrice, setMaxPrice] = useState(filters.price?.max || 500000);

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle the visibility state
  };

  const applyPriceFilter = () => {
    setFilter("price", { min: minPrice, max: maxPrice }); // Save to the store
  };

  // Sync local state with the store when the component mounts or filters change
  useEffect(() => {
    if (filters.price) {
      setMinPrice(filters.price.min || 0);
      setMaxPrice(filters.price.max || 500000);
    }
  }, [filters.price]);

  return (
    <div className="flex flex-col items-center w-[320px] sc3row:w-[280px] max-w-[320px] border mb-3 py-2 scmobile:mb-1 rounded-2xl shadow-lg">
      {/* Filter Header */}
      <div
        className="flex flex-row justify-between items-center px-5 scmobile:px-3 w-full cursor-pointer"
        onClick={toggleVisibility}
      >
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
            placeholder="0.00"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">Rp</span>
              </div>
            }
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            type="number"
          />

          <Input
            label="Harga Maximum"
            labelPlacement="outside"
            placeholder="0.00"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">Rp</span>
              </div>
            }
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            type="number"
          />

          <Button color="primary" variant="bordered" onClick={applyPriceFilter}>
            Terapkan
          </Button>
        </div>
      )}
    </div>
  );
}

export default FilterPrice;
