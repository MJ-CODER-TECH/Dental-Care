import React from "react";
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";

// Pages import karo
import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Contact from "./Pages/Contact";
import Appointment from "./Pages/Appointment";

const App = () => {
  return (
    <div>
      <Navbar />

      {/* Routing Area */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;