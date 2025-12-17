import React from "react";
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <section className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
      <div className="w-11/12 max-w-3xl text-center">

        <h1 className="text-7xl md:text-9xl font-extrabold text-[#2d361b]">
          404
        </h1>

        <p className="mt-4 text-2xl md:text-3xl font-semibold text-[#2d361b]">
          Page Not Found
        </p>

        <p className="mt-4 text-[#2d361b]/80 max-w-xl mx-auto leading-relaxed">
          The page you are trying to access does not exist or may have been moved.
          Please check the address or return to the homepage.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl px-8"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-10 text-sm text-[#2d361b]/60">
          CivicCare • Public Infrastructure Reporting System
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
