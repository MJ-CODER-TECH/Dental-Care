import React from "react";
import doctorImg from "../../assets/Model.png";

const LandingPage = () => {
  return (
    <div className="w-full bg-gray-50 pt-6 ">

      {/* CONTAINER */}
<div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto flex items-center px-4 sm:px-8 md:px-12 lg:px-20">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">

          <span className="inline-block text-blue-600 bg-blue-100 px-3 py-1 rounded text-sm font-medium">
            👋 Hey! We Are Dentic
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
            Helping You to <br />
            Bring Back Your <br />
            <span className="text-blue-600">Happy Smile</span>
          </h1>

          <p className="text-gray-600 text-sm md:text-base max-w-lg mx-auto lg:mx-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa.
          </p>

          {/* FORM */}
          <div className="bg-white shadow-xl rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center max-w-xl mx-auto lg:mx-0">

            <input
              type="email"
              placeholder="Email Address"
              className="border p-2 rounded w-full"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="border p-2 rounded w-full"
            />

            <input
              type="date"
              className="border p-2 rounded w-full"
            />

            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto">
              Book Now
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">

          {/* BACKGROUND BOX */}
          <div className="absolute right-0 top-0 w-[90%] h-full bg-gray-100 rounded-xl hidden lg:block"></div>

        <img
  src={doctorImg}
  alt="Doctor"
  className="relative z-10 w-[320px] sm:w-[420px] md:w-[500px] xl:w-[600px] 2xl:w-[700px] object-contain"
/>

          {/* FLOAT CARD */}
          <div className="absolute top-6 left-4 sm:left-10 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 z-20">
            
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border" src="https://i.pravatar.cc/40?img=1" />
              <img className="w-8 h-8 rounded-full border" src="https://i.pravatar.cc/40?img=2" />
              <img className="w-8 h-8 rounded-full border" src="https://i.pravatar.cc/40?img=3" />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">180+</h3>
              <p className="text-xs text-gray-500">Satisfied Customer</p>
              <p className="text-yellow-400 text-sm">★★★★★</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;