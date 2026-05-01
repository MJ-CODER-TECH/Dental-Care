import { useEffect, useState } from "react";
import { IoCalendarSharp } from "react-icons/io5";


const TimeBar = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();

    const formattedDate = now.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    setDate(formattedDate);
  }, []);

  return (
    <div className="w-full  text-gray-600 text-sm px-4 py-2 flex  items-center">
      <span className="flex items-center gap-2 "> <IoCalendarSharp className=' text-blue-900'/> Monday - Saturday</span>
      <span>{date}</span>
    </div>
  );
};

export default TimeBar;