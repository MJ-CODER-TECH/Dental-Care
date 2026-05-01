import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0f1e3c] text-white">

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* COL 1: Logo + description + social */}
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 4 13.5 4 8.5a8 8 0 0116 0C20 13.5 12 21 12 21z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5v3M10.5 10h3" />
              </svg>
            </div>
            <div>
              <p className="text-white font-extrabold text-lg tracking-widest uppercase leading-none">
                Dental
              </p>
              <p className="text-gray-400 text-[9px] tracking-[0.2em] uppercase">
                Always Smile
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-1">
            {/* Twitter/X */}
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-colors duration-200 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-colors duration-200 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-colors duration-200 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-colors duration-200 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* COL 2: Helpful Link */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm">Helpfull Link</h4>
          <div className="w-8 h-0.5 bg-blue-500 rounded-full" />
          <ul className="flex flex-col gap-2.5">
            {["Privacy Policy", "Support", "FAQ", "Terms & Conditions"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 text-xs hover:text-blue-400 transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COL 3: Support */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm">Support</h4>
          <div className="w-8 h-0.5 bg-blue-500 rounded-full" />
          <ul className="flex flex-col gap-2.5">
            {["Privacy Policy", "Support", "FAQ", "Terms & Conditions"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 text-xs hover:text-blue-400 transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COL 4: Contact Us */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm">Contact Us</h4>
          <div className="w-8 h-0.5 bg-blue-500 rounded-full" />

          {/* Email input + button */}
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-600 bg-[#0f1e3c]">
            <input
              type="email"
              placeholder="Your Email Address..."
              className="flex-1 bg-transparent text-xs text-gray-300 placeholder-gray-500 px-3 py-2.5 outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white text-xs font-semibold px-4 py-2.5 flex-shrink-0">
              Sign Up
            </button>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-gray-400 text-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 5 13.5 5 9a7 7 0 0114 0c0 4.5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>Jl. Patimura II No. 18, Denpasar</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.02L7.5 9.5a16 16 0 006.99 7l1.5-1.62a1 1 0 011.02-.23l3.3 1.1a1 1 0 01.69.95V19a2 2 0 01-2 2C9.16 21 3 14.84 3 7V5z" />
            </svg>
            <span>+01234 587 890</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-gray-400 text-xs">Dental</span>
          <span className="text-gray-400 text-xs">
            Copyright © 2023. All rights reserved
          </span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;