"use client";

import { useState } from "react";

interface ToggleSwitchProps {
  initialValue?: boolean;
  onChange?: (value: boolean) => void;
}

export default function ToggleSwitch({ initialValue = false, onChange }: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState(initialValue);

  const handleToggle = () => {
    const next = !isOn;
    setIsOn(next);
    onChange?.(next);
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-[38px] h-6 flex items-center rounded-full transition-colors duration-200 focus:outline-none shadow-inner ${
        isOn ? "bg-[#00a847]" : "bg-[#eaeaea]"
      }`}
    >
      <div
        className={`w-[18px] h-[18px] bg-white rounded-full shadow transform transition-transform duration-200 ${
          isOn ? "translate-x-[17px]" : "translate-x-1"
        }`}
      />
    </button>
  );
}