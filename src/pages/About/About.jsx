import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <section className="bg-[#eff0e1]">
      <div className="w-11/12 mx-auto py-12 lg:py-16">
        {/* Header */}
        <div className="max-w-4xl">
          <h1
            data-aos="fade-up"
            className="text-3xl md:text-5xl font-extrabold text-[#2d361b]"
          >
            About CivicCare
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="120"
            className="mt-4 text-[#2d361b]/80 text-base md:text-lg leading-relaxed"
          >
            CivicCare is a public infrastructure issue reporting system designed to improve
            transparency, coordination, and accountability in city service delivery.
          </p>
        </div>

        {/* Why it exists */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div
            data-aos="fade-up"
            className="p-7 rounded-2xl bg-white/60 border border-[#2d361b]/10"
          >
            <h2 className="text-2xl font-bold text-[#2d361b]">Why CivicCare Exists</h2>
            <p className="mt-3 text-[#2d361b]/80 leading-relaxed">
              Municipal issues often remain unresolved due to unclear ownership, slow follow-up,
              and a lack of unified tracking. CivicCare provides one centralized workflow where
              reports can be verified, assigned, updated, and closed with visibility for everyone.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="120"
            className="p-7 rounded-2xl bg-white/60 border border-[#2d361b]/10"
          >
            <h2 className="text-2xl font-bold text-[#2d361b]">What You Can Report</h2>
            <ul className="mt-4 space-y-2 text-[#2d361b]/80">
              <li>• Streetlight faults and electrical hazards</li>
              <li>• Road damage, potholes, and unsafe surfaces</li>
              <li>• Water leakage and drainage problems</li>
              <li>• Garbage overflow and sanitation issues</li>
              <li>• Damaged footpaths and public access obstacles</li>
            </ul>
          </div>
        </div>

        {/* How the workflow works */}
        <div
          data-aos="fade-up"
          className="mt-10 p-7 rounded-2xl bg-white/60 border border-[#2d361b]/10"
        >
          <h2 className="text-2xl font-bold text-[#2d361b]">How the Workflow Operates</h2>
          <p className="mt-3 text-[#2d361b]/80 leading-relaxed">
            CivicCare follows a structured reporting lifecycle. Citizens submit issues with evidence
            and location. Admin reviews and assigns available staff. Staff updates progress through
            defined status transitions. Each important action creates a read-only timeline entry,
            ensuring a reliable audit trail from report to closure.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="p-5 rounded-2xl bg-[#eff0e1] border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Step 01</p>
              <p className="text-[#2d361b]/80 mt-1">Citizen submits issue</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#eff0e1] border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Step 02</p>
              <p className="text-[#2d361b]/80 mt-1">Admin assigns staff</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#eff0e1] border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Step 03</p>
              <p className="text-[#2d361b]/80 mt-1">Staff updates status</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#eff0e1] border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Step 04</p>
              <p className="text-[#2d361b]/80 mt-1">Timeline preserves history</p>
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="mt-12">
          <h2
            data-aos="fade-up"
            className="text-2xl md:text-3xl font-bold text-[#2d361b]"
          >
            Roles in CivicCare
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div
              data-aos="fade-up"
              className="p-7 rounded-2xl bg-white border border-[#2d361b]/10"
            >
              <h3 className="text-xl font-bold text-[#2d361b]">Citizen</h3>
              <p className="mt-3 text-[#2d361b]/80">
                Submits issues, tracks progress, upvotes public importance, and can boost priority
                or subscribe for premium access.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="120"
              className="p-7 rounded-2xl bg-white border border-[#2d361b]/10"
            >
              <h3 className="text-xl font-bold text-[#2d361b]">Staff</h3>
              <p className="mt-3 text-[#2d361b]/80">
                Works only on assigned issues, updates progress through approved status steps,
                and helps close issues with clear operational notes.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="240"
              className="p-7 rounded-2xl bg-white border border-[#2d361b]/10"
            >
              <h3 className="text-xl font-bold text-[#2d361b]">Admin</h3>
              <p className="mt-3 text-[#2d361b]/80">
                Reviews reports, assigns staff (one-time assignment), rejects invalid submissions,
                manages users/staff, and monitors payments.
              </p>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div
          data-aos="fade-up"
          className="mt-12 p-7 rounded-2xl bg-gradient-to-br from-[#1c260f] via-[#1f2b12] to-[#141b0a] border border-[#2f3a1a]"
        >
          <h2 className="text-2xl font-semibold text-[#f4f6e8]">
            Transparency & Integrity Principles
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="p-5 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
              <p className="font-semibold text-[#e6ecd1]">Read-only timelines</p>
              <p className="mt-2 text-[#8e9960]">
                Timeline entries cannot be edited or deleted to preserve audit history.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
              <p className="font-semibold text-[#e6ecd1]">Controlled actions</p>
              <p className="mt-2 text-[#8e9960]">
                Role and status rules prevent unauthorized edits, votes, and workflow skips.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
