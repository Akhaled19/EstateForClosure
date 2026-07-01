import { useState } from "react";
import { useNavigate } from "react-router-dom";
import movingImg from "../assets/Moving-pana.svg";
import "./login.css";
import { loginUser } from "../services/auth"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const naviagte = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access_token);
      naviagte("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="lp-page">
      <div className="lp-left">
        <div className="lp-left-content">
          <p className="lp-app-name">Estate<span>Forclosure</span></p>
          <p className="lp-tagline">Move it. List it.<br />Sell it fast.</p>
          <img src={movingImg} alt="Two people moving a sofa" className="lp-img" />
        </div>
      </div>

      <div className="lp-right">
        <p className="lp-brand">Estate<span>Forclosure</span></p>
        <p className="lp-form-sub">Sign in to your account</p>

        <div className="lp-field">
          <label className="lp-label">Email</label>
          <input
            className="lp-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="lp-field">
          <label className="lp-label">Password</label>
          <input
            className="lp-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="lp-error">{error}</p>}

        <div className="lp-row">
          <a href="#" className="lp-forgot">Forgot password?</a>
        </div>

        <button className="lp-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="lp-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>

      <a
        href="https://storyset.com/people"
        target="_blank"
        rel="noreferrer"
        className="lp-credit"
      >
        People illustrations by Storyset
      </a>
    </div>
  );
}