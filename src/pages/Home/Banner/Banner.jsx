import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import heroImg from "../../../assets/banner.jpg"; // put your image path
import { Link } from "react-router";

const Banner = () => {

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
      <div className="w-11/12 mx-auto py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: Text */}
          <div>
            <div
              data-aos="fade-down"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2d361b]/20 text-[#2d361b] bg-white/40"
            >
              <span className="font-semibold">Public Infrastructure Reporting</span>
              <span className="opacity-70">•</span>
              <span className="opacity-80">Report • Track • Resolve</span>
            </div>

            <h1
              data-aos="fade-up"
              data-aos-delay="100"
              className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2d361b] leading-tight"
            >
              Report City Issues.
              <br />
              Track Progress.
              <br />
              See Results.
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-5 text-[#2d361b]/80 text-base md:text-lg leading-relaxed"
            >
              CivicCare provides a centralized platform for reporting public infrastructure issues and monitoring their lifecycle through verified administrative and staff updates.
            </p>

            {/* CTA buttons */}
            <div
              data-aos="zoom-in"
              data-aos-delay="300"
              className="mt-7 flex flex-col sm:flex-row gap-3"
            >
              {/* Later: link this to Report Issue (or login if not logged in) */}
         <button className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none text-xs sm:text-sm md:text-base">
  Cities work best when citizens speak up and systems listen.
</button>


            <Link to='/all-issues' className="btn btn-outline rounded-2xl border-2 border-[#2d361b] text-[#2d361b] hover:bg-[#2d361b] hover:text-[#d6d37c]">
                Browse All Issues           
            </Link>
            </div>

            {/* Highlights */}
            <div
              data-aos="fade-up"
              data-aos-delay="350"
              className="mt-8 grid sm:grid-cols-3 gap-3"
            >
              <div className="p-4 rounded-2xl bg-white/50 border border-[#2d361b]/10">
                <p className="font-semibold text-[#2d361b]">Verified Workflow</p>
                <p className="text-sm text-[#2d361b]/70">Citizen → Admin → Staff</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 border border-[#2d361b]/10">
                <p className="font-semibold text-[#2d361b]">Live Timeline</p>
                <p className="text-sm text-[#2d361b]/70">Every action tracked</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 border border-[#2d361b]/10">
                <p className="font-semibold text-[#2d361b]">Priority Support</p>
                <p className="text-sm text-[#2d361b]/70">Boost + Premium</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Image + Floating Cards */}
          <div className="relative">
            <div
              data-aos="fade-left"
              className="rounded-3xl overflow-hidden border border-[#2d361b]/10 shadow-sm bg-white/60"
            >
              <img
                src={heroImg}
                alt="CivicCare Banner"
                className="w-full h-[320px] md:h-[420px] object-cover"
              />
            </div>

            {/* Floating card 1 */}
            <div
              data-aos="fade-up"
              data-aos-delay="250"
              className="absolute -bottom-6 left-4 md:left-8 w-[85%] md:w-[70%] p-4 rounded-2xl bg-white border border-[#2d361b]/10 shadow"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#2d361b]">Issue Status</p>
                <span className="badge badge-warning text-[#2d361b]">In-Progress</span>
              </div>
              <p className="mt-2 text-sm text-[#2d361b]/70">
                Assigned staff updates appear instantly on the timeline.
              </p>
            </div>

            {/* Floating card 2 */}
            <div
              data-aos="fade-right"
              data-aos-delay="350"
              className="absolute top-5 right-4 md:right-8 p-4 rounded-2xl bg-white border border-[#2d361b]/10 shadow w-[220px]"
            >
              <p className="font-bold text-[#2d361b]">Boosted Priority</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="badge badge-success text-white">High</span>
                <span className="text-sm text-[#2d361b]/70">Visible above normal</span>
              </div>
            </div>

            {/* Spacer for bottom floating card */}
            <div className="h-10 md:h-12" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
