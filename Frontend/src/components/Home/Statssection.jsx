import { useState, useEffect, useRef } from "react";

const stats = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="white" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 4 13.5 4 8.5a8 8 0 0116 0C20 13.5 12 21 12 21z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5v4M10 10.5h4" />
      </svg>
    ),
    count: 1200,
    suffix: "+",
    label: "Happy Client",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="white" strokeWidth={1.5}>
        <rect x="3" y="7" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a4 4 0 018 0v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 11h18" />
      </svg>
    ),
    count: 15,
    suffix: "+",
    label: "Year Experience",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="white" strokeWidth={1.5}>
        <circle cx="12" cy="8" r="3" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-1a6 6 0 0112 0v1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v2m0 0l-1 1m1-1l1 1" />
      </svg>
    ),
    count: 70,
    suffix: "+",
    label: "Doctor & Staff",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="white" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="17" rx="2" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h2m4 0h2M8 18h2" />
      </svg>
    ),
    count: 340,
    suffix: "+",
    label: "Online Appointment",
  },
];

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

function StatCard({ icon, count, suffix, label, animate }) {
  const displayCount = useCountUp(count, 1600, animate);

  return (
    <div className="flex items-center gap-4">
      {/* Icon Box */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-200">
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-none">
          {displayCount.toLocaleString()}
          <span className="text-blue-500">{suffix}</span>
        </span>
        <span className="text-sm text-gray-400 mt-1">{label}</span>
      </div>
    </div>
  );
}

export default function StatsSection() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="w-full bg-blue-50 py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} animate={animate} />
        ))}
      </div>
    </section>
  );
}