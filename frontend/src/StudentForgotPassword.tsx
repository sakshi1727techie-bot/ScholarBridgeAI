import React, { useState } from "react";
import "./StudentForgotPassword.css";

interface StudentForgotPasswordProps {
    onBackToLogin?: () => void;
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const StudentForgotPassword: React.FC<StudentForgotPasswordProps> = ({
    onBackToLogin,
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<FormErrors>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: FormErrors = {};

        // EMAIL VALIDATION
        if (!email.trim()) {
            newErrors.email = "Please enter your email address.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            newErrors.email = "Please enter a valid email address.";
        }

        // PASSWORD VALIDATION
        if (!password) {
            newErrors.password = "Please create a password.";
        } else if (password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters.";
        } else if (!/[A-Za-z]/.test(password)) {
            newErrors.password =
                "Password must contain at least one letter.";
        } else if (!/\d/.test(password)) {
            newErrors.password =
                "Password must contain at least one number.";
        }

        // CONFIRM PASSWORD VALIDATION
        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }

        setErrors(newErrors);

        // SUCCESS ONLY WHEN EVERYTHING IS VALID
        if (Object.keys(newErrors).length === 0) {
            setSuccessMessage("Password changed successfully!");

            setTimeout(() => {
                onBackToLogin?.();
            }, 2000);
        }
    };

    return (
        <div className="forgot-page">

            {/* HEADER */}
            <header className="forgot-header">
                <div className="forgot-brand">
                    <span className="forgot-brand-icon">🎓</span>
                    <span>ScholarBridge AI</span>
                </div>

                <div className="forgot-security-badge">
                    🔒 256-BIT INSTITUTIONAL ENCRYPTION
                </div>
            </header>

            {/* MAIN */}
            <main className="forgot-main">
                <div className="forgot-container">

                    {/* LEFT IMAGE */}
                    <section className="forgot-image-section">

                        <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=90"
                            alt="Students celebrating their academic journey"
                            className="forgot-student-image"
                        />

                        <div className="forgot-image-overlay"></div>

                        <div className="forgot-image-top-badges">
                            <span>✓ Verified Student Network</span>
                            <span>✦ Secure Account Recovery</span>
                        </div>

                        <div className="forgot-image-content">

                            <div className="forgot-small-label">
                                ✦ ACCOUNT RECOVERY
                            </div>

                            <h1>
                                Reset Your
                                <br />
                                Password
                            </h1>

                            <p>
                                Create a new password and securely continue
                                your scholarship journey with ScholarBridge AI.
                            </p>

                            <div className="forgot-image-features">
                                <span>✦ Secure Password Reset</span>
                                <span>◉ Easy Account Recovery</span>
                                <span>◯ Student Privacy Protected</span>
                            </div>

                        </div>
                    </section>

                    {/* RIGHT FORM */}
                    <section className="forgot-form-section">

                        <div className="forgot-form-wrapper">

                            {/* LOGO */}
                            <div className="forgot-institution-logo">
                                🎓
                            </div>

                            <div className="forgot-institution-info">
                                <strong>ScholarBridge AI</strong>
                                <span>Student Account Recovery</span>
                            </div>

                            {/* WELCOME */}
                            <div className="forgot-welcome-section">

                                <div className="forgot-icon-circle">
                                    🔑
                                </div>

                                <h2>Reset Password</h2>

                                <p>
                                    Enter your registered email and create
                                    a new password for your account.
                                </p>

                            </div>

                            {/* SUCCESS MESSAGE */}
                            {successMessage && (
                                <div className="forgot-success-message">
                                    ✓ {successMessage}
                                </div>
                            )}

                            {/* FORM */}
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                            >

                                {/* EMAIL */}
                                <div className="forgot-form-group">

                                    <label>
                                        EMAIL ADDRESS <span>*</span>
                                    </label>

                                    <div className="forgot-input-wrapper">

                                        <span className="forgot-input-icon">
                                            ✉
                                        </span>

                                        <input
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />

                                    </div>

                                    {errors.email && (
                                        <p className="forgot-validation-error">
                                            {errors.email}
                                        </p>
                                    )}

                                </div>

                                {/* NEW PASSWORD */}
                                <div className="forgot-form-group">

                                    <label>
                                        NEW PASSWORD <span>*</span>
                                    </label>

                                    <div className="forgot-input-wrapper">

                                        <span className="forgot-input-icon">
                                            🔒
                                        </span>

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your new password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="forgot-eye-button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) => !previous
                                                )
                                            }
                                        >
                                            {showPassword ? "◉" : "◌"}
                                        </button>

                                    </div>

                                    {errors.password && (
                                        <p className="forgot-validation-error">
                                            {errors.password}
                                        </p>
                                    )}

                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="forgot-form-group">

                                    <label>
                                        CONFIRM PASSWORD <span>*</span>
                                    </label>

                                    <div className="forgot-input-wrapper">

                                        <span className="forgot-input-icon">
                                            🔒
                                        </span>

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm your new password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="forgot-eye-button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (previous) => !previous
                                                )
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "◉"
                                                : "◌"}
                                        </button>

                                    </div>

                                    {errors.confirmPassword && (
                                        <p className="forgot-validation-error">
                                            {errors.confirmPassword}
                                        </p>
                                    )}

                                </div>

                                {/* RESET PASSWORD */}
                                <button
                                    type="submit"
                                    className="forgot-send-button"
                                    disabled={Boolean(successMessage)}
                                >
                                    Reset Password
                                    <span>→</span>
                                </button>

                            </form>

                            {/* BACK TO LOGIN */}
                            <button
                                type="button"
                                className="forgot-back-button"
                                onClick={onBackToLogin}
                            >
                                ← &nbsp; Back to Sign In
                            </button>

                            {/* SECURITY */}
                            <div className="forgot-security-note">
                                ◉ &nbsp; Your account information is securely protected.
                            </div>

                        </div>
                    </section>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="forgot-footer">

                <span>
                    © 2025 ScholarBridge AI. All rights reserved.
                </span>

                <div>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Institutional Support</span>
                    <span>Security Standards</span>
                </div>

            </footer>

        </div>
    );
};

export default StudentForgotPassword;