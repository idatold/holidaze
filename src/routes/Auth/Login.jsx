import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // we'll hook API here later
  }

  return (
    <div className="py-12">
      <div className="card-sand mx-auto w-[420px] max-w-full">
        <h1 className="font-higuen text-center text-ocean text-xl mb-5">Log in</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm text-ocean">Email</label>
            <input
              className="input-auth w-full border-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-ocean">Password</label>
            <input
              className="input-auth w-full border border-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-ocean w-full"
          >
            Log in
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-ocean">
          Don’t have an account yet?{" "}
          <Link to="/register" className="underline text-[#006492] text-ocean">
            Register here!
          </Link>
        </p>
      </div>
    </div>
  );
}
