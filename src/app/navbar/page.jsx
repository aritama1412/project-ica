import React from "react";

const Navbar = () => {
  return (
    <div className="flex flex-col justify-center items sticky">
      <div className="flex flex-row gap-10 w-full justify-start items-center pt-5 pb-3">
        <div className="flex flex-row gap-10 w-full justify-start items-center font-bold">
          <span>Bunga</span>
          <span>Pot</span>
          <span>Pupuk</span>
          <span>Media Tanam</span>
          <span>Perkakas</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
