"use client";

import { FaChevronUp } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Görgetés a tetejére"
      className=" shadow flex items-center justify-center rounded-full bg-neutral-900 w-[40px] h-[40px] fixed right-[20px] bottom-[20px] z-10 text-white hover:bg-neutral-800 transition-all duration-300 shadow-md"
    >
      <FaChevronUp size={24} />
    </button>
  );
}
