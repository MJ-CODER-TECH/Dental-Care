import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";
import TimeBar from "../Timer/TimeBar";

const TopNavbar = () => {
  return (
    <div className="w-full border-b border-gray-300 flex flex-col md:flex-row items-center justify-between px-4 py-2 text-center md:text-left">
      
      <h1 className="flex flex-wrap justify-center md:justify-start items-center text-gray-600 text-xs sm:text-sm gap-2">
        <FaPhoneAlt className="text-blue-900" />
        +91 896589456 |
        <FaMapLocation className="text-blue-900" />
        JI. Patimura II No. 18, Denpasar
      </h1>

      <div className="mt-1 md:mt-0">
        <TimeBar />
      </div>
    </div>
  );
};

export default TopNavbar;