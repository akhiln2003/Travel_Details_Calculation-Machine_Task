import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../lib/api-client";
import type { ApiError } from "../types/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
      navigate("/");
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.response?.data?.error?.message ||
        apiError.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="12" />
              <line x1="12" y1="12" x2="16" y2="16" />
            </svg>
            <span className="text-2xl font-bold text-black">Speedo</span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Sign in</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Example@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
