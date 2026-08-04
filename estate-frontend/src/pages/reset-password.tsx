import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import movingImg from "../assets/Moving-pana.svg";
import "./reset-password.css";
import { supabase } from "../lib/supabaseClient";
import { resetPassword } from "../services/auth";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setReady(true);
            }
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    const handleReset = async () => {
        if (!password || !confirm) {
            setError("Please fill in both fields.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await resetPassword(password);
            setSuccess(true);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (!ready && !success) {
        return (
            <div className="rp-page">
                <div className="rp-left">
                    <div className="rp-left-content">
                        <p className="rp-app-name">Estate<span>Forclosure</span></p>
                        <p className="rp-tagline">Move it. List it.<br />Sell it fast.</p>
                        <img src={movingImg} alt="Two people moving a sofa" className="rp-img" />
                    </div>
                </div>
                <div className="rp-invalid">
                    <p className="rp-brand">Estate<span>Forclosure</span></p>
                    <p>Verifying your reset link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rp-page">
            <div className="rp-left">
                <div className="rp-left-content">
                    <p className="rp-app-name">Estate<span>Forclosure</span></p>
                    <p className="rp-tagline">Move it. List it.<br />Sell it fast.</p>
                    <img src={movingImg} alt="Two people moving a sofa" className="rp-img" />
                </div>
            </div>

            <div className="rp-right">
                <p className="rp-brand">Estate<span>Forclosure</span></p>

                {success ? (
                    <>
                        <p className="rp-form-sub">Password updated</p>
                        <p className="rp-success-text">
                            Your password has been reset. You can now sign in with your new password.
                        </p>
                        <button className="rp-btn" onClick={() => navigate("/login")}>
                            Back to sign in
                        </button>
                    </>
                ) : (
                    <>
                        <p className="rp-form-sub">Choose a new password for your account</p>

                        <div className="rp-field">
                            <label className="rp-label">New password</label>
                            <input
                                className="rp-input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="rp-field">
                            <label className="rp-label">Confirm new password</label>
                            <input
                                className="rp-input"
                                type="password"
                                placeholder="••••••••"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </div>

                        {error && <p className="rp-error">{error}</p>}

                        <button className="rp-btn" onClick={handleReset} disabled={loading}>
                            {loading ? "Updating..." : "Reset password"}
                        </button>

                        <p className="rp-footer">
                            Remember your password? <a href="/login">Sign in</a>
                        </p>
                    </>
                )}
            </div>
            <a

                href="https://storyset.com/people"
                target="_blank"
                rel="noreferrer"
                className="rp-credit"
            >
                People illustrations by Storyset
            </a>
        </div>
    );
}