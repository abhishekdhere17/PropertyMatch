
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await authService.login({ email, password });
    const role = data.user?.role ?? data.role;

    console.log("Detected role:", role);
    console.log("Saved user:", localStorage.getItem("user"));

    // Send admins directly to the admin dashboard.
    if (role === "MAIN_ADMIN" || role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else if (role === "SELLER") {
      navigate("/seller", { replace: true });
    } else if (location.state?.from?.pathname) {
      navigate(location.state.from.pathname, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  } catch (err) {
    console.error("Login error:", err);
    setError(
      err.response?.data?.message ||
      "Login failed. Check your credentials and backend connection."
    );
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login to PropertyMatch</h1>
        <p>Access your saved properties and account.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
