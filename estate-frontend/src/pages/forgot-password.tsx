import { useState } from "react";
import { useNavigate } from "react-router-dom";
import movingImg from "../assets/Moving-pana.svg";
import "./forgot-password.css";
import { forgotPassword } from "../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-left">
        <div className="fp-left-content">
          <p className="fp-app-name">Estate<span>Forclosure</span></p>
          <p className="fp-tagline">Move it. List it.<br />Sell it fast.</p>
          <img src={movingImg} alt="Two people moving a sofa" className="fp-img" />
        </div>
      </div>

      <div className="fp-right">
        <p className="fp-brand">Estate<span>Forclosure</span></p>

        {success ? (
          <>
            <p className="fp-form-sub">Check your email</p>
            <p className="fp-success-text">
              We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
            </p>
            <button className="fp-btn" onClick={() => navigate("/login")}>
              Back to sign in
            </button>
          </>
        ) : (
          <>
            <p className="fp-form-sub">Enter your email and we'll send you a reset link</p>

            <div className="fp-field">
              <label className="fp-label">Email</label>
              <input
                className="fp-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="fp-error">{error}</p>}

            <button className="fp-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <p className="fp-footer">
              Remember your password? <a href="/login">Sign in</a>
            </p>
          </>
        )}
      </div>

      <a
        href="https://storyset.com/people"
        target="_blank"
        rel="noreferrer"
        className="fp-credit"
      >
        People illustrations by Storyset
      </a>
    </div>
  );
}