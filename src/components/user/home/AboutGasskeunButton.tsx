"use client";
import React, { useState } from "react";
function AboutGasskeunButton() {
  const [show, setShowAbout] = useState(false);
  return (
    <>
      <div
        className={` ${
          show
            ? "h-[145rem] sm:h-[110rem] lg:h-[110rem] xl:h-[90rem]"
            : "h-[10rem]"
        } flex items-end relative`}
      ></div>
      {!show ? (
        <div className="hider_gradient h-20 w-full bg-gradient-to-b from-transparent to-white absolute bottom-0 left-0 z-40" />
      ) : (
        <></>
      )}
      <div
        className={`w-full flex justify-center mt-6 left-0 z-50 ${
          show ? "static" : "absolute"
        } bottom-0`}
      >
        <button
          className="text-primary-900"
          onClick={() => {
            setShowAbout((prev) => !prev);
          }}
        >
          {show ? "Sembuyikan" : "Baca Selengkapnya"}
        </button>
      </div>
    </>
  );
}

export default AboutGasskeunButton;
