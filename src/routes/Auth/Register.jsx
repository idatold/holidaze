import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    // TODO: API call with { name, email, password, venueManager }
    // navigate("/login");
  }

  return (
    <div className="py-12">
      <div className="card-sand mx-auto w-[420px] max-w-full">
        <h1 className="font-higuen text-center text-ocean text-xl mb-5">Register</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1 text-sm text-ocean">Name</label>
            <input
              id="name"
              className="input-auth w-full border-none bg-white"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm text-ocean">Email</label>
            <input
              id="email"
              className="input-auth w-full border-none bg-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm text-ocean">Password</label>
            <input
              id="password"
              className="input-auth w-full border-none bg-white"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          {/* Venue manager toggle */}
          <div className="pt-1">
            <span className="block mb-1 text-sm text-ocean">Venue manager</span>

            <button
  type="button"
  role="switch"
  aria-checked={venueManager}
  onClick={() => setVenueManager(v => !v)}
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition
    ${venueManager ? "bg-ocean-deep" : "bg-ocean"}`}
>
  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition
    ${venueManager ? "translate-x-5" : "translate-x-1"}`} />
</button>


            {/* Hidden checkbox to preserve form semantics */}
            <input
              type="checkbox"
              name="venueManager"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
              className="sr-only"
            />
          </div>

          <button type="submit" className="btn btn-ocean w-full">Register</button>
        </form>

        <p className="mt-3 text-center text-sm text-ocean">
          Already have an account?{" "}
          <Link to="/login" className="underline text-ocean">Login here!</Link>
        </p>
      </div>
    </div>
  );
}
