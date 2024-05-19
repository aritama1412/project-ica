"use client";
import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";

function Filter({ data, filterText }) {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle the visibility state
  };

  return (
    <>
      <div className="flex flex-col items-center max-h-full w-[320px] max-w-[320px] border mb-3 rounded-2xl pt-2 shadow-lg">
        <div className="flex flex-row justify-between items-center px-5 py-1 w-full">
          <span className="font-bold">{filterText}</span>

          <label className="cursor-pointer flex items-center">
            <input
              type="checkbox"
              checked={!isVisible}
              onChange={toggleVisibility}
              className="hidden"
            />
            <SlArrowDown />
          </label>
        </div>
        <div className="flex flex-wrap overflow-y-hidden p-2 gap-1">
          {data.map((item) => (
            <div
              key={item.id}
              className={`flex flex-wrap cursor-pointer items-center overflow-y-hidden p-2 gap-1 border ${
                isVisible ? "" : "hidden"
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

export default Filter;
