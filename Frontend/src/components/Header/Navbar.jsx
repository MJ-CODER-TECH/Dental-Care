import React, { useState } from "react";
import TopNavbar from "./TopNavbar";
import Logo from "../../assets/DentalLogo.png";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold"
      : "hover:text-blue-500";

  return (
    <div>
      <TopNavbar />

      <div className="w-full h-20 px-4 md:px-10 flex justify-between items-center bg-white shadow-md">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Dental Care" className="w-12 h-12 md:w-16 md:h-16" />
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">
              Dental Care
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              Your Smile, Our Passion
            </p>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li>
            <NavLink to="/" className={linkClass}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass}>About Us</NavLink>
          </li>
          <li>
            <NavLink to="/services" className={linkClass}>Services</NavLink>
          </li>
          <li className="flex items-center cursor-pointer hover:text-blue-500">
            Page <IoIosArrowDown className="ml-1" />
          </li>
          <li>
            <NavLink to="/contact" className={linkClass}>Contact Us</NavLink>
          </li>
        </ul>

        {/* Desktop Button */}
        <NavLink to="/appointment" className="hidden md:block">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Book Appointment
          </button>
        </NavLink>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {menuOpen ? (
            <HiX size={28} onClick={() => setMenuOpen(false)} />
          ) : (
            <HiMenu size={28} onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4">
          <ul className="flex flex-col space-y-4 text-gray-700 font-medium">
            <li>
              <NavLink to="/" onClick={() => setMenuOpen(false)} className={linkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={() => setMenuOpen(false)} className={linkClass}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" onClick={() => setMenuOpen(false)} className={linkClass}>
                Services
              </NavLink>
            </li>
            <li className="flex items-center">
              Page <IoIosArrowDown className="ml-1" />
            </li>
            <li>
              <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={linkClass}>
                Contact Us
              </NavLink>
            </li>
          </ul>

          <NavLink to="/appointment" onClick={() => setMenuOpen(false)}>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Book Appointment
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;