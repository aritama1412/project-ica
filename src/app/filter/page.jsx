import React from "react";
import FilterCard from "../components/filterCard.jsx";

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
  { id: 1, name: "Mawar" },
  { id: 2, name: "Melati" },
  { id: 3, name: "Anggrek" },
  { id: 4, name: "Kamboja" },
  { id: 5, name: "Lavender" },
];

const FilterBar = () => {
  return (
    <div className="flex flex-col items-center h-full w-[320px] max-w-[320px] mt-[60px]">
      <FilterCard data={colors} filterText="Warna" />
      <FilterCard data={flowers} filterText="Acara" />
    </div>
  );
};

export default FilterBar;
