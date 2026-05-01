import React from "react";

const services = [
  {
    title: "Teeth Checkup",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#3b82f6" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 4 13.5 4 8.5a8 8 0 0116 0C20 13.5 12 21 12 21z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5v4M10 10.5h4" />
      </svg>
    ),
    image: "https://placehold.co/400x200/e0f0ff/3b82f6?text=Teeth+Checkup",
  },
  {
    title: "Teeth Whitening",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#3b82f6" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="4" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
    image: "https://placehold.co/400x200/e0f0ff/3b82f6?text=Teeth+Whitening",
  },
  {
    title: "Dental Braces",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#3b82f6" strokeWidth={1.5}>
        <rect x="3" y="9" width="18" height="6" rx="3" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h2M14 12h2" />
      </svg>
    ),
    image: "https://placehold.co/400x200/e0f0ff/3b82f6?text=Dental+Braces",
  },
  {
    title: "Teeth Implants",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#3b82f6" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4M9 7h6l1 5H8l1-5zM8 12v5a2 2 0 004 0M12 17v4" />
      </svg>
    ),
    image: "https://placehold.co/400x200/e0f0ff/3b82f6?text=Teeth+Implants",
  },
  {
    title: "Dental Filling",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#3b82f6" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l2 6-5 2-5-2 2-6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v10" />
      </svg>
    ),
    image: "https://placehold.co/400x200/e0f0ff/3b82f6?text=Dental+Filling",
  },
  {
    title: "Cosmetic",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="#3b82f6" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h6" />
      </svg>
    ),
    image: "https://placehold.co/400x200/e0f0ff/3b82f6?text=Cosmetic",
  },
];

const ServicesSection = () => {
  return (
    <section className="w-full bg-white py-14 px-4 md:px-10 lg:px-20">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase">
          Our Services
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1 mb-3">
          Services
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          Aenean commodo ligula aenean massa.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            {/* Image */}
            <div className="w-full h-48 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Icon + Title */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0">{service.icon}</div>
                <h3 className="text-gray-900 font-bold text-base">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Learn More */}
              <a
                href="#"
                className="inline-flex items-center gap-1 text-blue-500 text-sm font-semibold hover:gap-2 transition-all duration-200"
              >
                Learn More
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8l4 4-4 4M8 12h8" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default ServicesSection;