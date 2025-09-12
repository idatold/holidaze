import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/lib/authApi";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // quick client-side checks to match docs
    if (!email.endsWith("@stud.noroff.no")) {
      setErr("Use your @stud.noroff.no email.");
      return;
    }
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password, venueManager });
      navigate("/login"); // success → go log in
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-12">
      <div className="card-sand mx-auto w-[420px] max-w-full">
        <h1 className="font-higuen text-center text-ocean text-xl mb-5">Register</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm text-ocean">Name</label>
            <input
              className="input-auth w-full border-none bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your_username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-ocean">Email</label>
            <input
              className="input-auth w-full border-none bg-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="first.last@stud.noroff.no"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-ocean">Password</label>
            <input
              className="input-auth w-full border-none bg-white"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {/* Venue manager toggle stays the same */}
          <div className="pt-1">
            <span className="block mb-1 text-sm text-ocean">Venue manager</span>
            <button
              type="button"
              role="switch"
              aria-checked={venueManager}
              aria-label="Venue manager"
              onClick={() => setVenueManager(v => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                ${venueManager ? "bg-ocean-deep" : "bg-ocean"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition
                ${venueManager ? "translate-x-5" : "translate-x-1"}`} />
            </button>
          </div>

          {err && (
            <p className="rounded-[5px] bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
          )}

          <button type="submit" className="btn btn-ocean w-full" disabled={loading}>
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-ocean">
          Already have an account?{" "}
          <Link to="/login" className="underline text-ocean">Login here!</Link>
        </p>
      </div>
    </div>
  );
}
