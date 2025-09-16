import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "@/lib/authApi";
import { storeAccessToken, storeProfileBasics } from "@/lib/auth";
import toast from "@/lib/toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const user = await loginUser({ email, password });
      if (!user?.accessToken) throw new Error("No access token returned.");

      // 1) token for axios
      storeAccessToken(user.accessToken);

      // 2) cache basics for Profile/Navbar
      storeProfileBasics({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar?.url ?? null,
        coverUrl: user.banner?.url ?? null,
      });

      toast.miniSuccess(`Welcome, ${user.name}`);
      navigate("/profile");
    } catch (e) {
      const m = e?.response?.data?.message || e.message || "Login failed";
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-12">
      <div className="card-sand mx-auto w-[420px] max-w-full">
        <h1 className="font-higuen text-center text-ocean text-xl mb-5">Log in</h1>

        <form onSubmit={onSubmit} className="space-y-3" aria-busy={loading}>
          <div>
            <label className="block mb-1 text-sm text-ocean">Email</label>
            <input
              className="input-auth w-full border-none bg-white"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="first.last@stud.noroff.no"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-ocean">Password</label>
            <input
              className="input-auth w-full border-none bg-white"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          {err && (
            <p className="rounded-[5px] bg-red-50 px-3 py-2 text-sm text-red-700" aria-live="polite">
              {err}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-ocean w-full disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-ocean">
          Don’t have an account yet?{" "}
          <Link to="/register" className="underline text-ocean">
            Register here!
          </Link>
        </p>
      </div>
    </div>
  );
}
