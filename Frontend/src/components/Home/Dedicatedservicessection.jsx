import React from "react";
import DentistHero from "../../assets/Model5.jpg"; // apni image lagao

const DedicatedServicesSection = () => {
  return (
    <section className="w-full bg-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center min-h-[380px] md:min-h-[420px]">

        {/* LEFT: Text content */}
        <div className="flex-1 flex flex-col gap-5 px-6 md:px-12 lg:px-16 py-12 md:py-0">
          {/* Badge */}
          <span className="w-fit text-xs font-semibold text-gray-700 border border-gray-300 rounded-full px-3 py-1 bg-white tracking-wide">
            The Best Services
          </span>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Dedicated to Give You <br /> The Best Services
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
            natoque penatibus et magnis dis parturient.
          </p>

          {/* Button */}
          <button className="w-fit bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-md shadow-blue-200">
            Contact Us
          </button>
        </div>

        {/* RIGHT: Diagonal clipped image */}
        <div
          className="w-full md:w-[55%] lg:w-[60%] h-64 sm:h-80 md:h-[420px] flex-shrink-0 overflow-hidden"
          style={{
            clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <img
            src={DentistHero}
            alt="Dentist giving best services"
            className="w-full h-full object-cover object-center"
          />
        </div>

      </div>
    </section>
  );
};

export default DedicatedServicesSection;