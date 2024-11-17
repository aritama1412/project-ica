import React from "react";
import FilterCard from "./filterCard";

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
  return (
    <div className="scmin:hidden flex flex-col items-center h-full w-[320px] max-w-[320px] mt-[20px]">
      {/* <FilterCard data={colors} filterText="Warna" /> */}
      <FilterCard data={flowers} filterText="Tanaman" />
      <FilterCard data={vases} filterText="Pot" />
      <FilterCard data={services} filterText="Jasa" />
    </div>
  );
};

export default FilterSection;
