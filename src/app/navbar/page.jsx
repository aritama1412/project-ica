import React from "react";

const Navbar = () => {
  return (
    <div className="flex flex-col justify-center items sticky">
      <div className="flex flex-row gap-10 w-full bg-yellow-400 justify-start items-center sticky pt-5 pb-3 font-bold">
        <span>Wanita</span>
        <span>Pria</span>
        <span>Sports</span>
        <span>Anak</span>
      </div>
    </div>
  );
};

export default Navbar;
