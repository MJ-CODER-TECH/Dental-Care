import React from "react";
import doctorImg from "../../assets/Model2.jpg";
import { FaCheckCircle } from "react-icons/fa";
import Model3 from "../../assets/Model3.jpg";
import Model4 from "../../assets/Model4.jpg";

const AboutSection = () => {
  return (
    <div className="w-full bg-[#f5f5f7] py-12 md:py-20">
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 flex flex-col lg:flex-row items-center gap-12">

        {/* LEFT IMAGE */}
        <div className="w-full lg:w-1/2 relative flex justify-center">
          
          {/* Background Shape */}
          <div className="absolute w-[80%] h-[80%] bg-blue-100 rounded-3xl -z-10"></div>

          <img
            src={doctorImg}
            alt="Doctor"
            className="w-[280px] sm:w-[350px] md:w-[420px] lg:w-[680px] object-contain"
          />

          {/* Floating Circle Images */}
          <div className="absolute top-10 left-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white overflow-hidden shadow-md">
            <img className="w-full h-full object-cover" src={Model3} alt="" />
          </div>

          <div className="absolute bottom-10 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white overflow-hidden shadow-md">
            <img className="w-full h-full object-cover" src={Model4} alt="" />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">

          <span className="inline-block text-blue-600 bg-blue-100 px-3 py-1 rounded text-sm font-medium">
            More About Us
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            The Best Dental Clinic <br />
            That You Can Trust
          </h2>

          <p className="text-gray-600 text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
            natoque penatibus et magnis dis parturient.
          </p>

          <p className="text-gray-500 text-sm">
            Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt.
            Duis leo. Sed fringilla mauris sit amet nibh.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-gray-700 text-sm">Modern Equipment</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-gray-700 text-sm">Easy Online Appointment</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-gray-700 text-sm">Comfortable Clinic</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-600" />
              <span className="text-gray-700 text-sm">Always Monitored</span>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Learn More
            </button>

            <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition">
              Make an Appointment
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutSection;