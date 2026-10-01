"use client";

import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

interface Props {
  onReset: () => void;
}

export default function ResetFilters({ onReset }: Props) {
  const [isRotating, setIsRotating] = useState(false);

  const handleReset = () => {
    setIsRotating(true);
    onReset();

    setTimeout(() => {
      setIsRotating(false);
    }, 500);
  };

  return (
    <button
      type="button"
      aria-label="Reset filters"
      title="Reset filters"
      onClick={handleReset}
      className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:border-[#444] focus:outline-none"
    >
      <span className={isRotating ? "reset-spin" : ""}>
        <FiRefreshCw size={17} />
      </span>
    </button>
  );
}
