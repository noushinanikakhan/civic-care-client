import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 20,
    });
  }, []);

  return (
    <section className="bg-[#eff0e1]">
      <div className="w-11/12 mx-auto py-12 lg:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            data-aos="fade-up"
            className="text-3xl md:text-4xl font-extrabold text-[#2d361b]"
          >
            How It Works
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="120"
            className="mt-3 text-[#2d361b]/80 leading-relaxed"
          >
            A structured workflow keeps reports actionable, accountable, and easy to follow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          <div
            data-aos="fade-up"
            className="p-6 rounded-3xl bg-white/60 border border-[#2d361b]/10"
          >
            <div className="flex items-center justify-between">
              <span className="badge bg-[#2d361b] text-[#d6d37c] border-none">
                Step 01
              </span>
              <span className="text-[#2d361b]/60 font-semibold">Citizen</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#2d361b]">
              Submit a Report
            </h3>
            <p className="mt-2 text-[#2d361b]/75">
              Add a title, details, photo, category, and location for quick verification.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="p-6 rounded-3xl bg-white/60 border border-[#2d361b]/10"
          >
            <div className="flex items-center justify-between">
              <span className="badge bg-[#2d361b] text-[#d6d37c] border-none">
                Step 02
              </span>
              <span className="text-[#2d361b]/60 font-semibold">Admin</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#2d361b]">
              Review & Assign
            </h3>
            <p className="mt-2 text-[#2d361b]/75">
              Validate the report, assign a staff member once, or reject when necessary.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="p-6 rounded-3xl bg-white/60 border border-[#2d361b]/10"
          >
            <div className="flex items-center justify-between">
              <span className="badge bg-[#2d361b] text-[#d6d37c] border-none">
                Step 03
              </span>
              <span className="text-[#2d361b]/60 font-semibold">Staff</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#2d361b]">
              Update Progress
            </h3>
            <p className="mt-2 text-[#2d361b]/75">
              Work through the allowed status steps and add notes for each milestone.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="p-6 rounded-3xl bg-white/60 border border-[#2d361b]/10"
          >
            <div className="flex items-center justify-between">
              <span className="badge bg-[#2d361b] text-[#d6d37c] border-none">
                Step 04
              </span>
              <span className="text-[#2d361b]/60 font-semibold">Tracking</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#2d361b]">
              Follow the Timeline
            </h3>
            <p className="mt-2 text-[#2d361b]/75">
              Every key action is recorded as read-only history for transparency.
            </p>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="350"
          className="mt-8 p-6 rounded-3xl bg-white/50 border border-[#2d361b]/10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-[#2d361b]">Priority Options</p>
              <p className="text-[#2d361b]/75">
                Boost urgent reports and unlock unlimited submissions with a premium subscription.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-warning text-[#2d361b]">Boost</span>
              <span className="badge badge-success text-white">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
