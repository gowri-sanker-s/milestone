"use client";

import Lottie from "lottie-react";
import animationData from "@/assets/animations/loader.json";

const Loading = () => {
  return (
    <>
      <div className="h-screen w-full grid place-items-center">
        <div className="w-70 h-70">
          <Lottie animationData={animationData} loop={true} />
        </div>
      </div>
    </>
  );
};

export default Loading;
