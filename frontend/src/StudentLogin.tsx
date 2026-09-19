import React, { useState } from "react";
import "./StudentLogin.css";

interface StudentLoginProps {
    onCreateAccount?: () => void;
    onForgotPassword?: () => void;
    onLoginSuccess?: () => void;
}

export default function StudentLogin({
    onCreateAccount,
    onForgotPassword,
    onLoginSuccess,
}: StudentLoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://127.0.0.1:8000/api/accounts/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Invalid email or password."
                );
                return;
            }

            if (data.role !== "STUDENT") {
                setError(
                    "This login is only available for students."
                );
                return;
            }

            // Save token
            localStorage.setItem(
                "scholarbridge_token",
                data.token
            );

            // Save user information
            localStorage.setItem(
                "scholarbridge_user",
                JSON.stringify({
                    user_id: data.user_id,
                    email: data.email,
                    role: data.role,
                })
            );

            // Login successful
            if (onLoginSuccess) {
                onLoginSuccess();
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                "Unable to connect to the server. Please make sure Django server is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* Top Header */}
            <header className="login-header">

                <div className="brand">
                    <span className="brand-icon">🎓</span>
                    <span>ScholarBridge AI</span>
                </div>

                <div className="security-badge">
                    🔒 256-BIT INSTITUTIONAL ENCRYPTION
                </div>

            </header>

            {/* Main Login Area */}
            <main className="login-main">

                <div className="login-container">

                    {/* LEFT IMAGE SECTION */}
                    <section className="login-image-section">

                        <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=90"
                            alt="Students celebrating their academic journey"
                            className="student-image"
                        />

                        <div className="image-overlay"></div>

                        <div className="image-top-badges">
                            <span>
                                ✓ Verified Student Network
                            </span>

                            <span>
                                ◉ $14.2M+ Awarded in 2024
                            </span>
                        </div>

                        <div className="image-content">

                            <div className="small-label">
                                ✦ SCHOLARSHIP OPPORTUNITIES
                            </div>

                            <h1>
                                Your Future
                                <br />
                                Starts Here
                            </h1>

                            <p>
                                Discover the right scholarships and take the next
                                step toward your dreams with tailored AI precision.
                            </p>

                            <div className="image-features">

                                <span>
                                    ✦ AI-Powered Matching
                                </span>

                                <span>
                                    ◉ 100% Free for Students
                                </span>

                                <span>
                                    ◯ Institutional Trust
                                </span>

                            </div>

                        </div>

                    </section>

                    {/* RIGHT LOGIN SECTION */}
                    <section className="login-form-section">

                        <div className="login-form-wrapper">

                            {/* Logo */}
                            <div className="institution-logo">
                                🎓
                            </div>

                            <div className="institution-info">

                                <strong>
                                    ScholarBridge AI
                                </strong>

                                <span>
                                    Institutional Gateway
                                </span>

                            </div>

                            {/* Welcome */}
                            <div className="welcome-section">

                                <h2>
                                    Welcome Back
                                </h2>

                                <p>
                                    Sign in to continue your scholarship journey.
                                </p>

                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleLogin}>

                                {/* Email */}
                                <div className="form-group">

                                    <label>
                                        EMAIL ADDRESS <span>*</span>
                                    </label>

                                    <div className="input-wrapper">

                                        <span className="input-icon">
                                            ✉
                                        </span>

                                        <input
                                            type="email"
                                            placeholder="Enter your student or personal email"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                            required
                                        />

                                    </div>

                                </div>

                                {/* Password */}
                                <div className="form-group">

                                    <div className="password-label-row">

                                        <label>
                                            PASSWORD <span>*</span>
                                        </label>

                                        <button
                                            type="button"
                                            className="forgot-password"
                                            onClick={onForgotPassword}
                                        >
                                            Forgot Password?
                                        </button>

                                    </div>

                                    <div className="input-wrapper">

                                        <span className="input-icon">
                                            🔒
                                        </span>

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="eye-button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? "◉" : "◌"}
                                        </button>

                                    </div>

                                </div>

                                {/* Error */}
                                {error && (
                                    <div
                                        style={{
                                            color: "#dc2626",
                                            backgroundColor: "#fef2f2",
                                            border: "1px solid #fecaca",
                                            borderRadius: "8px",
                                            padding: "10px 12px",
                                            marginBottom: "14px",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {error}
                                    </div>
                                )}

                                {/* Sign In */}
                                <button
                                    type="submit"
                                    className="sign-in-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Signing In..."
                                        : "Sign In"}

                                    {!loading && (
                                        <span>→</span>
                                    )}
                                </button>

                            </form>

                            {/* Divider */}
                            <div className="divider">

                                <span></span>

                                <small>
                                    OR
                                </small>

                                <span></span>

                            </div>

                            {/* Create Account */}
                            <p className="new-user">
                                New to ScholarBridge AI?
                            </p>

                            <button
                                type="button"
                                className="create-account-button"
                                onClick={onCreateAccount}
                            >
                                ♙ &nbsp; Create an Account
                            </button>

                            {/* Privacy */}
                            <div className="privacy-note">
                                ◉ &nbsp; 256-bit SSL Encrypted • FERPA & Student Privacy Compliant
                            </div>

                        </div>

                    </section>

                </div>

            </main>

            {/* Footer */}
            <footer className="login-footer">

                <span>
                    © 2025 ScholarBridge AI. All rights reserved.
                </span>

                <div>

                    <span>
                        Privacy Policy
                    </span>

                    <span>
                        Terms of Service
                    </span>

                    <span>
                        Institutional Support
                    </span>

                    <span>
                        Security Standards
                    </span>

                </div>

            </footer>

        </div>
    );
}