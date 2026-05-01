import React from "react";
import { FaTooth } from "react-icons/fa";
import { GiToothbrush } from "react-icons/gi";
import { MdHealthAndSafety } from "react-icons/md";

const Startigy = () => {
  return (
    <div className="w-full bg-gray-100 py-10">
      
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <FaTooth className="text-blue-600 text-3xl" />
          </div>
          <h1 className="font-semibold text-xl">Affordable Price</h1>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <GiToothbrush className="text-blue-600 text-3xl" />
          </div>
          <h1 className="font-semibold text-xl">Professional Dentist</h1>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <MdHealthAndSafety className="text-blue-600 text-3xl" />
          </div>
          <h1 className="font-semibold text-xl">Satisfactory Service</h1>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Startigy;