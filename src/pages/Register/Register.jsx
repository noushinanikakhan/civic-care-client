import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser, updateUserProfile, googleSignIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const photoURL = e.target.photoURL.value.trim();

    // ✅ client-side validation to avoid 400
    if (!photoURL) {
      Swal.fire({
        icon: "error",
        title: "Photo URL required",
        text: "Paste an Unsplash/public image link.",
      });
      return;
    }

    try {
      setLoading(true);

      // 1) Firebase create user
      await registerUser(email, password);

      // 2) Firebase profile update (for navbar display)
      await updateUserProfile(name, photoURL);

      // 3) Save user to MongoDB (MUST succeed)
      const mongoRes = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, photoURL }),
      });

      const mongoData = await mongoRes.json();

      if (!mongoRes.ok || !mongoData.success) {
        throw new Error(mongoData?.message || "Failed to save user in MongoDB");
      }

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);

      const result = await googleSignIn();
      const currentUser = result.user;

      const email = (currentUser.email || "").trim();
      const name =
        (currentUser.displayName || "").trim() || email.split("@")[0];

      // ✅ Google must also provide a photoURL (backend requires it)
      // If Google photoURL is missing, block and ask user to use email/password register or set photo.
      const photoURL = (currentUser.photoURL || "").trim();

      if (!photoURL) {
        Swal.fire({
          icon: "error",
          title: "Google photo missing",
          text: "Your Google account did not provide a photo URL. Please register with email + photo URL.",
        });
        return;
      }

      const mongoRes = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, photoURL }),
      });

      const mongoData = await mongoRes.json();

      if (!mongoRes.ok || !mongoData.success) {
        throw new Error(mongoData?.message || "Failed to save Google user in DB");
      }

      Swal.fire({
        icon: "success",
        title: "Logged in",
        timer: 900,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Google login failed",
        text: err?.message || "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#eff0e1] flex items-center justify-center py-10">
      <div className="w-11/12 max-w-xl rounded-3xl border border-[#2d361b]/10 bg-white/60 p-8">
        <h2 className="text-2xl font-bold text-[#2d361b]">Create Account</h2>
        <p className="mt-2 text-[#2d361b]/70">Paste a photo URL.</p>

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
              required
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
              required
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
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-[#2d361b]">Photo URL</span>
            </label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://images.unsplash.com/..."
              className="input input-bordered w-full bg-white"
              required
            />
          </div>

          <button
            disabled={loading}
            className="btn w-full bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none"
            type="submit"
          >
            {loading ? "Creating..." : "Register"}
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
    </section>
  );
};

export default Register;
