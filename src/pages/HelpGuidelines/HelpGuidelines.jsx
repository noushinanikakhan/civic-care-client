import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HelpGuidelines = () => {
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
            Help & Guidelines
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="120"
            className="mt-4 text-[#2d361b]/80 text-base md:text-lg leading-relaxed"
          >
            Clear instructions, common questions, and platform rules—so submissions are accurate
            and updates remain reliable.
          </p>
        </div>

        {/* Quick Start */}
        <div
          data-aos="fade-up"
          className="mt-12 p-7 rounded-2xl bg-white/60 border border-[#2d361b]/10"
        >
          <h2 className="text-2xl font-bold text-[#2d361b]">Quick Start</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-[#eff0e1] border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Before you submit</p>
              <ul className="mt-3 space-y-2 text-[#2d361b]/80">
                <li>• Use a specific title (what + where).</li>
                <li>• Add a clear photo that matches the location.</li>
                <li>• Choose the correct category for faster handling.</li>
                <li>• Write short, factual details (avoid opinions).</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#eff0e1] border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">After submission</p>
              <ul className="mt-3 space-y-2 text-[#2d361b]/80">
                <li>• Watch progress from your dashboard.</li>
                <li>• Use “View Details” to see the timeline.</li>
                <li>• Edit is allowed only while still pending.</li>
                <li>• Priority options are available if needed.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Guide */}
        <div
          data-aos="fade-up"
          data-aos-delay="120"
          className="mt-10 p-7 rounded-2xl bg-white/60 border border-[#2d361b]/10"
        >
          <h2 className="text-2xl font-bold text-[#2d361b]">Status Guide</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-5 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Pending</p>
              <p className="mt-2 text-[#2d361b]/80">
                Awaiting admin review or staff allocation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">In Progress</p>
              <p className="mt-2 text-[#2d361b]/80">
                Work has started under assigned staff.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Working</p>
              <p className="mt-2 text-[#2d361b]/80">
                Active field activity is underway.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Resolved</p>
              <p className="mt-2 text-[#2d361b]/80">
                The problem has been fixed.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Closed</p>
              <p className="mt-2 text-[#2d361b]/80">
                Final completion after resolution.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">Rejected</p>
              <p className="mt-2 text-[#2d361b]/80">
                Invalid entry or insufficient information.
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-[#2d361b]/70">
            Note: The timeline is read-only to preserve history.
          </p>
        </div>

        {/* FAQ */}
        <div data-aos="fade-up" className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2d361b]">FAQ</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="p-6 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">
                Who can create entries on CivicCare?
              </p>
              <p className="mt-2 text-[#2d361b]/80">
                Registered citizens can submit requests. Staff and admins manage handling steps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">
                When can I change or remove my submission?
              </p>
              <p className="mt-2 text-[#2d361b]/80">
                Changes and deletion are allowed only while status remains pending.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">
                What causes rejection?
              </p>
              <p className="mt-2 text-[#2d361b]/80">
                Missing location/photo, unclear details, duplicates, or category mismatch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#2d361b]/10">
              <p className="font-semibold text-[#2d361b]">
                How do premium and boost differ?
              </p>
              <p className="mt-2 text-[#2d361b]/80">
                Premium removes the free-user submission limit. Boost elevates one item’s priority.
              </p>
            </div>
          </div>
        </div>

        {/* Rules & Policies */}
        <div
          data-aos="fade-up"
          className="mt-14 p-8 rounded-2xl bg-gradient-to-br from-[#1c260f] via-[#1f2b12] to-[#141b0a] border border-[#2f3a1a]"
        >
          <h2 className="text-2xl font-semibold text-[#f4f6e8]">
            Rules & Policies
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
              <p className="font-semibold text-[#e6ecd1]">Voting</p>
              <ul className="mt-3 space-y-2 text-[#8e9960]">
                <li>• One vote per account for the same entry.</li>
                <li>• Owners cannot vote on their own submissions.</li>
                <li>• Login is required to vote.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
              <p className="font-semibold text-[#e6ecd1]">Limits & Access</p>
              <ul className="mt-3 space-y-2 text-[#8e9960]">
                <li>• Free accounts can submit up to three items.</li>
                <li>• Premium accounts have no submission limit.</li>
                <li>• Blocked users can sign in but actions are restricted.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
              <p className="font-semibold text-[#e6ecd1]">Assignment & Updates</p>
              <ul className="mt-3 space-y-2 text-[#8e9960]">
                <li>• Staff assignment is one-time (no reassignment).</li>
                <li>• Status changes follow a fixed sequence.</li>
                <li>• Operational notes appear in the timeline.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
              <p className="font-semibold text-[#e6ecd1]">History Integrity</p>
              <ul className="mt-3 space-y-2 text-[#8e9960]">
                <li>• Timeline entries are read-only.</li>
                <li>• Key actions generate new timeline records.</li>
                <li>• Misuse may lead to restrictions.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpGuidelines;
