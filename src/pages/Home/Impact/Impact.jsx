import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Impact = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#1c260f] via-[#1f2b12] to-[#141b0a]">
      <div className="w-11/12 mx-auto py-16 lg:py-24">
        
        <div className="max-w-3xl mb-12">
          <h2
            data-aos="fade-up"
            className="text-3xl md:text-4xl font-semibold text-[#f4f6e8]"
          >
            Why CivicCare Matters
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="120"
            className="mt-3 text-[#9aa36a]"
          >
            Effective public service delivery depends on visibility, structure, and accountability.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <div
            data-aos="fade-up"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Transparency
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Citizens can monitor progress without repeated follow-ups or manual inquiries.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Accountability
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Every action is recorded, ensuring responsibility across administrative roles.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Faster Resolution
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Structured workflows reduce delays and improve response coordination.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Data-Driven Decisions
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Aggregated issue data supports planning and infrastructure improvement.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Citizen Engagement
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Empowers residents to actively participate in maintaining public spaces.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Impact;
