import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Reviews = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <section className="bg-[#eff0e1]">
      <div className="w-11/12 mx-auto py-14 lg:py-20">
        
        <div className="mb-10 max-w-3xl">
          <h2
            data-aos="fade-up"
            className="text-3xl md:text-4xl font-bold text-[#2d361b]"
          >
            User Feedback & Observations
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="120"
            className="mt-3 text-[#2d361b]/80"
          >
            Insights based on citizen experience and operational usage of the platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <div
            data-aos="fade-up"
            className="p-6 rounded-2xl bg-white border border-[#2d361b]/10"
          >
            <p className="text-[#2d361b]/80 leading-relaxed">
              “The reporting process is simple, and the issue status updates make follow-ups unnecessary.”
            </p>
            <p className="mt-4 font-semibold text-[#2d361b]">
              Citizen User
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="120"
            className="p-6 rounded-2xl bg-white border border-[#2d361b]/10"
          >
            <p className="text-[#2d361b]/80 leading-relaxed">
              “Clear task assignments and structured status flow help prioritize daily work effectively.”
            </p>
            <p className="mt-4 font-semibold text-[#2d361b]">
              Field Staff
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="240"
            className="p-6 rounded-2xl bg-white border border-[#2d361b]/10"
          >
            <p className="text-[#2d361b]/80 leading-relaxed">
              “The timeline view ensures accountability and reduces ambiguity during issue handling.”
            </p>
            <p className="mt-4 font-semibold text-[#2d361b]">
              Administrative Perspective
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Reviews;
