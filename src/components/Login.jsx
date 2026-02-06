import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { colors, gradients, shadows } from "../theme/colors";
import ParticlesContainer from "./ParticlesContainer";
import Loader from "./Loader";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.secondary[500] }}>
      <ParticlesContainer />
      {loading && <Loader />}
      <div
        className="w-full max-w-2xl p-12 rounded-xl shadow-lg "
        style={{
          backgroundColor: colors.secondary[50],
          boxShadow: shadows.ttLg,
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logoTT.png" alt="logoTT" className="h-16 w-30" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Error Message */}
          {error && (
            <div
              className="p-3 rounded-lg text-white"
              style={{ backgroundColor: '#dc2626' }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition disabled:opacity-50"
            style={{
              borderColor: colors.accent[300],
              backgroundColor: "#fff",
              color: colors.accent[900],
            }}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition disabled:opacity-50"
            style={{
              borderColor: colors.accent[300],
              backgroundColor: "#fff",
              color: colors.accent[900],
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: gradients.primary,
              boxShadow: shadows.ttMd,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.accent[100] }}>
          <p className="text-sm font-semibold mb-2" style={{ color: colors.accent[700] }}>Demo Credentials:</p>
          <p className="text-xs" style={{ color: colors.accent[600] }}>Email: bochra.lbn@tt.com</p>
          <p className="text-xs" style={{ color: colors.accent[600] }}>Password: password123</p>
        </div>

        {/* Footer */}
        <p
          className="text-center text-sm mt-6"
          style={{ color: colors.accent[500] }}
        >
          &copy; {new Date().getFullYear()} Tunisie Telecom. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
