import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Features = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#1c260f] via-[#1f2b12] to-[#141b0a]">
      <div className="w-11/12 mx-auto py-16 lg:py-24">
        
        {/* Heading */}
        <div className="mb-12">
          <h2
            data-aos="fade-up"
            className="text-3xl md:text-4xl font-semibold text-[#f4f6e8]"
          >
            Platform Features
          </h2>
          <p
            data-aos="fade-up"
            data-aos-delay="120"
            className="mt-3 max-w-2xl text-[#9aa36a]"
          >
            Built to support transparent reporting, controlled workflows, and accountable city service delivery.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <div
            data-aos="fade-up"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Role-Based Access
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Separate dashboards and permissions for citizens, staff, and administrators.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Issue Timeline Tracking
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Every action is recorded as read-only history to ensure transparency and auditability.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Smart Prioritization
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Boosted issues are highlighted and surfaced above normal reports for faster action.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Controlled Status Flow
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Staff can update issue progress only through predefined status transitions.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Secure Payments
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Supports issue boosting and premium subscriptions with transaction records.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="500"
            className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]"
          >
            <h3 className="text-xl font-semibold text-[#e6ecd1]">
              Data-Driven Dashboards
            </h3>
            <p className="mt-3 text-[#8e9960] leading-relaxed">
              Visual statistics and summaries help monitor issue trends and resolution progress.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
