"use client";
import { useState, useEffect } from "react";
import FilterCard from "./filterCard";
import { Checkbox } from "@heroui/checkbox";
import useFilterStore from "@/../stores/filterStore"; // Import the updated filter store
import useSWR from "swr";
import FilterPrice from "./filterPrice";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const FilterSection = () => {
  const { filters, setFilter, clearFilter } = useFilterStore();
  const [categories, setCategories] = useState([]);

  const { data: categoriesData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/get-all-categories`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (categoriesData) {
      // Add "All Categories" at the top of the categories list
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const handleCategoryChange = (categoryId) => {
    if (filters.category === categoryId) {
      clearFilter("category"); // Deselect if already selected
    } else {
      setFilter("category", categoryId); // Set the selected category
    }
  };

  return (
    <>
      {/* Category Filter: Always Open */}
      <div className="flex flex-col gap-2 w-full p-4 border border-gray-300 rounded-lg">
        <h3 className="font-bold text-lg text-gray-800">Kategori</h3>
        <div className="flex flex-col gap-1">
          {categories.map((category) => (
            <Checkbox
              key={category.id_category}
              color="success"
              isSelected={filters.category === category.id_category}
              onChange={() => handleCategoryChange(category.id_category)}
            >
              {category.name}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      {/* <div className="flex flex-col items-center w-[320px] sc3row:w-[280px] max-w-[320px] border mb-3 py-2 scmobile:mb-1 rounded-2xl shadow-lg"> */}
      <div className="flex flex-col items-center w-full border mb-3 py-2 rounded-2xl shadow-lg">
        <FilterPrice data={categories} filterText="Harga" />
      </div>

    </>
  );
};

export default FilterSection;
