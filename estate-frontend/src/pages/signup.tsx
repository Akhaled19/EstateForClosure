import { useState } from "react";
import movingImg from "../assets/Moving-pana.svg";
import { registerUser } from "../services/auth"

import "./Signup.css";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(fullName, email, password);
      localStorage.setItem("token", data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="sp-page">
      <div className="sp-left">
        <div className="sp-left-content">
          <p className="sp-app-name">Estate<span>Foreclosure</span></p>
          <p className="sp-tagline">Move it. List it.<br />Sell it fast.</p>
          <img src={movingImg} alt="Two people moving a sofa" className="sp-img" />
        </div>
      </div>

      <div className="sp-right">
        <p className="sp-brand">Estate<span>Foreclosure</span></p>
        <p className="sp-form-sub">Create your account</p>

        <div className="sp-field">
          <label className="sp-label">Full Name</label>
          <input
            className="sp-input"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="sp-field">
          <label className="sp-label">Email</label>
          <input
            className="sp-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="sp-field">
          <label className="sp-label">Password</label>
          <input
            className="sp-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="sp-field">
          <label className="sp-label">Confirm Password</label>
          <input
            className="sp-input"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && <p className="sp-error">{error}</p>}

        <button className="sp-btn" onClick={handleSignUp} disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="sp-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}