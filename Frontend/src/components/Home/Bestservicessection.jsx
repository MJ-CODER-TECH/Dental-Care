import React from "react";
import Model5 from "../../assets/Model5.jpg";
import Model6 from "../../assets/Model6.jpg";
import Model7 from "../../assets/Model7.jpg";

const BestServicesSection = () => {
  return (
    <section className="w-full bg-white overflow-hidden">

      {/* ── DESKTOP & TABLET (md+): 2-col grid layout ── */}
      <div className="hidden md:grid md:grid-cols-2 md:h-[540px] lg:h-[600px]">

        {/* LEFT COLUMN: stacked top + bottom */}
        <div className="grid grid-rows-2 h-full">

          {/* TOP-LEFT: dental image (45%) + blue card (55%) */}
          <div className="flex">
            <div className="w-[45%] overflow-hidden">
              <img
                src={Model6}
                alt="Dental Tools"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[55%] bg-blue-600 flex flex-col justify-center px-6 lg:px-8 py-6">
              <h2 className="text-white text-lg lg:text-2xl font-bold leading-snug mb-3">
                The Best Services
              </h2>
              <p className="text-blue-100 text-xs lg:text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et magna.
              </p>
            </div>
          </div>

          {/* BOTTOM-LEFT: dark navy card (45%) + doctor team image (55%) */}
        <div className="flex">
  <div className="w-[45%] bg-[#0f1e3c] flex flex-col justify-center gap-2 px-5 lg:px-7 py-6">
    {/* justify-end → justify-center, added gap-2 */}
    <h3 className="text-white font-bold text-base lg:text-lg">
      Doctor
    </h3>
    <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
      sit amet, consectetur do eiusmod tempor lore et magna.
    </p>
  </div>
  <div className="w-[55%] overflow-hidden">
    <img
      src={Model7}
      alt="Doctor team"
      className="w-full h-full object-cover"
    />
  </div>
</div>

        </div>

        {/* RIGHT COLUMN: full height large dentist image */}
        <div className="overflow-hidden h-full">
          <img
            src={Model5}
            alt="Dentist treating patient"
            className="w-full h-full object-cover object-center"
          />
        </div>

      </div>

      {/* ── MOBILE (<md): stacked layout ── */}
      <div className="flex flex-col md:hidden">

        {/* 1. Dental image + Blue card */}
        <div className="flex h-48 sm:h-56">
          <div className="w-[40%] overflow-hidden">
            <img
              src={Model6}
              alt="Dental Tools"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-[60%] bg-blue-600 flex flex-col justify-center px-4 py-4">
            <h2 className="text-white text-sm sm:text-base font-bold leading-snug mb-1">
              The Best Services
            </h2>
            <p className="text-blue-100 text-xs leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et magna.
            </p>
          </div>
        </div>

        {/* 2. Large dentist image */}
        <div className="h-56 sm:h-72 overflow-hidden">
          <img
            src={Model5}
            alt="Dentist treating patient"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* 3. Dark navy card + Doctor team image */}
        <div className="flex h-40 sm:h-48">
          <div className="w-[45%] bg-[#0f1e3c] flex flex-col justify-end px-4 py-4">
            <h3 className="text-white font-bold text-sm mb-1">Doctor</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              sit amet, consectetur do eiusmod tempor lore et magna.
            </p>
          </div>
          <div className="w-[55%] overflow-hidden">
            <img
              src={Model7}
              alt="Doctor team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

    </section>
  );
};

export default BestServicesSection;