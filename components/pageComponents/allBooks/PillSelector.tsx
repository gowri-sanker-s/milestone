"use client";

import React from "react";

type PillSelectorProps = {
  title: string;
  options: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
};

const PillSelector = ({
  title,
  options,
  selected,
  setSelected,
}: PillSelectorProps) => {
  const toggleOption = (option: string) => {
    setSelected((prev: string[]) =>
      prev.includes(option)
        ? prev.filter((item: string) => item !== option)
        : [...prev, option],
    );
  };
  return (
    <div className="">
      {title && (
        <h3 className="font-semibold text-[15px] mb-3 uppercase">{title}</h3>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`px-4 py-2 text-[14px] rounded-full font-semibold transition-all duration-200
                ${
                  isActive
                    ? "bg-primary-text text-primary-bg"
                    : "bg-primary-bg text-primary-text"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PillSelector;
