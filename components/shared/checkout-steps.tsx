import React from "react";

const steps = [
  "User Login",
  "Shipping Address",
  "Payment Method",
  "Place Order",
];

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className=" px-4 py-6">
      <div className="relative flex items-center justify-between">
        {/* Connector line background */}
        <div className="absolute top-[15px] left-0 right-0 h-[2px] bg-primary-border" />

        {/* Active connector line */}
        <div
          className="absolute top-[15px] left-0 h-[2px] bg-primary-text transition-all duration-500 ease-in-out"
          style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isActive = index === current;

          return (
            <div
              key={index}
              className="relative flex flex-col items-center gap-2 z-1"
            >
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border
                  ${
                    isCompleted || isActive
                      ? "bg-primary-text text-primary-bg border-primary-text"
                      : "bg-primary-bg text-primary-text/50 border-primary-text/50"
                  }`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs min-w-max font-medium tracking-wide text-center max-w-[100px] leading-tight transition-all duration-300
                  ${isActive ? "text-primary-text opacity-100" : isCompleted ? "text-primary-text opacity-80" : "text-primary-text opacity-50"}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
