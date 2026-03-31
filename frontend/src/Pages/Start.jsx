import React from "react";
import { Link } from "react-router-dom";
import main from "../assets/main.jpg";

const Start = () => {
  return (
    <div
      className="bg-cover bg-center h-screen pt-8 flex justify-between flex-col w-full"
      style={{ backgroundImage: `url(${main})` }}
    >
      <img
        className="w-auto h-16 absolute left-5 top-5 z-10"
        src="/goswift_logo.png"
        alt="GoSwift Logo"
      />
      <div className="bg-white w-full absolute bottom-5 pb-8 py-4 px-4">
        <h2 className="text-[30px] font-bold">Get Started with GoSwift</h2>
        <Link
          to="/login"
          className="flex items-center justify-center w-full bg-[#0052FF] text-white font-semibold py-3 rounded-xl mt-5 transition-colors hover:bg-blue-700"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
