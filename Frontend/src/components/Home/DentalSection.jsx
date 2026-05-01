import { useState, useEffect, useRef } from "react";
import Doctor from "../../assets/Model.png";

const skills = [
  { label: "Dental and Mouth Care", percent: 95 },
  { label: "Cosmetic Treatment", percent: 87 },
];

const schedule = [
  { day: "Monday - Friday", time: "8AM - 10PM" },
  { day: "Saturday", time: "8AM - 10PM" },
  { day: "Sunday", time: "8AM - 10PM" },
];

function AnimatedBar({ percent, animate }) {
  return (
    <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
        style={{ width: animate ? `${percent}%` : "0%" }}
      />
    </div>
  );
}

export default function DentalSection() {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimate(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white overflow-hidden py-10 px-6 md:px-16 font-sans"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        {/* LEFT: Text + Skills */}
        <div className="flex flex-col gap-5 z-10">
          {/* Badge */}
          <span className="w-fit text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-3 py-1 bg-blue-50 tracking-wide">
            Why Choose Us
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Helping Your <br />
            <span className="text-gray-900">Dental Problems</span>
            <span className="text-blue-500 text-2xl ml-1">✦</span>
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient.
          </p>

          {/* Skill Bars */}
          <div className="flex flex-col gap-4 mt-2">
            {skills.map((skill) => (
              <div key={skill.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    {skill.label}
                  </span>
                  <span className="text-sm text-gray-500">{skill.percent}%</span>
                </div>
                <AnimatedBar percent={skill.percent} animate={animate} />
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Doctor Image */}
        <div className="relative flex justify-center items-end h-72 md:h-96">
          {/* Decorative circle behind */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 md:w-72 md:h-72 rounded-full bg-blue-50 z-0" />
          {/* Sparkle decorations */}
          <span className="absolute top-6 left-4 text-blue-400 text-xl animate-pulse">✦</span>
          <span className="absolute bottom-10 right-4 text-blue-300 text-sm animate-pulse delay-300">✦</span>

          {/* Doctor image placeholder — replace src with your image */}
          <img
            src={Doctor}
            alt="Doctor"
            className="relative z-10 h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* RIGHT: Consultation Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-snug">
              Don't Hesitate to Do <br /> Consultation
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec.
            </p>
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
            {schedule.map((item) => (
              <div
                key={item.day}
                className="flex justify-between items-center text-sm"
              >
                <span className="font-semibold text-gray-700">{item.day}</span>
                <span className="text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => alert("Calling +01234 567 890")}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white text-sm font-semibold py-3 rounded-xl shadow-md shadow-blue-200 mt-2"
          >
            Call +01234 567 890
          </button>
        </div>

      </div>
    </section>
  );
}