"use client";
import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import useOpenFilterStore from "@/../stores/openFilterStore";

function FilterCard({ data, filterText }) {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility
  const openFilter = useOpenFilterStore();

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle the visibility state
  };

  const openFilterHandler = (filterText) => {
    openFilter.setFilter(data);
  };

  return (
    <>
      <div className="flex flex-col items-center w-[320px] sc3row:w-[280px] max-w-[320px] border mb-3 py-2 scmobile:mb-1 rounded-2xl shadow-lg">
        <div
          onClick={() => openFilterHandler(filterText)}
          className="hidden scmobile:flex flex-row justify-between items-center px-5 scmobile:px-3 w-full "
        >
          <span className="scmobile:text-center flex font-bold w-full whitespace-nowrap cursor-pointer">
            {filterText}
          </span>
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={!isVisible}
              onChange={toggleVisibility}
              className="hidden"
            />
            <SlArrowDown className="scmobile:hidden" />
          </label>
        </div>
        <div className="scmobile:hidden flex flex-row justify-between items-center px-5 scmobile:px-3 w-full ">
          <span className="scmobile:text-center flex font-bold w-full whitespace-nowrap cursor-pointer">
            {filterText}
          </span>
          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={!isVisible}
              onChange={toggleVisibility}
              className="hidden"
            />
            <SlArrowDown className="scmobile:hidden" />
          </label>
        </div>
        <div className="scmobile:hidden flex flex-wrap overflow-y-hidden gap-1">
          {data.map((item) => (
            <div
              key={item.id}
              className={`flex flex-wrap cursor-pointer items-center overflow-y-hidden ml-3 mt-2 p-2 gap-1 border ${
                isVisible ? "hidden" : ""
              }`}
            >
              <span
                style={{ backgroundColor: item.code }}
                className={`${
                  item.code ? "inline-block" : "hidden"
                } inline-block h-4 w-4 border border-gray-400 mr-2`}
              ></span>
              <span className="font-bold">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FilterCard;
