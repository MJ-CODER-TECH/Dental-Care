import React from "react";
import Model from "../../assets/Model.png"; // Replace with your actual doctor image
// ── Replace these with your actual image imports ──
// import Blog1 from "../../assets/Blog1.jpg";
// import Blog2 from "../../assets/Blog2.jpg";
// import Blog3 from "../../assets/Blog3.jpg";
// import DoctorCTA from "../../assets/DoctorCTA.jpg";

const blogs = [
  {
    image: "https://placehold.co/400x220/cce4f7/3b82f6?text=Blog+1",
    category: "News",
    categoryColor: "text-blue-500 bg-blue-50",
    title: "Oral Cancer Awareness: Signs, Symptoms, and Prevention",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque...",
  },
  {
    image: "https://placehold.co/400x220/cce4f7/3b82f6?text=Blog+2",
    category: "Tips",
    categoryColor: "text-blue-500 bg-blue-50",
    title: "The Dos and Don'ts of Teeth Whitening: Expert Advice",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque...",
  },
  {
    image: "https://placehold.co/400x220/cce4f7/3b82f6?text=Blog+3",
    category: "Health",
    categoryColor: "text-blue-500 bg-blue-50",
    title: "Oral Health for All Ages: Tips for Kids, Teens, and Adults",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque...",
  },
];

// ─────────────────────────────────────────────
// SECTION 1: Blogs
// ─────────────────────────────────────────────
const BlogsSection = () => {
  return (
    <section className="w-full bg-white py-14 px-4 md:px-10 lg:px-20">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase">
          Our Blogs
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1 mb-3">
          Blogs &amp;
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          Aenean commodo ligula eget dolor. Aenean massa.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              {/* Category badge over image bottom-left */}
              <span
                className={`absolute bottom-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${blog.categoryColor}`}
              >
                {blog.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-gray-900 font-bold text-sm md:text-base leading-snug mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed flex-1 mb-4">
                {blog.description}
              </p>
              {/* Read More */}
              <button className="w-fit bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5">
                Read More
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// SECTION 2: CTA — Become The Next Our
// ─────────────────────────────────────────────
const CTASection = () => {
  return (
    <section className="w-full bg-white py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto bg-blue-50 rounded-2xl overflow-hidden relative min-h-[260px] md:min-h-[300px] flex items-center">

        {/* LEFT: Text content */}
        <div className="flex flex-col gap-4 px-8 md:px-12 py-10 z-10 max-w-md">
          {/* Badge */}
          <span className="w-fit text-xs font-semibold text-gray-700 border border-gray-300 rounded-full px-3 py-1 bg-white tracking-wide">
            Contact Us
          </span>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Become The Next <br /> Our
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa.
          </p>

          {/* Button */}
          <button className="w-fit bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-md shadow-blue-200">
            Book an Appointment
          </button>
        </div>

        {/* RIGHT: Doctor image — absolute positioned */}
       <div className="hidden md:block absolute right-0 bottom-0 h-[115%] w-[50%] lg:w-[48%]">
  <img
    src={Model}
    alt="Doctor"
    className="w-full h-full object-contain object-bottom"
  />
  
</div>

        {/* Decorative circle behind doctor */}
        <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 w-52 h-52 lg:w-64 lg:h-64 rounded-full bg-blue-100 opacity-60" />

      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// Export both
// ─────────────────────────────────────────────
export { BlogsSection, CTASection };