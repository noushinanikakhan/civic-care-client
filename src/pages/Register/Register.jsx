import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
// import useAuth from "../../../hooks/useAuth"; // ✅ use your actual path

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // const { registerUser, updateUserProfile, googleSignIn } = useAuth(); // ✅ connect later

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const photoFile = e.target.photo.files?.[0];

    if (!name || !email || !password || !photoFile) {
      Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Name, email, password, and photo are required.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak password",
        text: "Password should be at least 6 characters.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ Step 1: Create account (Firebase)
      // const result = await registerUser(email, password);

      // ✅ Step 2: Upload photo -> get URL (ImgBB / Cloudinary)
      // const photoURL = await uploadImage(photoFile);

      // ✅ Step 3: Update profile
      // await updateUserProfile(name, photoURL);

      // ✅ Step 4: Save user in DB (role: citizen, premium: false, blocked: false)
      // await axiosPublic.post("/users", {
      //   name,
      //   email,
      //   photoURL,
      //   role: "citizen",
      //   isPremium: false,
      //   isBlocked: false,
      //   createdAt: new Date(),
      // });

      Swal.fire({
        icon: "success",
        title: "Account created",
        text: "Registration completed successfully.",
        confirmButtonColor: "#2d361b",
      });

      navigate("/", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err?.message || "Please try again.",
        confirmButtonColor: "#2d361b",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);

      // ✅ connect your auth
      // const result = await googleSignIn();
      // Save user in DB if new

      Swal.fire({
        icon: "success",
        title: "Signed up with Google",
        text: "Your account is ready.",
        confirmButtonColor: "#2d361b",
      });

      navigate("/", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google sign-up failed",
        text: err?.message || "Please try again.",
        confirmButtonColor: "#2d361b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#eff0e1] flex items-center justify-center py-10">
      <div className="w-11/12 max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-[#2d361b]/10 bg-white/60">
        {/* Left panel */}
        <div className="p-8 lg:p-10 bg-gradient-to-br from-[#1c260f] via-[#1f2b12] to-[#141b0a]">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#f4f6e8]">
            Create Your Account
          </h1>
          <p className="mt-3 text-[#9aa36a] leading-relaxed">
            Register to submit cases, track updates, and manage your activity from the dashboard.
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
            <p className="font-semibold text-[#e6ecd1]">Citizen plan</p>
            <p className="mt-2 text-[#8e9960] text-sm leading-relaxed">
              Free users can submit up to three cases. Premium removes the limit.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-[#2d361b]">Registration</h2>
          <p className="mt-2 text-[#2d361b]/70">
            Provide your details and upload a profile photo.
          </p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Photo</span>
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="file-input file-input-bordered w-full bg-white"
              />
            </div>

            <button
              disabled={loading}
              className="btn w-full bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none"
              type="submit"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#2d361b]/15" />
            <span className="text-sm text-[#2d361b]/60">OR</span>
            <div className="h-px flex-1 bg-[#2d361b]/15" />
          </div>

          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="btn w-full rounded-2xl bg-white border border-[#2d361b]/20 text-[#2d361b] hover:bg-[#2d361b] hover:text-[#d6d37c]"
          >
            Sign up with Google
          </button>

          <p className="mt-6 text-[#2d361b]/70">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#2d361b] underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
