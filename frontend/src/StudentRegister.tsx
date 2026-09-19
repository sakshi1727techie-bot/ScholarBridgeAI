import React, { useState } from "react";
import "./StudentRegister.css";

interface StudentRegisterProps {
    onBackToLogin?: () => void;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    mobile?: string;
    income?: string;
    category?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
}

export default function StudentRegister({
    onBackToLogin,
}: StudentRegisterProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [income, setIncome] = useState("");
    const [category, setCategory] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setServerError("");
        setSuccessMessage("");

        const newErrors: FormErrors = {};

        // FULL NAME
        if (!fullName.trim()) {
            newErrors.fullName =
                "Please enter your full name.";
        }

        // EMAIL
        if (!email.trim()) {
            newErrors.email =
                "Please enter your email address.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            newErrors.email =
                "Please enter a valid email address.";
        }

        // MOBILE NUMBER
        if (!mobile) {
            newErrors.mobile =
                "Please enter your mobile number.";
        } else if (!/^\d{10}$/.test(mobile)) {
            newErrors.mobile =
                "Mobile number must be exactly 10 digits.";
        }

        // FAMILY INCOME
        if (!income) {
            newErrors.income =
                "Please select your annual family income.";
        }

        // CATEGORY
        if (!category) {
            newErrors.category =
                "Please select your caste/category.";
        }

        // PASSWORD
        if (!password) {
            newErrors.password =
                "Please create a password.";
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

        // CONFIRM PASSWORD
        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }

        // TERMS
        if (!termsAccepted) {
            newErrors.terms =
                "Please accept the Terms of Service and Privacy Policy.";
        }

        setErrors(newErrors);

        // STOP IF VALIDATION FAILED
        if (Object.keys(newErrors).length !== 0) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://127.0.0.1:8000/api/accounts/register/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        full_name: fullName.trim(),
                        email: email.trim(),
                        mobile: mobile,
                        family_income: income,
                        category: category.toUpperCase(),
                        password: password,
                        confirm_password: confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            console.log("Registration response:", data);

            if (!response.ok) {
                console.log(
                    "Registration error:",
                    data
                );

                if (data.email) {
                    setServerError(
                        Array.isArray(data.email)
                            ? data.email[0]
                            : data.email
                    );
                } else if (data.message) {
                    setServerError(
                        data.message
                    );
                } else if (data.detail) {
                    setServerError(
                        data.detail
                    );
                } else {
                    setServerError(
                        "Registration failed. Please check your details."
                    );
                }

                return;
            }

            setSuccessMessage(
                "Account successfully created! Redirecting to login..."
            );

            setTimeout(() => {
                onBackToLogin?.();
            }, 1500);

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setServerError(
                "Unable to connect to the server. Please make sure Django server is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            {/* ================= HEADER ================= */}

            <header className="register-header">

                <div className="register-brand">
                    <span className="register-brand-icon">
                        🎓
                    </span>

                    <span>
                        ScholarBridge AI
                    </span>
                </div>

                <div className="register-security-badge">
                    🔒 256-BIT INSTITUTIONAL ENCRYPTION
                </div>

            </header>

            {/* ================= MAIN ================= */}

            <main className="register-main">

                <div className="register-container">

                    {/* ================= LEFT IMAGE ================= */}

                    <section className="register-image-section">

                        <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=90"
                            alt="Students celebrating their academic journey"
                            className="register-student-image"
                        />

                        <div className="register-image-overlay"></div>

                        <div className="register-image-top-badges">
                            <span>
                                ✓ Verified Student Network
                            </span>

                            <span>
                                ✦ AI-Powered Matching
                            </span>
                        </div>

                        <div className="register-image-content">

                            <div className="register-small-label">
                                ✦ START YOUR JOURNEY
                            </div>

                            <h1>
                                Build Your
                                <br />
                                Future Today
                            </h1>

                            <p>
                                Create your ScholarBridge AI account and
                                discover scholarship opportunities matched
                                to your academic profile.
                            </p>

                            <div className="register-image-features">

                                <span>
                                    ✦ Personalized Scholarships
                                </span>

                                <span>
                                    ◉ 100% Free for Students
                                </span>

                                <span>
                                    ◯ Secure Student Profile
                                </span>

                            </div>

                        </div>

                    </section>

                    {/* ================= RIGHT REGISTER FORM ================= */}

                    <section className="register-form-section">

                        <div className="register-form-wrapper">

                            {/* LOGO */}

                            <div className="register-institution-logo">
                                🎓
                            </div>

                            <div className="register-institution-info">

                                <strong>
                                    ScholarBridge AI
                                </strong>

                                <span>
                                    Student Registration
                                </span>

                            </div>

                            {/* WELCOME */}

                            <div className="register-welcome-section">

                                <h2>
                                    Create Your Account
                                </h2>

                                <p>
                                    Register to discover scholarships made for you.
                                </p>

                            </div>

                            {/* SERVER ERROR */}

                            {serverError && (
                                <div className="register-server-error">
                                    {serverError}
                                </div>
                            )}

                            {/* SUCCESS MESSAGE */}

                            {successMessage && (
                                <div className="register-success-message">
                                    ✓ {successMessage}
                                </div>
                            )}

                            {/* ================= FORM ================= */}

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                            >

                                {/* FULL NAME */}

                                <div className="register-form-group">

                                    <label>
                                        FULL NAME <span>*</span>
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            👤
                                        </span>

                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={fullName}
                                            onChange={(e) =>
                                                setFullName(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    {errors.fullName && (
                                        <p className="register-validation-error">
                                            {errors.fullName}
                                        </p>
                                    )}

                                </div>

                                {/* EMAIL */}

                                <div className="register-form-group">

                                    <label>
                                        EMAIL ADDRESS <span>*</span>
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            ✉
                                        </span>

                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    {errors.email && (
                                        <p className="register-validation-error">
                                            {errors.email}
                                        </p>
                                    )}

                                </div>

                                {/* MOBILE NUMBER */}

                                <div className="register-form-group">

                                    <label>
                                        MOBILE NUMBER <span>*</span>
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            📱
                                        </span>

                                        <input
                                            type="tel"
                                            placeholder="Enter your mobile number"
                                            maxLength={10}
                                            value={mobile}
                                            onChange={(e) =>
                                                setMobile(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    {errors.mobile && (
                                        <p className="register-validation-error">
                                            {errors.mobile}
                                        </p>
                                    )}

                                </div>

                                {/* FAMILY INCOME */}

                                <div className="register-form-group">

                                    <label>
                                        FAMILY INCOME <span>*</span>
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            ₹
                                        </span>

                                        <select
                                            value={income}
                                            onChange={(e) =>
                                                setIncome(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >

                                            <option
                                                value=""
                                                disabled
                                            >
                                                Select annual family income
                                            </option>

                                            <option value="below-1-lakh">
                                                Below ₹1 Lakh
                                            </option>

                                            <option value="1-2-lakh">
                                                ₹1 Lakh – ₹2 Lakh
                                            </option>

                                            <option value="2-3-lakh">
                                                ₹2 Lakh – ₹3 Lakh
                                            </option>

                                            <option value="3-5-lakh">
                                                ₹3 Lakh – ₹5 Lakh
                                            </option>

                                            <option value="5-8-lakh">
                                                ₹5 Lakh – ₹8 Lakh
                                            </option>

                                            <option value="8-10-lakh">
                                                ₹8 Lakh – ₹10 Lakh
                                            </option>

                                            <option value="above-10-lakh">
                                                Above ₹10 Lakh
                                            </option>

                                        </select>

                                    </div>

                                    {errors.income && (
                                        <p className="register-validation-error">
                                            {errors.income}
                                        </p>
                                    )}

                                </div>

                                {/* CASTE */}

                                <div className="register-form-group">

                                    <label>
                                        CASTE / CATEGORY <span>*</span>
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            ◉
                                        </span>

                                        <select
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >

                                            <option
                                                value=""
                                                disabled
                                            >
                                                Select your category
                                            </option>

                                            <option value="general">
                                                General
                                            </option>

                                            <option value="obc">
                                                OBC
                                            </option>

                                            <option value="sc">
                                                SC
                                            </option>

                                            <option value="st">
                                                ST
                                            </option>

                                            <option value="ews">
                                                EWS
                                            </option>

                                            <option value="other">
                                                Other
                                            </option>

                                        </select>

                                    </div>

                                    {errors.category && (
                                        <p className="register-validation-error">
                                            {errors.category}
                                        </p>
                                    )}

                                </div>

                                {/* PASSWORD */}

                                <div className="register-form-group">

                                    <label>
                                        PASSWORD <span>*</span>
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            🔒
                                        </span>

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="register-eye-button"
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
                                            {showPassword
                                                ? "◉"
                                                : "◌"}
                                        </button>

                                    </div>

                                    {errors.password && (
                                        <p className="register-validation-error">
                                            {errors.password}
                                        </p>
                                    )}

                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div className="register-form-group">

                                    <label>
                                        CONFIRM PASSWORD <span>*</span>
                                    </label>

                                    <div className="register-input-wrapper">

                                        <span className="register-input-icon">
                                            🔒
                                        </span>

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm your password"
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
                                            className="register-eye-button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "◉"
                                                : "◌"}
                                        </button>

                                    </div>

                                    {errors.confirmPassword && (
                                        <p className="register-validation-error">
                                            {errors.confirmPassword}
                                        </p>
                                    )}

                                </div>

                                {/* TERMS AND CONDITIONS */}

                                <div className="register-terms">

                                    <input
                                        type="checkbox"
                                        id="registerTerms"
                                        checked={termsAccepted}
                                        onChange={(e) =>
                                            setTermsAccepted(
                                                e.target.checked
                                            )
                                        }
                                        required
                                    />

                                    <label htmlFor="registerTerms">

                                        I agree to the{" "}

                                        <span>
                                            Terms of Service
                                        </span>{" "}

                                        and{" "}

                                        <span>
                                            Privacy Policy
                                        </span>
                                        .

                                    </label>

                                </div>

                                {errors.terms && (
                                    <p className="register-validation-error register-terms-error">
                                        {errors.terms}
                                    </p>
                                )}

                                {/* CREATE ACCOUNT */}

                                <button
                                    type="submit"
                                    className="register-create-button"
                                    disabled={
                                        loading ||
                                        Boolean(successMessage)
                                    }
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"}

                                    {!loading && (
                                        <span>
                                            →
                                        </span>
                                    )}
                                </button>

                            </form>

                            {/* ================= DIVIDER ================= */}

                            <div className="register-divider">

                                <span></span>

                                <small>
                                    OR
                                </small>

                                <span></span>

                            </div>

                            {/* ================= SIGN IN ================= */}

                            <p className="register-existing-user">
                                Already have a ScholarBridge AI account?
                            </p>

                            <button
                                type="button"
                                className="register-login-button"
                                onClick={onBackToLogin}
                            >
                                ← &nbsp; Sign In
                            </button>

                            {/* PRIVACY */}

                            <div className="register-privacy-note">
                                ◉ &nbsp; 256-bit SSL Encrypted • Student Privacy Protected
                            </div>

                        </div>

                    </section>

                </div>

            </main>

            {/* ================= FOOTER ================= */}

            <footer className="register-footer">

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