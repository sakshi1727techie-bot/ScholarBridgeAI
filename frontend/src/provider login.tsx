import React, { useState } from "react";
import "./provider login.css";

interface LoginResponse {
  token?: string;
  user_id?: number;
  email?: string;
  role?: string;
  message?: string;
  detail?: string;
}

interface ProviderLoginProps {
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
  onLoginSuccess?: () => void;
}

const ProviderLogin: React.FC<ProviderLoginProps> = ({
  onCreateAccount,
  onForgotPassword,
  onLoginSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // =========================
    // VALIDATION
    // =========================

    if (!email.trim()) {
      setErrorMessage(
        "Please enter your registered email address."
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        "Please enter your password."
      );
      return;
    }

    setLoading(true);

    try {
      // =========================
      // LOGIN API
      // =========================

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

      const data: LoginResponse =
        await response.json();

      console.log(
        "Provider Login Response:",
        data
      );

      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            data.detail ||
            "Invalid email or password. Please try again."
        );

        return;
      }

      // =========================
      // PROVIDER ROLE CHECK
      // =========================

      if (
        data.role?.toUpperCase() !==
        "PROVIDER"
      ) {
        setErrorMessage(
          "This account is not registered as a Scholarship Provider."
        );

        return;
      }

      // =========================
      // TOKEN CHECK
      // =========================

      if (!data.token) {
        setErrorMessage(
          "Login successful, but authentication token was not received."
        );

        return;
      }

      // =========================
      // CLEAR OLD PROVIDER SESSION
      // =========================

      localStorage.removeItem(
        "provider_token"
      );

      sessionStorage.removeItem(
        "provider_token"
      );

      // =========================
      // SAVE TOKEN
      // =========================

      if (remember) {
        localStorage.setItem(
          "provider_token",
          data.token
        );
      } else {
        sessionStorage.setItem(
          "provider_token",
          data.token
        );
      }

      // =========================
      // SAVE USER INFORMATION
      // =========================

      if (data.user_id !== undefined) {
        localStorage.setItem(
          "provider_user_id",
          String(data.user_id)
        );
      }

      if (data.email) {
        localStorage.setItem(
          "provider_email",
          data.email
        );
      }

      localStorage.setItem(
        "provider_role",
        "PROVIDER"
      );

      // =========================
      // SUCCESS MESSAGE
      // =========================

      setSuccessMessage(
        "Provider login successful! Opening dashboard..."
      );

      console.log(
        "Provider login successful:",
        data
      );

      // =========================
      // OPEN PROVIDER DASHBOARD
      // =========================

      if (onLoginSuccess) {
        onLoginSuccess();
      }

    } catch (error) {

      console.error(
        "Provider login error:",
        error
      );

      setErrorMessage(
        "Unable to connect to the server. Please make sure the Django backend is running."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="provider-page">

      {/* LEFT PROFESSIONAL VISUAL PANEL */}

      <section className="provider-visual">

        <div className="visual-shade" />

        <div className="visual-content">

          <div className="provider-badge">

            <span className="badge-dot" />

            SCHOLARBRIDGEAI • PROVIDER PORTAL

          </div>

          <h1>
            Scholarship Provider Portal
          </h1>

          <p>
            Empowering organizations to connect
            deserving students with meaningful
            scholarship opportunities.
          </p>

          <div className="visual-features">

            <div className="feature-pill">
              <span>✓</span>
              Create &amp; Manage Scholarships
            </div>

            <div className="feature-pill">
              <span>✓</span>
              Review Student Applications
            </div>

            <div className="feature-pill">
              <span>✓</span>
              Connect with Eligible Students
            </div>

          </div>

        </div>

      </section>


      {/* RIGHT LOGIN PANEL */}

      <section className="provider-form-side">

        <header className="top-nav">

          <div className="brand">

            <span className="brand-mark">
              <span />
            </span>

            <span>
              ScholarBridgeAI
            </span>

          </div>

          <div className="top-links">

            <span>
              Need support?
            </span>

            <button type="button">
              Provider Help Desk
            </button>

          </div>

        </header>


        <div className="login-wrap">

          <div className="portal-tag">

            <span>▣</span>

            Scholarship Provider Portal

          </div>


          <h2>
            Welcome Back
          </h2>


          <p className="subtitle">

            Sign in to manage your scholarship
            opportunities, review student
            applications, and evaluate funding
            allocations.

          </p>


          {/* ERROR MESSAGE */}

          {errorMessage && (

            <div
              style={{
                marginBottom: "18px",
                padding: "11px 14px",
                borderRadius: "7px",
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >

              {errorMessage}

            </div>

          )}


          {/* SUCCESS MESSAGE */}

          {successMessage && (

            <div
              style={{
                marginBottom: "18px",
                padding: "11px 14px",
                borderRadius: "7px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#047857",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >

              {successMessage}

            </div>

          )}


          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="field-group">

              <div className="field-label-row">

                <label htmlFor="provider-email">
                  EMAIL ADDRESS *
                </label>

                <span>
                  Use your registered email
                </span>

              </div>


              <div className="input-box">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="provider-email"
                  type="email"
                  placeholder="admin@scholarprovider.org"
                  autoComplete="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="field-group password-group">

              <div className="field-label-row">

                <label htmlFor="provider-password">
                  PASSWORD *
                </label>

                <button
                  className="forgot-button"
                  type="button"
                  onClick={onForgotPassword}
                >
                  Forgot Password?
                </button>

              </div>


              <div className="input-box">

                <span className="input-icon">
                  ♙
                </span>

                <input
                  id="provider-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />


                <button
                  className="password-toggle"
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                >
                  {showPassword
                    ? "◉"
                    : "◌"}
                </button>

              </div>

            </div>


            {/* REMEMBER ME */}

            <label className="remember-row">

              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(
                    e.target.checked
                  )
                }
              />

              <span className="custom-checkbox">
                ✓
              </span>

              <span>
                Keep me signed in on this device
              </span>

            </label>


            {/* SIGN IN */}

            <button
              className="sign-in-button"
              type="submit"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >

              <span>
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </span>

              <span className="arrow">

                {loading
                  ? "..."
                  : "→"}

              </span>

            </button>

          </form>


          <div className="divider">

            <span>
              OR
            </span>

          </div>


          {/* REGISTER */}

          <div className="register-card">

            <p>
              New to ScholarBridgeAI?
            </p>

            <button
              type="button"
              onClick={onCreateAccount}
            >

              <span>
                ▣
              </span>

              Register as a Scholarship Provider

            </button>


            <div className="register-links">

              <span>
                Universities
              </span>

              <i>
                •
              </i>

              <span>
                Foundations
              </span>

              <i>
                •
              </i>

              <span>
                NGOs
              </span>

              <i>
                •
              </i>

              <span>
                Corporations
              </span>

            </div>

          </div>


          {/* SECURITY */}

          <div className="security-note">

            <span className="secure-dot">
              ✓
            </span>

            <strong>
              Secure &amp; Trusted
            </strong>

            <span>
              Your information is protected with
              enterprise-grade security.
            </span>

          </div>

        </div>


        {/* FOOTER */}

        <footer className="footer">

          <span>
            © 2026 ScholarBridgeAI.
            All rights reserved.
          </span>

          <div>

            <button type="button">
              Security
            </button>

            <button type="button">
              Privacy Policy
            </button>

            <button type="button">
              Terms of Service
            </button>

          </div>

        </footer>

      </section>

    </main>
  );
};

export default ProviderLogin;