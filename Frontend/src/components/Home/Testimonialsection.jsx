import React from "react";

const testimonials = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
    name: "José Correia",
    role: "Marketing Manager",
    image: "https://placehold.co/100x100/e0f0ff/3b82f6?text=JC",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
    name: "Agathe Dufour",
    role: "Company CEO",
    image: "https://placehold.co/100x100/e0f0ff/3b82f6?text=AD",
  },
];

const TestimonialSection = () => {
  return (
    <section className="w-full bg-white py-14 px-4 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT: Heading + description + button */}
        <div className="flex flex-col gap-5">
          {/* Badge */}
          <span className="w-fit text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-3 py-1 bg-blue-50 tracking-wide">
            Our Testimonial
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            The Honest Review <br /> From Our Client
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient.
          </p>

          {/* Button */}
          <button className="w-fit bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-md shadow-blue-200">
            See All Review
          </button>
        </div>

        {/* RIGHT: Testimonial cards */}
        <div className="flex flex-col gap-5">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote mark + text */}
              <div className="flex-1">
                {/* Blue quote icon */}
                <div className="text-blue-500 text-3xl font-serif leading-none mb-2 select-none">
                  ❝
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-3 italic">
                  {item.quote}
                </p>
                <p className="text-gray-900 font-bold text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.role}</p>
              </div>

              {/* Person image */}
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialSection;