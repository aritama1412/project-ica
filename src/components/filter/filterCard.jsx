"use client";
import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import useOpenFilterStore from "@/../stores/openFilterStore";
import useFilterStore from "@/../stores/filterStore";

function FilterCard({ data, filterText }) {
  const [isVisible, setIsVisible] = useState(true);
  const openFilter = useOpenFilterStore();
  const selectedCategory = useFilterStore((state) => state.filters.category);
  const setFilter = useFilterStore((state) => state.setFilter);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleFilterChange = (value) => setFilter("category", value);

  return (
    <div className="flex flex-col items-center w-[320px] sc3row:w-[280px] max-w-[320px] border mb-3 py-2 scmobile:mb-1 rounded-2xl shadow-lg">
      {/* Header */}
      <div
        className="flex flex-row justify-between items-center px-5 w-full cursor-pointer"
        onClick={toggleVisibility}
      >
        <span className="flex font-bold w-full text-center">{filterText}</span>
        <SlArrowDown
          className={`transition-transform ${isVisible ? "" : "rotate-180"}`}
        />
      </div>

      {/* Filter Content */}
      {!isVisible && (
        <div className="flex flex-wrap gap-1 px-3">
          {data.map((item) => (
            <div
              key={item.id_category}
              className={`flex items-center p-2 gap-1 border rounded-md cursor-pointer ${
                selectedCategory === item.id_category ? "bg-[#EDE8DC]" : ""
              }`}
              onClick={() => handleFilterChange(item.id_category)}
            >
              {item.code && (
                <span
                  style={{ backgroundColor: item.code }}
                  className="h-4 w-4 border border-gray-400 mr-2"
                ></span>
              )}
              <span className="font-bold">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterCard;
